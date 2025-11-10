# Talking Avatar with AI - Requirements Analysis

## Executive Summary

This document provides a comprehensive analysis of the software requirements, components, and dependencies for the Talking Avatar with AI project. The project is a monorepo consisting of a Node.js backend (Express server) and a React frontend (Vite + Three.js).

**Project Infrastructure details: Infrastructure.md (/D:/Github/talking-avatar-with-ai/Infrastructure.md)**

## Software Version Requirements

### Node.js

**Minimum Version:** **Node.js 18.x or higher (recommended: 20.x)**

- **Installed: v22.15.0**

```
(base) PS C:\Users\jbras> node --version
v22.15.0
```

**Rationale:**
   - **Express 4.18.2** requires Node.js 14+ (but modern best practices recommend 18+)
   - **Vite 5.0.11** requires Node.js 18+
   - **React 18.2.0** and modern tooling work best with Node.js 18+
   - **LangChain packages and OpenAI SDK 4.11.1 are compatible with Node.js 18+**

**Recommended:** Node.js 20.10+ for optimal compatibility with all dependencies
-- What are the different install paths for Node.js 20.10+ on Windows 11?

### CUDA

**Status:** REQUIRED for the core application

**Note:** The Node.js application does not directly use CUDA. However:
- **ffmpeg:** Does NOT require CUDA (CPU-based, though GPU acceleration is optional)
- **TTS-WebUI (if used):** REQUIRES CUDA for GPU acceleration
- **Ollama (if used):** Requires CUDA for GPU acceleration (NVIDIA GPU with CUDA support, 8GB+ VRAM recommended)

**Using GPU acceleration:**
- **CUDA 12.8 is installed**
- **NVIDIA Container Toolkit required for Docker GPU support. Installed.**

---

## Database Component

**Status:** NO DATABASE REQUIRED

---

## Component Enumeration

### 1. Root Monorepo

**Location:** `/`

**Package Manager:** **Yarn (workspaces)**

**Dependencies:** -- Need an install ledger for all of the required modules. Does the yarn file have them?
- **`nodemon` ^3.0.3 (dev)**
- **`npm-run-all` ^4.1.5 (dev)**

**Purpose:** Orchestrates the monorepo, runs frontend and backend in parallel

---

### 2. Backend Application

**Location:** `/apps/backend`

**Type:** Node.js Express Server (ES Modules)

**Runtime:** Node.js 18+

**Main Entry:** `server.js`

#### Core Dependencies:
- **`express` ^4.18.2 - Web server framework**
- **`cors` ^2.8.5 - Cross-origin resource sharing**
- **`dotenv` ^16.3.1 - Environment variable management**

#### AI/LLM Dependencies:
- **`@langchain/openai` ^0.0.12 - LangChain OpenAI integration**
- **`langchain` ^0.1.4 - LangChain core library**
- **`openai` ^4.11.1 - OpenAI SDK**
- **`zod` ^3.22.4 - Schema validation**

#### TTS Dependencies:
- **`elevenlabs-node` ^2.0.3 - ElevenLabs API client**

#### Development Dependencies:
- **`nodemon` ^3.0.1 - Auto-restart on file changes**

#### External Tools Required:
1. **Rhubarb Lip-Sync**
   - Binary executable (platform-specific)
   - Must be placed in `/apps/backend/bin/`
   - No Python or CUDA required
   - Download from: https://github.com/DanielSWolf/rhubarb-lip-sync/releases

2. **ffmpeg** - **DONE!**
   - Required for audio format conversion (webm to mp3, mp3 to wav)
   - No Python or CUDA required
   - Installation: Platform-specific (brew, apt, or Windows installer)

#### Backend Modules:

**`modules/openAI.mjs`**
- Purpose: LLM text generation using OpenAI GPT
- Dependencies: @langchain/openai, langchain, zod
- Replaces with: Ollama (requires API compatibility layer)

