import { convertAudioToWav } from "../utils/audios.mjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import FormData from "form-data";
import axios from "axios";

dotenv.config();

const chatterboxBaseUrl = process.env.CHATTERBOX_BASE_URL || "http://192.168.1.98:7778";
const chatterboxApiKey = process.env.CHATTERBOX_API_KEY || "sk-1234567890";

async function convertAudioToText({ audioData }) {
  // Convert audio to WAV format
  const wavAudioData = await convertAudioToWav({ audioData });
  
  // Create a temporary file for the audio
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const tempFilePath = path.join(tmpDir, `transcription_${Date.now()}.wav`);
  
  try {
    // Write WAV to temp file
    fs.writeFileSync(tempFilePath, wavAudioData);
    
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath), {
      filename: "audio.wav",
      contentType: "audio/wav",
    });
    formData.append("model", "openai/whisper-small.en");
    
    // Make request to Chatterbox STT endpoint
    const url = `${chatterboxBaseUrl}/v1/audio/transcriptions`;
    
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // API returns JSON with {"text":"..."} format
    const transcribedText = response.data.text || response.data.transcript || "";
    
    return transcribedText;
  } catch (error) {
    console.error("Error in convertAudioToText:", error);
    throw error;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

export { convertAudioToText };
