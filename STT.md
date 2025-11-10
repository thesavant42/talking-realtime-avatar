# Speech-to-Text (STT) Documentation

## Overview

The Speech-to-Text functionality converts audio input from users into text using the Chatterbox STT API (Whisper model). This is used when users interact with the avatar via microphone input.

## API Configuration

The STT service uses the Chatterbox API endpoint:

- **Base URL**: `http://192.168.1.98:7778` (configurable via `CHATTERBOX_BASE_URL` environment variable)
- **Endpoint**: `/v1/audio/transcriptions`
- **Method**: `POST`
- **Authentication**: None required

## Request Format

The STT API expects a `multipart/form-data` request with the following parameters:

- **file**: The audio file (WAV format, 16kHz, mono, PCM S16LE)
- **model**: The Whisper model to use (currently `openai/whisper-small.en`)

**Important**: Do not include a `response_format` parameter. The API returns JSON by default.

## Response Format

The API returns a JSON response:

```json
{
  "text": "Transcribed text here"
}
```

## Implementation

The STT functionality is implemented in `apps/backend/modules/whisper.mjs`:

1. **Audio Conversion**: Incoming audio (typically WebM from browser) is converted to WAV format (16kHz, mono, PCM S16LE) using FFmpeg
2. **Temporary File**: The WAV audio is written to a temporary file
3. **API Request**: The file is sent to the Chatterbox STT API using `axios` with `form-data`
4. **Response Parsing**: The JSON response is parsed to extract the transcribed text
5. **Cleanup**: The temporary file is deleted

## Testing

### Manual Testing with curl

You can test the STT API directly using curl. First, generate a test audio file using TTS:

**PowerShell:**
```powershell
$body = @{model="chatterbox"; input="Warmup test Monday November 10 2025"; voice="voices/chatterbox/stark.wav"; temperature=1.0} | ConvertTo-Json
Invoke-RestMethod -Uri "http://192.168.1.98:7778/v1/audio/speech" -Method Post -ContentType "application/json" -Body $body -OutFile "test_warmup.wav"
```

**Bash/Linux:**
```bash
curl -X POST "http://192.168.1.98:7778/v1/audio/speech" \
  -H "Content-Type: application/json" \
  -d '{"model": "chatterbox", "input": "Warmup test Monday November 10 2025", "voice": "voices/chatterbox/stark.wav", "temperature": 1.0}' \
  --output test_warmup.wav
```

Then test STT transcription:

**PowerShell (using curl.exe):**
```powershell
curl.exe --silent -X POST "http://192.168.1.98:7778/v1/audio/transcriptions" -F "file=@test_warmup.wav" -F "model=openai/whisper-small.en"
```

**Bash/Linux:**
```bash
curl --silent -X POST "http://192.168.1.98:7778/v1/audio/transcriptions" \
  -F "file=@test_warmup.wav" \
  -F "model=openai/whisper-small.en"
```

**Expected Output:**
```json
{"text":" Warm-up test, Monday, November 10, 2025."}
```

### Testing with Node.js

A test script is available at `apps/backend/test_stt.mjs`. To use it:

1. Ensure you have a test audio file (e.g., `test_warmup.wav` or `test_audio.wav`)
2. Update the script to point to your test file
3. Run: `node apps/backend/test_stt.mjs`

## Troubleshooting

### 500 Internal Server Error

If you receive a 500 error from the STT API:

1. **Check the request format**: Ensure you're sending `multipart/form-data` with `file` and `model` parameters only
2. **Verify audio format**: The audio must be WAV format (16kHz, mono, PCM S16LE)
3. **Check API availability**: Verify the Chatterbox API is running and accessible at the configured URL
4. **Review error logs**: Check the backend server logs for detailed error messages

### Common Issues

- **Missing model parameter**: The `model` parameter is required. Use `openai/whisper-small.en`
- **Incorrect response_format**: Do not include `response_format` parameter. The API returns JSON by default
- **Audio format issues**: Ensure audio is converted to the correct WAV format before sending
- **File stream issues**: When using `form-data` with Node.js, ensure you're using `fs.createReadStream()` for file uploads

## Integration Points

The STT functionality is integrated into the main application flow:

1. **Frontend** (`apps/frontend/src/hooks/useSpeech.jsx`): Captures audio from the microphone and sends it to the backend
2. **Backend** (`apps/backend/server.js`): Receives audio at `/sts` endpoint and calls `convertAudioToText()`
3. **Whisper Module** (`apps/backend/modules/whisper.mjs`): Handles audio conversion and API communication
4. **Audio Utils** (`apps/backend/utils/audios.mjs`): Provides `convertAudioToWav()` function for format conversion

## References

- [Chainloot STT Test Documentation](https://github.com/thesavant42/chainloot-Yoda-Bot-Interface/blob/main/docs/testing/stt/test_stt.md)
- [Chainloot TTS Warmup Script](https://github.com/thesavant42/chainloot-Yoda-Bot-Interface/blob/main/docker/chainloot/tts-webui/tts-warmup.sh)

