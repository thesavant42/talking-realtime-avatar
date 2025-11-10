import { convertAudioToText } from "./modules/whisper.mjs";
import fs from "fs";
import path from "path";

async function testSTT() {
  try {
    // Use an existing WAV file for testing
    const testAudioPath = path.join(process.cwd(), "test_audio.wav");
    
    if (!fs.existsSync(testAudioPath)) {
      console.error(`Test audio file not found: ${testAudioPath}`);
      process.exit(1);
    }
    
    console.log(`Reading test audio file: ${testAudioPath}`);
    const audioData = fs.readFileSync(testAudioPath);
    
    console.log(`Audio file size: ${audioData.length} bytes`);
    console.log("Sending to STT API...");
    
    const transcribedText = await convertAudioToText({ audioData });
    
    console.log("\n=== SUCCESS ===");
    console.log("Transcribed text:", transcribedText);
  } catch (error) {
    console.error("\n=== ERROR ===");
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

testSTT();

