# Copilot Instructions: Talking Realtime Avatar

## Project Overview

This is a **3D digital human** that talks and listens using AI. The system combines:
- **Ollama LLM** (SmolLM3-3B-128K, 128K context) for conversation at `192.168.1.98:11434`
- **Chatterbox TTS/STT** (OpenAI-compatible API) at `192.168.1.98:7778` for voice synthesis and transcription
- **Rhubarb Lip-Sync** (local binary) for viseme generation
- **Three.js + React** frontend for 3D avatar rendering with real-time lip sync

## Architecture

### Monorepo Structure (Yarn Workspaces)

```
apps/
  backend/          # Express API server (ES modules, port 9000)
  frontend/         # React + Vite + Three.js (port 5173)
```

Run both: `yarn dev` (uses `npm-run-all --parallel`)

### Data Flow

**Text Input:** User → `/tts` → Ollama → Chatterbox TTS → Rhubarb → Frontend  
**Voice Input:** User → `/sts` → Chatterbox STT → Ollama → Chatterbox TTS → Rhubarb → Frontend

### Message Schema

Backend returns structured JSON with visemes and audio:

```javascript
{
  messages: [
    {
      text: "Response text",
      facialExpression: "smile|sad|angry|surprised|funnyFace|default",
      animation: "Idle|TalkingOne|TalkingThree|SadIdle|Defeated|Angry|Surprised|DismissingGesture|ThoughtfulHeadShake",
      audio: "base64_wav_data",
      lipsync: { metadata: {...}, mouthCues: [...] }
    }
  ]
}
```

Animations from `/models/animations.glb` - skeletal animations for body movement. Facial expressions control morph targets for emotions. Lip sync uses visemes from Rhubarb mapped to morph targets.

## Critical Integration Points

### 1. Ollama Configuration (`apps/backend/modules/openAI.mjs`)

Uses LangChain's `ChatOpenAI` with Ollama endpoint:

```javascript
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "ollama",
  modelName: "hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M",
  configuration: { baseURL: "http://192.168.1.98:11434/v1" }
});
```

**Critical:** Model uses `StructuredOutputParser` with Zod schema for type-safe message generation. Always preserve the schema structure when modifying response handling.

### 2. Chatterbox TTS Integration (`apps/backend/modules/elevenLabs.mjs`)

**DO NOT** modify the TTS request format. These params are optimized for quality:

```javascript
{
  model: "chatterbox",
  voice: "voices/chatterbox/11.wav",  // Preferred voice
  extra_body: {
    params: {
      exaggeration: 0.5,
      cfg_weight: 0.5,
      temperature: 1.4,
      // ... see Infrastructure.md for full params
    }
  }
}
```

Endpoint: `http://192.168.1.98:7778/v1/audio/speech` (OpenAI-compatible format)

### 3. Audio Pipeline (`apps/backend/modules/lip-sync.mjs`)

Critical sequence:
1. Text → Chatterbox TTS → `audios/message_N.wav`
2. WAV → Rhubarb binary (`bin/rhubarb.exe`) → `audios/message_N.json` (phoneme data)
3. Audio Base64 + JSON → Frontend

**Error handling:** If lip sync fails, audio MUST still play. Messages can work without `lipsync` property.

### 4. Three.js Avatar (`apps/frontend/src/components/Avatar.jsx`)

- Loads GLB model from `/models/avatar.glb` with `useGLTF`
- Uses `useFrame` hook for per-frame morph target updates
- Visemes from `constants/visemesMapping.js` map to morph targets
- **Known issue (bugs.md):** Shaders break animations by forcing A-pose. Morph targets get nullified. Solution: traverse scene and preserve morph influences when applying materials.

## Development Workflows

### Starting Development

```bash
yarn dev  # Runs backend (nodemon) + frontend (vite) in parallel
```

Backend: http://localhost:9000 | Frontend: http://localhost:5173

### Testing APIs

**Ollama connection:** Server tests on startup with "Say hello" message. Check console for `=== OLLAMA CONNECTION SUCCESSFUL ===`.