**`modules/whisper.mjs`**
- Purpose: Speech-to-text using OpenAI Whisper API
- Dependencies: langchain (OpenAIWhisperAudio loader)
- Replaces with: TTS-WebUI STT API

**`modules/elevenLabs.mjs`**
- Purpose: Text-to-speech using ElevenLabs API
- Dependencies: elevenlabs-node
- Replaces with: TTS-WebUI TTS API

**`modules/lip-sync.mjs`**
- Purpose: Orchestrates TTS and lip-sync generation
- Dependencies: elevenLabs, rhubarbLipSync modules

**`modules/rhubarbLipSync.mjs`**
- Purpose: Generates viseme/phoneme data for lip sync
- Dependencies: External Rhubarb Lip-Sync binary, ffmpeg
- No changes needed (already local)

**`modules/defaultMessages.mjs`**
- Purpose: Provides fallback messages when APIs are unavailable
- Dependencies: File system utilities

#### Backend Utilities:

**`utils/audios.mjs`**
- Purpose: Audio format conversion (webm to mp3)
- Dependencies: ffmpeg (external)

**`utils/files.mjs`**
- Purpose: File operations (read JSON, base64 encoding, command execution)
- Dependencies: Node.js fs module, child_process

#### API Endpoints:
- `GET /voices` - List available voices (ElevenLabs)
- `POST /tts` - Text-to-speech endpoint (text input)
- `POST /sts` - Speech-to-speech endpoint (audio input)

---

### 3. Frontend Application

**Location:** `/apps/frontend`

**Type:** React 18 + Vite 5

**Runtime:** Node.js 18+ (for build), Modern browser (for runtime)

**Main Entry:** `src/main.jsx`

#### Core Dependencies:
- `react` ^18.2.0 - UI framework
- `react-dom` ^18.2.0 - React DOM renderer

#### 3D Graphics Dependencies:
- `three` 0.160.0 - 3D graphics library
- `@react-three/fiber` 8.15.13 - React renderer for Three.js
- `@react-three/drei` 9.93.0 - Useful helpers for react-three-fiber
- `@react-three/xr` ^5.7.1 - XR/VR support (optional)
- `@types/three` 0.160.0 - TypeScript types

#### UI Dependencies:
- `leva` ^0.9.35 - GUI controls for debugging

#### Build Dependencies:
- `vite` ^5.0.11 - Build tool and dev server
- `@vitejs/plugin-react` ^4.2.1 - Vite React plugin
- `tailwindcss` ^3.4.1 - CSS framework
- `postcss` ^8.4.33 - CSS processor
- `autoprefixer` ^10.4.16 - CSS vendor prefixer
- `@types/react` ^18.2.47 - TypeScript types
- `@types/react-dom` ^18.2.18 - TypeScript types

#### Frontend Components:

**`src/App.jsx`**
- Root component, sets up Canvas and ChatInterface

**`src/components/Avatar.jsx`**
- 3D avatar rendering with animations and lip sync
- Uses Three.js for 3D graphics
- Handles facial expressions and viseme mapping

**`src/components/ChatInterface.jsx`**
- User interface for text input and voice recording
- Connects to backend API

**`src/components/Scenario.jsx`**
- 3D scene setup (lighting, camera, etc.)

**`src/hooks/useSpeech.jsx`**
- Custom React hook for speech functionality
- Handles API communication with backend

**`src/constants/`**
- `facialExpressions.js` - Facial expression mappings
- `morphTargets.js` - 3D model morph target definitions
- `visemesMapping.js` - Viseme to morph target mappings

#### Static Assets:
- `/public/models/` - 3D avatar models (GLB/GLTF format)
- `/public/animations/` - Animation files (FBX format)

---

## External Services

### Local Services (Configured):

1. **Ollama (Replaces OpenAI GPT API)**
   - **Status:** Configured and running
   - **Endpoint:** `http://192.168.1.98:11434/api/chat`
   - **Model:** `alibayram/smollm3:latest` (primary) or `llama3.2:latest`
   - **Used for:** Text generation (LLM completions)
   - **API Compatibility:** OpenAI-compatible, drop-in replacement

