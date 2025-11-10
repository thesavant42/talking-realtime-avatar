Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
```json
{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"text":{"type":"string","description":"Text to be spoken by the AI"},"facialExpression":{"type":"string","description":"Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"},"animation":{"type":"string","description":"Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, \n            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake."}},"required":["text","facialExpression","animation"],"additionalProperties":false}}},"required":["messages"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```

=== OLLAMA CHAIN RESPONSE RECEIVED ===
Response type: object
Is Array: false
Full response object: {
  "messages": [
    {
      "text": "hello",
      "facialExpression": "default",
      "animation": "Idle"
    }
  ]
}
Object keys: [ 'messages' ]
Has 'messages' property: true
Messages property type: object
Messages is array: true
Messages count: 1
Messages content: [
  {
    "text": "hello",
    "facialExpression": "default",
    "animation": "Idle"
  }
]
=== DETERMINING MESSAGES TO PROCESS ===
openAImessages is an object with 'messages' property, using openAImessages.messages
=== FINAL MESSAGES TO PROCESS ===
Type: object
Is Array: true
Length: 1
Content: [
  {
    "text": "hello",
    "facialExpression": "default",
    "animation": "Idle"
  }
]
=== PROCEEDING TO LIP SYNC ===
Message 0 converted to speech
Starting conversion for message 0
Conversion done in 30ms
Error while getting phonemes for message 0: Error: Command failed: ./bin/rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic
'.' is not recognized as an internal or external command,
operable program or batch file.

    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:414:12)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: './bin/rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic'
}
Error while getting phonemes for message 0: Error: ENOENT: no such file or directory, open 'D:\Github\talking-avatar-with-ai\apps\backend\audios\message_0.json'
    at async open (node:internal/fs/promises:638:25)
    at async Object.readFile (node:internal/fs/promises:1238:14)
    at async readJsonTranscript (file:///D:/Github/talking-avatar-with-ai/apps/backend/utils/files.mjs:14:16)      
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:39:27
    at async Promise.all (index 0)
    at async lipSync (file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:32:3)
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/server.js:131:22 {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Github\\talking-avatar-with-ai\\apps\\backend\\audios\\message_0.json'
}
=== LIP SYNC COMPLETE ===
TTS Request - User message: How are you? What is your name?
=== INVOKING OLLAMA CHAIN ===
Question: How are you? What is your name?
Format instructions: You must format your output as a JSON value that adheres to a given "JSON Schema" instance.   

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
```json
{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"text":{"type":"string","description":"Text to be spoken by the AI"},"facialExpression":{"type":"string","description":"Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"},"animation":{"type":"string","description":"Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, \n            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake."}},"required":["text","facialExpression","animation"],"additionalProperties":false}}},"required":["messages"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```

=== OLLAMA CHAIN RESPONSE RECEIVED ===
Response type: object
Is Array: false
Full response object: {
  "messages": [
    {
      "text": "Hello! My name is Jack.",
      "facialExpression": "default",
      "animation": "Idle"
    },
    {
      "text": "I'm glad to meet you!",
      "facialExpression": "smile",
      "animation": "TalkingOne"
    }
  ]
}
Object keys: [ 'messages' ]
Has 'messages' property: true
Messages property type: object
Messages is array: true
Messages count: 2
Messages content: [
  {
    "text": "Hello! My name is Jack.",
    "facialExpression": "default",
    "animation": "Idle"
  },
  {
    "text": "I'm glad to meet you!",
    "facialExpression": "smile",
    "animation": "TalkingOne"
  }
]
=== DETERMINING MESSAGES TO PROCESS ===
openAImessages is an object with 'messages' property, using openAImessages.messages
=== FINAL MESSAGES TO PROCESS ===
Type: object
Is Array: true
Length: 2
Content: [
  {
    "text": "Hello! My name is Jack.",
    "facialExpression": "default",
    "animation": "Idle"
  },
  {
    "text": "I'm glad to meet you!",
    "facialExpression": "smile",
    "animation": "TalkingOne"
  }
]
=== PROCEEDING TO LIP SYNC ===
Message 0 converted to speech
Message 1 converted to speech
Starting conversion for message 0
Starting conversion for message 1
Error while getting phonemes for message 0: Error: Command failed: ffmpeg -y -i audios/message_0.mp3 audios/message_0.wav
ffmpeg version N-121328-ge05f8acabf-20251005 Copyright (c) 2000-2025 the FFmpeg developers
  built with gcc 15.2.0 (crosstool-NG 1.28.0.1_403899e)
  configuration: --prefix=/ffbuild/prefix --pkg-config-flags=--static --pkg-config=pkg-config --cross-prefix=x86_64-w64-mingw32- --arch=x86_64 --target-os=mingw32 --enable-gpl --enable-version3 --disable-debug --disable-w32threads --enable-pthreads --enable-iconv --enable-zlib --enable-libxml2 --enable-libvmaf --enable-fontconfig --enable-libharfbuzz --enable-libfreetype --enable-libfribidi --enable-vulkan --enable-libshaderc --enable-libvorbis --disable-libxcb --disable-xlib --disable-libpulse --enable-opencl --enable-gmp --enable-lzma --enable-amf --enable-libaom --enable-libaribb24 --enable-avisynth --enable-chromaprint --enable-libdav1d --enable-libdavs2 --enable-libdvdread --enable-libdvdnav --disable-libfdk-aac --enable-ffnvcodec --enable-cuda-llvm --enable-frei0r --enable-libgme --enable-libkvazaar --enable-libaribcaption --enable-libass --enable-libbluray --enable-libjxl --enable-libmp3lame --enable-libopus --enable-libplacebo --enable-librist --enable-libssh --enable-libtheora --enable-libvpx --enable-libwebp --enable-libzmq --enable-lv2 --enable-libvpl --enable-openal --enable-liboapv --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopenmpt --enable-librav1e --enable-librubberband --enable-schannel --enable-sdl2 --enable-libsnappy --enable-libsoxr --enable-libsrt --enable-libsvtav1 --enable-libtwolame --enable-libuavs3d --disable-libdrm --enable-vaapi --enable-libvidstab --enable-libvvenc --enable-whisper --enable-libx264 --enable-libx265 --enable-libxavs2 --enable-libxvid --enable-libzimg --enable-libzvbi --extra-cflags=-DLIBTWOLAME_STATIC --extra-cxxflags= --extra-libs=-lgomp --extra-ldflags=-pthread --extra-ldexeflags= --cc=x86_64-w64-mingw32-gcc --cxx=x86_64-w64-mingw32-g++ --ar=x86_64-w64-mingw32-gcc-ar --ranlib=x86_64-w64-mingw32-gcc-ranlib --nm=x86_64-w64-mingw32-gcc-nm --extra-version=20251005
  libavutil      60. 13.100 / 60. 13.100
  libavcodec     62. 16.100 / 62. 16.100
  libavformat    62.  6.100 / 62.  6.100
  libavdevice    62.  2.100 / 62.  2.100
  libavfilter    11.  9.100 / 11.  9.100
  libswscale      9.  3.100 /  9.  3.100
  libswresample   6.  2.100 /  6.  2.100
[mp3 @ 00000237f3d28d40] Format mp3 detected only with low score of 1, misdetection possible!
[mp3 @ 00000237f3d28d40] Failed to find two consecutive MPEG audio frames.
[in#0 @ 00000237f3d28980] Error opening input: Invalid data found when processing input
Error opening input file audios/message_0.mp3.
Error opening input files: Invalid data found when processing input

    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:414:12)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 3199971767,
  killed: false,
  signal: null,
  cmd: 'ffmpeg -y -i audios/message_0.mp3 audios/message_0.wav'
}
Error while getting phonemes for message 1: Error: Command failed: ffmpeg -y -i audios/message_1.mp3 audios/message_1.wav
ffmpeg version N-121328-ge05f8acabf-20251005 Copyright (c) 2000-2025 the FFmpeg developers
  built with gcc 15.2.0 (crosstool-NG 1.28.0.1_403899e)
  configuration: --prefix=/ffbuild/prefix --pkg-config-flags=--static --pkg-config=pkg-config --cross-prefix=x86_64-w64-mingw32- --arch=x86_64 --target-os=mingw32 --enable-gpl --enable-version3 --disable-debug --disable-w32threads --enable-pthreads --enable-iconv --enable-zlib --enable-libxml2 --enable-libvmaf --enable-fontconfig --enable-libharfbuzz --enable-libfreetype --enable-libfribidi --enable-vulkan --enable-libshaderc --enable-libvorbis --disable-libxcb --disable-xlib --disable-libpulse --enable-opencl --enable-gmp --enable-lzma --enable-amf --enable-libaom --enable-libaribb24 --enable-avisynth --enable-chromaprint --enable-libdav1d --enable-libdavs2 --enable-libdvdread --enable-libdvdnav --disable-libfdk-aac --enable-ffnvcodec --enable-cuda-llvm --enable-frei0r --enable-libgme --enable-libkvazaar --enable-libaribcaption --enable-libass --enable-libbluray --enable-libjxl --enable-libmp3lame --enable-libopus --enable-libplacebo --enable-librist --enable-libssh --enable-libtheora --enable-libvpx --enable-libwebp --enable-libzmq --enable-lv2 --enable-libvpl --enable-openal --enable-liboapv --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopenmpt --enable-librav1e --enable-librubberband --enable-schannel --enable-sdl2 --enable-libsnappy --enable-libsoxr --enable-libsrt --enable-libsvtav1 --enable-libtwolame --enable-libuavs3d --disable-libdrm --enable-vaapi --enable-libvidstab --enable-libvvenc --enable-whisper --enable-libx264 --enable-libx265 --enable-libxavs2 --enable-libxvid --enable-libzimg --enable-libzvbi --extra-cflags=-DLIBTWOLAME_STATIC --extra-cxxflags= --extra-libs=-lgomp --extra-ldflags=-pthread --extra-ldexeflags= --cc=x86_64-w64-mingw32-gcc --cxx=x86_64-w64-mingw32-g++ --ar=x86_64-w64-mingw32-gcc-ar --ranlib=x86_64-w64-mingw32-gcc-ranlib --nm=x86_64-w64-mingw32-gcc-nm --extra-version=20251005
  libavutil      60. 13.100 / 60. 13.100
  libavcodec     62. 16.100 / 62. 16.100
  libavformat    62.  6.100 / 62.  6.100
  libavdevice    62.  2.100 / 62.  2.100
  libavfilter    11.  9.100 / 11.  9.100
  libswscale      9.  3.100 /  9.  3.100
  libswresample   6.  2.100 /  6.  2.100