**TTS test (PowerShell):**
```powershell
curl.exe -X POST "http://localhost:9000/tts" -H "Content-Type: application/json" -d "{\"message\":\"Hello world\"}"
```

**STT test:** See `docs/STT.md` for curl examples. Audio must be WAV (16kHz, mono, PCM S16LE).

### Required Tools

1. **Rhubarb Lip-Sync binary** in `apps/backend/bin/rhubarb.exe` (v1.14.0 confirmed working)
2. **ffmpeg** in PATH for audio conversion (webm → wav)
3. **Node.js 18+** (v22.12.0 tested)
4. **Yarn** for monorepo workspace management

### Environment Variables

Create `apps/backend/.env`:

```bash
# Ollama LLM
BASE_URL=http://192.168.1.98:11434
OPENAI_API_KEY=ollama
CHAT_MODEL=hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M

# Chatterbox TTS/STT
CHATTERBOX_BASE_URL=http://192.168.1.98:7778
CHATTERBOX_API_KEY=sk-1234567890
CHATTERBOX_VOICE=voices/chatterbox/11.wav
```

## Project-Specific Conventions

### Backend

- **ES Modules only** (`type: "module"` in package.json). Use `.mjs` for modules.
- **No database.** Everything is file-based (`audios/` directory for temp files).
- **Error resilience:** Always provide fallback responses. See `modules/defaultMessages.mjs` for pattern.
- **Response validation:** Check if Ollama returns array vs object with `.messages` property. Handle both (see `server.js` lines 59-84).

### Frontend

- **Three.js via React Three Fiber.** Never manipulate DOM directly for 3D.
- **Morph target naming:** Must match Ready Player Me conventions (e.g., `mouthSmile`, `eyeBlinkLeft`).
- **Animation transitions:** Use `fadeIn(0.5)` / `fadeOut(0.5)` for smooth blending.
- **Audio sync:** `useFrame` hook runs at 60fps. Lip sync lerps morph targets based on audio playback time.

### File Organization

- **Modules:** Backend logic in `apps/backend/modules/` (one concern per file)
- **Utils:** Pure functions in `apps/backend/utils/` (no side effects)
- **Constants:** Frontend constants in `apps/frontend/src/constants/` (immutable config)
- **Docs:** All architecture docs in `docs/` (Infrastructure.md, STT.md, FRONTEND.md, etc.)

## Common Pitfalls

1. **Missing text property:** Ollama occasionally returns malformed JSON. Always validate `message.text` exists before TTS.
2. **Rate limiting:** Chatterbox has no rate limits, but retries are still in `lip-sync.mjs` for robustness.
3. **Audio format:** Frontend expects base64 WAV. Chatterbox returns WAV by default (correct).
4. **Path separators:** Use `path.join()` or forward slashes. Windows backslashes break in URLs.
5. **CUDA availability:** Chatterbox params include `"device": "cuda"`. Backend assumes GPU is available.

## Key Files Reference

- `apps/backend/server.js` - API endpoints (`/tts`, `/sts`, `/voices`)
- `apps/backend/modules/openAI.mjs` - Ollama LLM integration with structured output
- `apps/backend/modules/elevenLabs.mjs` - Chatterbox TTS API wrapper
- `apps/backend/modules/whisper.mjs` - Chatterbox STT API wrapper
- `apps/backend/modules/lip-sync.mjs` - Orchestrates TTS → Rhubarb pipeline
- `apps/backend/modules/rhubarbLipSync.mjs` - Rhubarb binary execution
- `apps/frontend/src/components/Avatar.jsx` - 3D character rendering and animation
- `apps/frontend/src/hooks/useSpeech.jsx` - Backend API communication

## External Dependencies (DO NOT CHANGE)

**Ollama:** `192.168.1.98:11434` - Model: `hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M` (128K context, MCP/Tools capable with `--jinja` flag)

**Chatterbox:** `192.168.1.98:7778` - Endpoints: `/v1/audio/speech` (TTS), `/v1/audio/transcriptions` (STT). See `docs/Infrastructure.md` for complete param list. **Voice `11.wav` is preferred.**

These are production services. Do not attempt to run locally or suggest alternatives.