2. **Chatterbox TTS (Replaces ElevenLabs API)**
   - **Status:** Configured and running
   - **Endpoint:** `http://192.168.1.98:7778/v1/audio/speech`
   - **Model:** `chatterbox`
   - **Voice:** `voices/chatterbox/11.wav`
   - **Used for:** Text-to-speech synthesis
   - **API Compatibility:** OpenAI-compatible, drop-in replacement

3. **Chatterbox STT/Whisper (Replaces OpenAI Whisper API)**
   - **Status:** Configured and running
   - **Endpoint:** `http://192.168.1.98:7778/v1/audio/transcriptions`
   - **Used for:** Speech-to-text conversion
   - **API Compatibility:** OpenAI Whisper API compatible, drop-in replacement

### Already Local:

1. **Rhubarb Lip-Sync**
   - Status: Already local (binary executable)
   - No changes needed

2. **ffmpeg**
   - Status: Already local (system installation)
   - No changes needed

---

## Integration Points for Local Services

### Ollama Integration

**Configuration (from Infrastructure.md):**
- **Base URL:** `http://192.168.1.98:11434`
- **Chat Completion Endpoint:** `http://192.168.1.98:11434/api/chat`
- **List Models Endpoint:** `http://192.168.1.98:11434/api/tags`
- **API Key:** `ollama` (for OpenAI compatibility)
- **Primary Model:** `hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M` (SmolLM3-3B-128K, Q4_K_M quantization)
  - Context size: 131072 (128K)
  - Runtime flags: `--jinja` (for MCP/Tools support)
- **Alternative Model:** `llama3.2:latest` (3.2B, Q4_K_M)

**Required Changes:**
- Modify `apps/backend/modules/openAI.mjs`
- Replace `ChatOpenAI` from LangChain with Ollama-compatible client
- Ollama is OpenAI API compatible, so LangChain's ChatOpenAI can be configured with:
  - `baseURL: "http://192.168.1.98:11434/v1"`
  - `apiKey: "ollama"`
  - `modelName: "hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M"` (or selected model)

**Environment Variables:**
```
BASE_URL=http://192.168.1.98:11434
OPENAI_API_KEY=ollama
CHAT_MODEL=ollama:llama3.2
```

### Chatterbox TTS Integration (OpenAI-Compatible)

**Configuration (from Infrastructure.md):**
- **Base URL:** `http://192.168.1.98:7778/v1`
- **TTS Endpoint:** `http://192.168.1.98:7778/v1/audio/speech`
- **STT/Whisper Endpoint:** `http://192.168.1.98:7778/v1/audio/transcriptions`
- **API Key:** `sk-1234567890`
- **Model Name:** `chatterbox`
- **Preferred Voice:** `voices/chatterbox/11.wav`

**Required Changes:**
- Modify `apps/backend/modules/elevenLabs.mjs` for TTS
- Modify `apps/backend/modules/whisper.mjs` for STT
- Use OpenAI-compatible API format (drop-in replacement)

**TTS Request Format:**
```json
{
  "model": "chatterbox",
  "input": "Text to synthesize",
  "voice": "voices/chatterbox/11.wav",
  "extra_body": {
    "params": {
      "exaggeration": 0.5,
      "cfg_weight": 0.5,
      "temperature": 1.4,
      "speed": 1.0,
      "device": "cuda",
      "dtype": "float32",
      "seed": -1,
      "chunked": true,
      "use_compilation": true,
      "max_new_tokens": 1000,
      "max_cache_len": 1500,
      "desired_length": 100,
      "max_length": 300,
      "halve_first_chunk": true,
      "cpu_offload": false,
      "cache_voice": false,
      "tokens_per_slice": null,
      "remove_milliseconds": null,
      "remove_milliseconds_start": null,
      "chunk_overlap_method": "undefined"
    }
  }
}
```

