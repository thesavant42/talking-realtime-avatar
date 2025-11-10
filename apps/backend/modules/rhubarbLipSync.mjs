import { execCommand } from "../utils/files.mjs";
import { promises as fs } from "fs";
import path from "path";

const getPhonemes = async ({ message }) => {
  try {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);
    
    // Use a temporary file for FFmpeg conversion (FFmpeg cannot write to the same file it reads from)
    const inputFile = `audios/message_${message}.wav`;
    const tempFile = `audios/message_${message}_temp.wav`;
    
    // Convert to temporary file first
    await execCommand({
      command: `ffmpeg -y -i ${inputFile} -ar 16000 -acodec pcm_s16le -ac 1 ${tempFile}`
    });
    
    // Replace original file with converted temporary file
    await fs.rename(tempFile, inputFile);
    
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    await execCommand({
      command: `rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`,
    });
    // -r phonetic is faster but less accurate
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
    throw error; // Re-throw so lip-sync.mjs can handle it properly
  }
};

export { getPhonemes };