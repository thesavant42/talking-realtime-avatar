
  VITE v5.1.2  ready in 124 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
Ollama Configuration:
  Base URL: http://192.168.1.98:11434/v1
  Model Name: hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M
  API Key: ollama
=== TESTING OLLAMA CONNECTION ON STARTUP ===
(node:27312) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
=== OLLAMA CONNECTION SUCCESSFUL ===
Test response type: object
Test response: {
  "messages": [
    {
      "text": "Hello, how are you doing? My name is Jack and I'm here to assist you with any questions or information you need.",
      "facialExpression": "smile",
      "animation": "Idle"
    }
  ]
}
Jack is listening on port 9000
TTS Request - User message: hello
=== INVOKING OLLAMA CHAIN ===
Question: hello
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
      "text": "Hi there, how are you doing?",
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
    "text": "Hi there, how are you doing?",
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
    "text": "Hi there, how are you doing?",
    "facialExpression": "smile",
    "animation": "Idle"
  }
]
=== PROCEEDING TO LIP SYNC ===
Converting message 0 to speech: "Hi there, how are you doing?..."
Message 0 converted to speech successfully
Message 0 - Audio attached successfully (84540 chars)
Starting conversion for message 0
Conversion done in 86ms
Error while getting phonemes for message 0: Error: Command failed: rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic
Generating lip sync data for audios/message_0.wav.
Progress: [#-------------------]   6%
[Fatal] Application terminating with error: Error processing file audios/message_0.wav.
Error performing speech recognition via PocketSphinx tools.
Found Rhubarb executable at C:\Users\jbras\.local\bin\rhubarb.exe, but could not find resource file C:\Users\jbras\.local\bin\res\sphinx\cmudict-en-us.dict.
Progress (cont'd): [#-------------------]   6%
    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:414:12)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: 'rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic'
}
Error while getting phonemes for message 0: Error: Command failed: rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic
Generating lip sync data for audios/message_0.wav.
Progress: [#-------------------]   6%
[Fatal] Application terminating with error: Error processing file audios/message_0.wav.
Error performing speech recognition via PocketSphinx tools.
Found Rhubarb executable at C:\Users\jbras\.local\bin\rhubarb.exe, but could not find resource file C:\Users\jbras\.local\bin\res\sphinx\cmudict-en-us.dict.
Progress (cont'd): [#-------------------]   6%
    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:414:12)
    at ChildProcess.emit (node:events:524:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: 'rhubarb -f json -o audios/message_0.json audios/message_0.wav -r phonetic'
}
Message 0 will be returned without lip sync data, but audio should still work
Message 0 final state: {
  hasText: true,
  hasAudio: true,
  hasLipsync: false,
  audioLength: 84540
}
=== LIP SYNC COMPLETE ===
9:01:24 PM [vite] hmr update /src/components/Avatar.jsx, /src/index.css
