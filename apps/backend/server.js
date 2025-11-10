import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openAIChain, parser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";
import { voice } from "./modules/elevenLabs.mjs";

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
const port = 9000;

// Test Ollama connection on startup
async function testOllamaConnection() {
  console.log("=== TESTING OLLAMA CONNECTION ON STARTUP ===");
  try {
    const testResult = await openAIChain.invoke({
      question: "Say hello",
      format_instructions: parser.getFormatInstructions(),
    });
    console.log("=== OLLAMA CONNECTION SUCCESSFUL ===");
    console.log("Test response type:", typeof testResult);
    console.log("Test response:", JSON.stringify(testResult, null, 2));
    return true;
  } catch (error) {
    console.error("=== OLLAMA CONNECTION FAILED ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return false;
  }
}

app.get("/voices", async (req, res) => {
  try {
    const voices = await voice.getVoices();
    res.send(voices);
  } catch (error) {
    console.error("Error fetching voices:", error);
    res.status(500).send({ error: "Failed to fetch voices" });
  }
});

app.post("/tts", async (req, res) => {
  try {
    const userMessage = await req.body.message;
    console.log("TTS Request - User message:", userMessage);
    
    const defaultMessages = await sendDefaultMessages({ userMessage });
    if (defaultMessages) {
      console.log("Returning default messages");
      res.send({ messages: defaultMessages });
      return;
    }
    
    let openAImessages;
    try {
      console.log("=== INVOKING OLLAMA CHAIN ===");
      console.log("Question:", userMessage);
      console.log("Format instructions:", parser.getFormatInstructions());
      
      openAImessages = await openAIChain.invoke({
        question: userMessage,
        format_instructions: parser.getFormatInstructions(),
      });
      
      console.log("=== OLLAMA CHAIN RESPONSE RECEIVED ===");
      console.log("Response type:", typeof openAImessages);
      console.log("Is Array:", Array.isArray(openAImessages));
      console.log("Full response object:", JSON.stringify(openAImessages, null, 2));
      
      if (openAImessages && typeof openAImessages === 'object') {
        console.log("Object keys:", Object.keys(openAImessages));
        console.log("Has 'messages' property:", 'messages' in openAImessages);
        if (openAImessages.messages) {
          console.log("Messages property type:", typeof openAImessages.messages);
          console.log("Messages is array:", Array.isArray(openAImessages.messages));
          console.log("Messages count:", openAImessages.messages.length);
          console.log("Messages content:", JSON.stringify(openAImessages.messages, null, 2));
        }
      }
    } catch (error) {
      console.error("=== ERROR IN OLLAMA CHAIN ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      openAImessages = defaultResponse;
      console.log("=== USING DEFAULT RESPONSE ===");
      console.log("Default response:", JSON.stringify(openAImessages, null, 2));
    }
    
    // Explicit check: Determine what messages to process
    console.log("=== DETERMINING MESSAGES TO PROCESS ===");
    let messagesToProcess;
    
    if (Array.isArray(openAImessages)) {
      console.log("openAImessages is an array, using it directly");
      messagesToProcess = openAImessages;
    } else if (openAImessages && typeof openAImessages === 'object' && openAImessages.messages) {
      console.log("openAImessages is an object with 'messages' property, using openAImessages.messages");
      messagesToProcess = openAImessages.messages;
    } else {
      console.error("=== INVALID RESPONSE STRUCTURE ===");
      console.error("Cannot determine messages from response:", JSON.stringify(openAImessages, null, 2));
      res.status(500).send({ 
        error: "Invalid response structure from Ollama", 
        received: openAImessages 
      });
      return;
    }
    
    console.log("=== FINAL MESSAGES TO PROCESS ===");
    console.log("Type:", typeof messagesToProcess);
    console.log("Is Array:", Array.isArray(messagesToProcess));
    console.log("Length:", messagesToProcess?.length);
    console.log("Content:", JSON.stringify(messagesToProcess, null, 2));
    
    if (!messagesToProcess || !Array.isArray(messagesToProcess) || messagesToProcess.length === 0) {
      console.error("=== NO VALID MESSAGES TO PROCESS ===");
      res.status(500).send({ 
        error: "No valid messages received from Ollama",
        messagesToProcess: messagesToProcess
      });
      return;
    }
    
    console.log("=== PROCEEDING TO LIP SYNC ===");
    try {
      const result = await lipSync({ messages: messagesToProcess });
      console.log("=== LIP SYNC COMPLETE ===");
      res.send({ messages: result });
    } catch (error) {
      console.error("=== ERROR IN LIP SYNC ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      res.status(500).send({ error: "Failed to generate lip sync", details: error.message });
    }
  } catch (error) {
    console.error("Error in /tts endpoint:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).send({ error: "Internal server error", details: error.message });
  }
});

app.post("/sts", async (req, res) => {
  try {
    const base64Audio = req.body.audio;
    const audioData = Buffer.from(base64Audio, "base64");
    
    let userMessage;
    try {
      userMessage = await convertAudioToText({ audioData });
    } catch (error) {
      console.error("Error converting audio to text:", error);
      // If STT fails, return an error response instead of crashing
      res.status(500).send({ 
        error: "Failed to transcribe audio", 
        details: error.message 
      });
      return;
    }
    
    let openAImessages;
    try {
      openAImessages = await openAIChain.invoke({
        question: userMessage,
        format_instructions: parser.getFormatInstructions(),
      });
    } catch (error) {
      console.error("Error in Ollama chain:", error);
      openAImessages = defaultResponse;
    }
    
    try {
      openAImessages = await lipSync({ messages: openAImessages.messages });
      res.send({ messages: openAImessages });
    } catch (error) {
      console.error("Error in lip sync:", error);
      res.status(500).send({ 
        error: "Failed to generate lip sync", 
        details: error.message 
      });
    }
  } catch (error) {
    console.error("Unexpected error in /sts endpoint:", error);
    res.status(500).send({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
});

// Start server after testing Ollama connection
testOllamaConnection().then((connected) => {
  if (connected) {
    app.listen(port, () => {
      console.log(`Jack is listening on port ${port}`);
    });
  } else {
    console.error("=== SERVER NOT STARTING - OLLAMA CONNECTION FAILED ===");
    process.exit(1);
  }
});