[mp3 @ 00000225f4caa740] Format mp3 detected only with low score of 1, misdetection possible!
[mp3 @ 00000225f4caa740] Failed to find two consecutive MPEG audio frames.
[in#0 @ 00000225f4caa380] Error opening input: Invalid data found when processing input
Error opening input file audios/message_1.mp3.
Error opening input files: Invalid data found when processing input

    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:414:12)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 3199971767,
  killed: false,
  signal: null,
  cmd: 'ffmpeg -y -i audios/message_1.mp3 audios/message_1.wav'
}
Error while getting phonemes for message 0: Error: ENOENT: no such file or directory, open 'D:\Github\talking-avatar-with-ai\apps\backend\audios\message_0.json'
    at async open (node:internal/fs/promises:638:25)
    at async Object.readFile (node:internal/fs/promises:1238:14)
    at async readJsonTranscript (file:///D:/Github/talking-avatar-with-ai/apps/backend/utils/files.mjs:14:16)      
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:39:27
    at async Promise.all (index 0)
    at async lipSync (file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:32:3)
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/server.js:131:22 {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Github\\talking-avatar-with-ai\\apps\\backend\\audios\\message_0.json'
}
Error while getting phonemes for message 1: Error: ENOENT: no such file or directory, open 'D:\Github\talking-avatar-with-ai\apps\backend\audios\message_1.json'
    at async open (node:internal/fs/promises:638:25)
    at async Object.readFile (node:internal/fs/promises:1238:14)
    at async readJsonTranscript (file:///D:/Github/talking-avatar-with-ai/apps/backend/utils/files.mjs:14:16)      
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:39:27
    at async Promise.all (index 1)
    at async lipSync (file:///D:/Github/talking-avatar-with-ai/apps/backend/modules/lip-sync.mjs:32:3)
    at async file:///D:/Github/talking-avatar-with-ai/apps/backend/server.js:131:22 {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Github\\talking-avatar-with-ai\\apps\\backend\\audios\\message_1.json'
}
=== LIP SYNC COMPLETE ===
TTS Request - User message: hello what is your name?
=== INVOKING OLLAMA CHAIN ===
Question: hello what is your name?
Format instructions: You must format your output as a JSON value that adheres to a given "JSON Schema" instance.   

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
```json
{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"text":{"type":"string","description":"Text to be spoken by the AI"},"facialExpression":{"type":"string","description":"Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"},"animation":{"type":"string","description":"Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, \n            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake."}},"required":["text","facialExpression","animation"],"additionalProperties":false}}},"required":["messages"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```

=== OLLAMA CHAIN RESPONSE RECEIVED ===
Response type: object
Is Array: false
Full response object: {
  "messages": [
    {
      "text": "Hello! My name is Jack.",
      "facialExpression": "smile",
      "animation": "Idle"
    }
  ]
}
Object keys: [ 'messages' ]
Has 'messages' property: true
Messages property type: object
Messages is array: true
Messages count: 1
Messages content: [
  {
    "text": "Hello! My name is Jack.",
    "facialExpression": "smile",
    "animation": "Idle"
  }
]
=== DETERMINING MESSAGES TO PROCESS ===
openAImessages is an object with 'messages' property, using openAImessages.messages
=== FINAL MESSAGES TO PROCESS ===
Type: object
Is Array: true
Length: 1
Content: [
  {
    "text": "Hello! My name is Jack.",
    "facialExpression": "smile",
    "animation": "Idle"
  }
]
=== PROCEEDING TO LIP SYNC ===
Error in convertTextToSpeech: TypeError: terminated
    at Fetch.onAborted (node:internal/deps/undici/undici:11106:53)
    at Fetch.emit (node:events:524:28)
    at Fetch.terminate (node:internal/deps/undici/undici:10264:14)
    at Object.onError (node:internal/deps/undici/undici:11227:38)
    at Request.onError (node:internal/deps/undici/undici:2094:31)
    at Object.errorRequest (node:internal/deps/undici/undici:1591:17)
    at Socket.<anonymous> (node:internal/deps/undici/undici:6312:16)
    at Socket.emit (node:events:536:35)
    at TCP.<anonymous> (node:net:350:12) {
  [cause]: SocketError: other side closed
      at Socket.<anonymous> (node:internal/deps/undici/undici:6287:28)
      at Socket.emit (node:events:536:35)
      at endReadableNT (node:internal/streams/readable:1698:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    code: 'UND_ERR_SOCKET',
    socket: {
      localAddress: '192.168.1.98',
      localPort: 49992,
      remoteAddress: '192.168.1.98',
      remotePort: 7778,
      remoteFamily: 'IPv4',
      timeout: undefined,
      bytesWritten: 806,
      bytesRead: 217
    }
  }
}
=== ERROR IN LIP SYNC ===
Error message: terminated
Error stack: TypeError: terminated
    at Fetch.onAborted (node:internal/deps/undici/undici:11106:53)
    at Fetch.emit (node:events:524:28)
    at Fetch.terminate (node:internal/deps/undici/undici:10264:14)
    at Object.onError (node:internal/deps/undici/undici:11227:38)
    at Request.onError (node:internal/deps/undici/undici:2094:31)
    at Object.errorRequest (node:internal/deps/undici/undici:1591:17)
    at Socket.<anonymous> (node:internal/deps/undici/undici:6312:16)
    at Socket.emit (node:events:536:35)
    at TCP.<anonymous> (node:net:350:12)
