# Infrastructure **DO NOT CHANGE THESE**

### Ollama
- Chat Completion Endpoint: `http://192.168.1.98:11434/api/chat`
- List Models Endpoint: `http://192.168.1.98:11434/api/tags`

```json
{
    "models": [
        {
            "details": {
                "families": [
                    "smollm3"
                ],
                "family": "smollm3",
                "format": "gguf",
                "parameter_size": "3.1B",
                "parent_model": "",
                "quantization_level": "Q4_K_M"
            },
            "digest": "6463ebe1ce6ae2f6369498f54f136baad56b4380e5365bfecc938079f8e6733c",
            "model": "alibayram/smollm3:latest",
            "modified_at": "2025-11-06T00:29:06.5952132Z",
            "name": "alibayram/smollm3:latest",
            "size": 1915305999
        },
        {
            "details": {
                "families": [
                    "llama"
                ],
                "family": "llama",
                "format": "gguf",
                "parameter_size": "3.2B",
                "parent_model": "",
                "quantization_level": "Q4_K_M"
            },
            "digest": "a80c4f17acd55265feec403c7aef86be0c25983ab279d83f3bcd3abbcb5b8b72",
            "model": "llama3.2:latest",
            "modified_at": "2025-11-05T17:16:32.5463673Z",
            "name": "llama3.2:latest",
            "size": 2019393189
        },
        {
            "details": {
                "families": [
                    "gptoss"
                ],
                "family": "gptoss",
                "format": "",
                "parameter_size": "20.9B",
                "parent_model": "",
                "quantization_level": "MXFP4"
            },
            "digest": "875e8e3a629ad3c2e66f1f1c461e3d140474212f44a34f4687ae1d927db41690",
            "model": "gpt-oss:20b-cloud",
            "modified_at": "2025-10-28T17:50:33.6718638Z",
            "name": "gpt-oss:20b-cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "gpt-oss:20b",
            "size": 381
        },
        {
            "details": {
                "families": [
                    "deepseek2"
                ],
                "family": "deepseek2",
                "format": "",
                "parameter_size": "1T",
                "parent_model": "",
                "quantization_level": "FP8"
            },
            "digest": "20dc43ca06d75c0ecc32faf475e96c1961351de4c1cc08971c59867f2ce10757",
            "model": "kimi-k2:1t-cloud",
            "modified_at": "2025-10-28T17:50:22.3908454Z",
            "name": "kimi-k2:1t-cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "kimi-k2:1t",
            "size": 369
        },
        {
            "details": {
                "families": [
                    "glm4"
                ],
                "family": "glm4",
                "format": "",
                "parameter_size": "355B",
                "parent_model": "",
                "quantization_level": "FP8"
            },
            "digest": "05277b76269f8831b289e8f11f1f46136f9214d9c0a6399f1b580003e74f887c",
            "model": "glm-4.6:cloud",
            "modified_at": "2025-10-28T17:50:03.4813751Z",
            "name": "glm-4.6:cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "glm-4.6",
            "size": 366
        },
        {
            "details": {
                "families": [
                    "gptoss"
                ],
                "family": "gptoss",
                "format": "",
                "parameter_size": "116.8B",
                "parent_model": "",
                "quantization_level": "MXFP4"
            },
            "digest": "569662207105c69bb0eca2f79a3fdf8691ad6301def477a5ec66f8e8bae237e3",
            "model": "gpt-oss:120b-cloud",
            "modified_at": "2025-10-28T17:49:56.6609067Z",
            "name": "gpt-oss:120b-cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "gpt-oss:120b",
            "size": 384
        },
        {
            "details": {
                "families": [
                    "qwen3moe"
                ],
                "family": "qwen3moe",
                "format": "",
                "parameter_size": "480B",
                "parent_model": "",
                "quantization_level": "BF16"
            },
            "digest": "e30e45586389a1eb8d7616d16c7b692c89b903b58456ec5f20219cd4c9737f7e",
            "model": "qwen3-coder:480b-cloud",
            "modified_at": "2025-10-28T17:49:48.663632Z",
            "name": "qwen3-coder:480b-cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "qwen3-coder:480b",
            "size": 382
        },
        {
            "details": {
                "families": [
                    "deepseek2"
                ],
                "family": "deepseek2",
                "format": "",
                "parameter_size": "671.0B",
                "parent_model": "",
                "quantization_level": "FP8_E4M3"
            },
            "digest": "d3749919e45f955731da7a7e76849e20f7ed310725d3b8b52822e811f55d0a90",
            "model": "deepseek-v3.1:671b-cloud",
            "modified_at": "2025-10-28T17:49:27.7488785Z",
            "name": "deepseek-v3.1:671b-cloud",
            "remote_host": "https://ollama.com:443",
            "remote_model": "deepseek-v3.1:671b",
            "size": 405
        },
        {
            "details": {
                "families": [
                    "gemma3"
                ],
                "family": "gemma3",
                "format": "gguf",
                "parameter_size": "307.58M",
                "parent_model": "",
                "quantization_level": "BF16"
            },
            "digest": "85462619ee721b466c5927d109d4cb765861907d5417b9109caebc4e614679f1",
            "model": "embeddinggemma:latest",
            "modified_at": "2025-10-21T04:57:57.0976759Z",
            "name": "embeddinggemma:latest",
            "size": 621875917
        }
    ]
}
```