**Environment Variables:**
```
CHATTERBOX_BASE_URL=http://192.168.1.98:7778
CHATTERBOX_API_KEY=sk-1234567890
CHATTERBOX_VOICE=voices/chatterbox/11.wav
```

**Available Voices:**
- Multiple voices available in `voices/chatterbox/` directory
- See Infrastructure.md for complete list (10-30, 3po variants, rdj variants, yoda, etc.)

---

## Development Environment Setup

### Prerequisites:
1. Node.js 18+ (20.10+ recommended)
2. Yarn package manager
3. ffmpeg (system installation)
4. Rhubarb Lip-Sync binary (in `/apps/backend/bin/`)

### Dependency Status Checklist

#### System Requirements Status

**Core Runtime:**
- [x] **Node.js** - v22.12.0 installed (Requires 18+, Recommended 20.10+)
- [x] **Yarn** - NOT FOUND in PATH (needs installation or PATH configuration)
- [x] **ffmpeg** - INSTALLED (version N-121328-ge05f8acabf-20251005)
- [x] **Rhubarb Lip-Sync** - NOT FOUND in `apps/backend/bin/`
- [x] **CUDA** - 12.8 installed (NVIDIA Driver 572.61)
- [x] **GPU** - NVIDIA GeForce RTX 4070 detected (12GB VRAM)

**Node.js Dependencies:**
- [x] **node_modules** - NOT FOUND (need to run `yarn install`)

#### Installation Steps

**[x] 1. Install Yarn**

Option A: Install via npm (recommended)
```bash
npm install -g yarn
```

Option B: Install via Corepack (Node.js 16.10+)
```bash
corepack enable
corepack prepare yarn@stable --activate
```

Option C: Install via Chocolatey (Windows)
```bash
choco install yarn
```

[x] Verify installation:
```bash
yarn --version
```
```bash
(base) PS D:\Github\talking-avatar-with-ai> yarn --version
1.22.22
```


**2. [x] Install Node.js Dependencies** **DONE**

Once yarn is installed, run:
```bash
cd D:\Github\talking-avatar-with-ai
yarn install
```

This will install all dependencies for both frontend and backend.

**3. Install Rhubarb Lip-Sync**

1. Download from: https://github.com/DanielSWolf/rhubarb-lip-sync/releases
2. Download the Windows version (e.g., `rhubarb-lip-sync-1.13.0-win64.zip`)
3. Extract the contents
4. Create the directory: `apps\backend\bin\`
5. Copy the `rhubarb.exe` (or `rhubarb`) file to `apps\backend\bin\`

Verify installation:
```bash
# From the project root
.\apps\backend\bin\rhubarb.exe --version
```
```bash
(base) PS D:\Github\talking-avatar-with-ai> .\apps\backend\bin\rhubarb.exe --version

Rhubarb Lip Sync version 1.14.0
```


**4. Set Up Environment Variables**

Create `apps/backend/.env` file with:
```env
BASE_URL=http://192.168.1.98:11434
OPENAI_API_KEY=ollama
CHAT_MODEL=ollama:llama3.2

# Chatterbox TTS Configuration
CHATTERBOX_BASE_URL=http://192.168.1.98:7778
CHATTERBOX_API_KEY=sk-1234567890
CHATTERBOX_VOICE=voices/chatterbox/11.wav
```

**5. Run Development Server**

```bash
yarn dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

#### Verification Commands

Run these commands to verify everything is set up:

```bash
# Check Node.js
node --version
# Should show: v22.12.0 or higher

# Check Yarn
yarn --version
# Should show: 1.x.x or higher

# Check ffmpeg
ffmpeg -version
# Should show version info

# Check Rhubarb Lip-Sync
.\apps\backend\bin\rhubarb.exe --version
# Should show version info

# Check CUDA
nvidia-smi
# Should show GPU info

# Check if dependencies are installed
if (Test-Path "node_modules") { Write-Host "Dependencies installed" } else { Write-Host "Run: yarn install" }
```

---

## Docker Considerations

### Current State:
- No Docker configuration present
- No containerization

