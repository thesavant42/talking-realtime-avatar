import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const chatterboxBaseUrl = process.env.CHATTERBOX_BASE_URL || "http://192.168.1.98:7778";
const chatterboxApiKey = process.env.CHATTERBOX_API_KEY || "sk-1234567890";
const chatterboxVoice = process.env.CHATTERBOX_VOICE || "voices/chatterbox/stark.wav";

async function convertTextToSpeech({ text, fileName }) {
  const url = `${chatterboxBaseUrl}/v1/audio/speech`;
  
  const requestBody = {
    model: "chatterbox",
    input: text,
    voice: chatterboxVoice,
    extra_body: {
      params: {
        exaggeration: 0.5,
        cfg_weight: 0.5,
        temperature: 1.4,
        speed: 1.0,
        device: "cuda",
        dtype: "float32",
        seed: -1,
        chunked: true,
        use_compilation: true,
        max_new_tokens: 1000,
        max_cache_len: 1500,
        desired_length: 100,
        max_length: 300,
        halve_first_chunk: true,
        cpu_offload: false,
        cache_voice: false,
        tokens_per_slice: null,
        remove_milliseconds: null,
        remove_milliseconds_start: null,
        chunk_overlap_method: "undefined"
      }
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${chatterboxApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Chatterbox TTS API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Ensure the directory exists
    const fileDir = path.dirname(fileName);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // Get the audio data as a buffer
    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);
    
    // Write to file
    fs.writeFileSync(fileName, buffer);
  } catch (error) {
    console.error("Error in convertTextToSpeech:", error);
    throw error;
  }
}

// Voice management for Chatterbox TTS
const voice = {
  getVoices: async () => {
    try {
      const url = `${chatterboxBaseUrl}/v1/audio/voices/chatterbox`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${chatterboxApiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chatterbox voices API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const voicesData = await response.json();
      return voicesData;
    } catch (error) {
      console.error("Error fetching voices from Chatterbox:", error);
      // Return fallback with default voice
      return {
        voices: [
          { value: chatterboxVoice, label: "Default Voice" }
        ]
      };
    }
  }
};

export { convertTextToSpeech, voice };