### Chainloot Yoda Interface **THIS WORKS!**
- Use GitHub MCP: https://github.com/thesavant42/chainloot-Yoda-Bot-Interface
  - Production chat interface this will be augmenting
- Use DeepWiki MCP: https://deepwiki.com/thesavant42/chainloot-Yoda-Bot-Interface  

### Required Model: hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M 
  - **Large context size for the 128K variant**
    - **context_size: `131072`**
  - Uses Tools! MCP Capable
  - **Runtime flags based on your markdown configuration**
      - **`runtime_flags: "--jinja"`**                  

### Chat TTS Endpoint: 
- **http://192.168.1.98:7778/v1/audio/speech**
  - **Model Name: "chatterbox"**
  - **api_key="sk-1234567890",**
  - **base_url="http://192.168.1.98:7778/v1"**
  - OpenAI-API format for Chat + TTS 
  - Whisper api at `/v1/audio/transcriptions`

- **Despite what the strings might say, this is the literal value of the JSON; the voice, dype, model, params, are all intentional. Do not alter them.**



## Complete JSON:
- includes path to voice I want to use
- includes path to correct TTS model
- includes parameters I require

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

### Curl Test String:

```bash
curl -X POST "http://192.168.1.98:7778/v1/audio/speech" \
  -H "Authorization: Bearer sk-1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "chatterbox",
    "input": "Here'\''s one:\\n\\nWhat do you call a fake noodle?\\n\\n(wait for it...)\\n\\nAn impasta!\\n\\nI hope that made you smile! Do you want to hear another one?",
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
  }'
```


### Complete Parameter List from the documentation:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| exaggeration | float | 0.5 | Voice expressiveness (0.0-1.0) |
| cfg_weight | float | 0.5 | Classifier-free guidance weight |
| temperature | float | 1.4 | Sampling temperature for variation |
| speed | float | 1.0 | Speech rate multiplier (0.25-4.0) |
| device | str | "cuda" | Hardware device (cuda/cpu) |
| dtype | str | "float32" | Tensor data type |
| seed | int | -1 | Random seed (-1 for random) |
| chunked | bool | true | Use chunked generation |
| use_compilation | bool | true | Enable model compilation |
| max_new_tokens | int | 1000 | Maximum tokens per generation |
| max_cache_len | int | 1500 | KV cache maximum length |
| desired_length | int | 100 | Target chunk length |
| max_length | int | 300 | Maximum chunk length |
| halve_first_chunk | bool | true | Reduce first chunk size |
| cpu_offload | bool | false | Offload to CPU when idle |
| cache_voice | bool | false | Cache voice embeddings |
| tokens_per_slice | int/null | null | Tokens per processing slice |
| remove_milliseconds | int/null | null | Trim end silence (ms) |
| remove_milliseconds_start | int/null | null | Trim start silence (ms) |
| chunk_overlap_method | str | "undefined" | Chunk boundary handling |
### Voices:

 - **My Preferred voice: "voices/chatterbox/11.wav"**