### Recommended Docker Setup:
1. **Backend Container:**
   - Node.js 20 base image
   - Include ffmpeg
   - Include Rhubarb Lip-Sync binary
   - Expose port 3000

2. **Frontend Container:**
   - Node.js 20 base image (for build)
   - Nginx for serving (production)
   - Expose port 5173 (dev) or 80 (prod)

3. **Ollama Container:**
   - Official Ollama Docker image
   - GPU support via NVIDIA Container Toolkit
   - Expose port 11434
   - Running at: `http://192.168.1.98:11434`

4. **Chatterbox TTS Container:**
   - Running at: `http://192.168.1.98:7778`
   - OpenAI-compatible API format
   - GPU support (CUDA) for model inference
   - Exposes `/v1/audio/speech` (TTS) and `/v1/audio/transcriptions` (STT/Whisper)

---

## Infrastructure Configuration

**All infrastructure details are documented in [Infrastructure.md](./Infrastructure.md)**

### Key Infrastructure Details:

1. **Ollama:**
   - Endpoint: `http://192.168.1.98:11434`
   - Primary Model: `alibayram/smollm3:latest` (SmolLM3-3B-128K, 128K context)
   - Alternative: `llama3.2:latest`
   - MCP/Tools capable with `--jinja` runtime flag

2. **Chatterbox TTS:**
   - Endpoint: `http://192.168.1.98:7778/v1`
   - Model: `chatterbox`
   - Voice: `voices/chatterbox/11.wav` (preferred)
   - OpenAI-compatible API format
   - CUDA-enabled for GPU acceleration

3. **Deployment:**
   - Single machine deployment
   - Production and development are the same environment
   - Docker deployment planned for future

---

## Summary Table

| Component | Node.js | Python | CUDA | Database | Notes |
|-----------|---------|--------|------|----------|-------|
| **Core Application** | 18+ (20+ rec) | ❌ No | ❌ No | ❌ No | Pure Node.js |
| **Backend** | 18+ | ❌ No | ❌ No | ❌ No | Express server |
| **Frontend** | 18+ (build) | ❌ No | ❌ No | ❌ No | React + Vite |
| **Rhubarb Lip-Sync** | ❌ No | ❌ No | ❌ No | ❌ No | Binary executable |
| **ffmpeg** | ❌ No | ❌ No | ❌ No | ❌ No | System tool |
| **Ollama** | ❌ No | ❌ No | ✅ Optional | ❌ No | Running at 192.168.1.98:11434 |
| **Chatterbox TTS** | ❌ No | ✅ Required | ✅ Required (CUDA) | ❌ No | OpenAI-compatible, 192.168.1.98:7778 |

---

## Next Steps

1. [x] **Review this document** and confirm understanding
2. [x] **Infrastructure configured** (see Infrastructure.md)
3. [x] **Set up local services:**
   - [x] Ollama installed and running at 192.168.1.98:11434
   - [x] Chatterbox TTS installed and running at 192.168.1.98:7778
4. [ ] **Create adapter layers** for API compatibility
   - [ ] Update `modules/openAI.mjs` to use Ollama endpoint
   - [ ] Update `modules/elevenLabs.mjs` to use Chatterbox TTS
   - [ ] Update `modules/whisper.mjs` to use Chatterbox STT endpoint
5. [ ] **Test integration** with local services
6. [ ] **Update environment configuration** (.env file)
7. [ ] **Dockerize** (future)

---

## References

- [Rhubarb Lip-Sync Repository](https://github.com/DanielSWolf/rhubarb-lip-sync)
- [Ollama Documentation](https://ollama.ai/)
- [SmolLM3 Model](https://huggingface.co/unsloth/SmolLM3-3B-128K-GGUF) (hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M)
- [ffmpeg Documentation](https://ffmpeg.org/)
- [LangChain Documentation](https://js.langchain.com/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Infrastructure](./Infrastructure.md)

---

*Document generated: 2024*
*Last updated: Based on codebase analysis*