```json
{
  "voices": [
    {
      "value": "random",
      "label": "Random"
    },
    {
      "value": "voices/chatterbox/10.wav",
      "label": "10"
    },
    {
      "value": "voices/chatterbox/11.wav",
      "label": "11"
    },
    {
      "value": "voices/chatterbox/12.wav",
      "label": "12"
    },
    {
      "value": "voices/chatterbox/13.wav",
      "label": "13"
    },
    {
      "value": "voices/chatterbox/14.wav",
      "label": "14"
    },
    {
      "value": "voices/chatterbox/15.wav",
      "label": "15"
    },
    {
      "value": "voices/chatterbox/16.wav",
      "label": "16"
    },
    {
      "value": "voices/chatterbox/17.wav",
      "label": "17"
    },
    {
      "value": "voices/chatterbox/18.wav",
      "label": "18"
    },
    {
      "value": "voices/chatterbox/19.wav",
      "label": "19"
    },
    {
      "value": "voices/chatterbox/20.wav",
      "label": "20"
    },
    {
      "value": "voices/chatterbox/21.wav",
      "label": "21"
    },
    {
      "value": "voices/chatterbox/22.wav",
      "label": "22"
    },
    {
      "value": "voices/chatterbox/23.wav",
      "label": "23"
    },
    {
      "value": "voices/chatterbox/24.wav",
      "label": "24"
    },
    {
      "value": "voices/chatterbox/25.wav",
      "label": "25"
    },
    {
      "value": "voices/chatterbox/26.wav",
      "label": "26"
    },
    {
      "value": "voices/chatterbox/27.wav",
      "label": "27"
    },
    {
      "value": "voices/chatterbox/28.wav",
      "label": "28"
    },
    {
      "value": "voices/chatterbox/29.wav",
      "label": "29"
    },
    {
      "value": "voices/chatterbox/30.wav",
      "label": "30"
    },
    {
      "value": "voices/chatterbox/3po.wav",
      "label": "3po"
    },
    {
      "value": "voices/chatterbox/3poaudiofans.wav",
      "label": "3poaudiofans"
    },
    {
      "value": "voices/chatterbox/3poaudiolaasers.wav",
      "label": "3poaudiolaasers"
    },
    {
      "value": "voices/chatterbox/3poaudiolasers.wav",
      "label": "3poaudiolasers"
    },
    {
      "value": "voices/chatterbox/3poaudiosaga.wav",
      "label": "3poaudiosaga"
    },
    {
      "value": "voices/chatterbox/3poaudiothemes.wav",
      "label": "3poaudiothemes"
    },
    {
      "value": "voices/chatterbox/3pobaby.wav",
      "label": "3pobaby"
    },
    {
      "value": "voices/chatterbox/3pobestob.wav",
      "label": "3pobestob"
    },
    {
      "value": "voices/chatterbox/fearforyoucleaned.wav",
      "label": "fearforyoucleaned"
    },
    {
      "value": "voices/chatterbox/nevertnismind.wav",
      "label": "nevertnismind"
    },
    {
      "value": "voices/chatterbox/notfar.wav",
      "label": "notfar"
    },
    {
      "value": "voices/chatterbox/rdj-afield-cleaned.wav",
      "label": "rdj-afield-cleaned"
    },
    {
      "value": "voices/chatterbox/rdj-afield.wav",
      "label": "rdj-afield"
    },
    {
      "value": "voices/chatterbox/rdj-decide-cleaned.wav",
      "label": "rdj-decide-cleaned"
    },
    {
      "value": "voices/chatterbox/rdj-decide.wav",
      "label": "rdj-decide"
    },
    {
      "value": "voices/chatterbox/rdj-persist-cleaned.wav",
      "label": "rdj-persist-cleaned"
    },
    {
      "value": "voices/chatterbox/rdj-persist.wav",
      "label": "rdj-persist"
    },
    {
      "value": "voices/chatterbox/rdj-spacebar-cleaned.wav",
      "label": "rdj-spacebar-cleaned"
    },
    {
      "value": "voices/chatterbox/rdj-spacebar.wav",
      "label": "rdj-spacebar"
    },
    {
      "value": "voices/chatterbox/rdj-thread-cleaned.wav",
      "label": "rdj-thread-cleaned"
    },
    {
      "value": "voices/chatterbox/rdj-thread.wav",
      "label": "rdj-thread"
    },
    {
      "value": "voices/chatterbox/rdjpersist.wav",
      "label": "rdjpersist"
    },
    {
      "value": "voices/chatterbox/rdjspace.wav",
      "label": "rdjspace"
    },
    {
      "value": "voices/chatterbox/reckless.wav",
      "label": "reckless"
    },
    {
      "value": "voices/chatterbox/stark.wav",
      "label": "stark"
    },
    {
      "value": "voices/chatterbox/tooold.wav",
      "label": "tooold"
    },
    {
      "value": "voices/chatterbox/yoda.wav",
      "label": "yoda"
    }
  ]
}
```

---

```
BASE_URL=http://192.168.1.98:11434
OPENAI_API_KEY=ollama
CHAT_MODEL=ollama:llama3.2

# Chatterbox TTS Configuration
CHATTERBOX_BASE_URL=http://192.168.1.98:7778
CHATTERBOX_API_KEY=sk-1234567890
CHATTERBOX_VOICE=voices/chatterbox/11.wav
```