import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";

const MAX_RETRIES = 10;
const RETRY_DELAY = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lipSync = async ({ messages }) => {
  // Validate messages have text before processing
  messages.forEach((message, index) => {
    if (!message || !message.text) {
      console.warn(`Message ${index} is missing text property:`, message);
    }
  });

  await Promise.all(
    messages.map(async (message, index) => {
      if (!message || !message.text) {
        console.error(`Skipping message ${index} - no text property`);
        return;
      }

      const fileName = `audios/message_${index}.wav`;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`Converting message ${index} to speech: "${message.text.substring(0, 50)}..."`);
          await convertTextToSpeech({ text: message.text, fileName });
          await delay(RETRY_DELAY);
          break;
        } catch (error) {
          if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
            await delay(RETRY_DELAY);
          } else {
            console.error(`Failed to convert message ${index} to speech after ${attempt + 1} attempts:`, error.message);
            throw error;
          }
        }
      }
      console.log(`Message ${index} converted to speech successfully`);
    })
  );

  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.wav`;

      try {
        // Try to get audio first (even if lip sync fails, we should still have audio)
        try {
          message.audio = await audioFileToBase64({ fileName });
          console.log(`Message ${index} - Audio attached successfully (${message.audio.length} chars)`);
        } catch (audioError) {
          console.error(`Error reading audio file for message ${index}:`, audioError);
          console.error(`Audio file path: ${fileName}`);
        }

        // Try to get phonemes and lip sync data
        try {
          await getPhonemes({ message: index });
          message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
          console.log(`Message ${index} - Lip sync data attached successfully`);
        } catch (lipSyncError) {
          console.error(`Error while getting phonemes for message ${index}:`, lipSyncError);
          console.warn(`Message ${index} will be returned without lip sync data, but audio should still work`);
          // Don't fail completely - audio can still play without lip sync
        }
      } catch (error) {
        console.error(`Unexpected error processing message ${index}:`, error);
        console.error(`Message ${index} text:`, message.text);
      }
    })
  );

  // Log final state of messages
  messages.forEach((message, index) => {
    console.log(`Message ${index} final state:`, {
      hasText: !!message.text,
      hasAudio: !!message.audio,
      hasLipsync: !!message.lipsync,
      audioLength: message.audio ? message.audio.length : 0
    });
  });

  return messages;
};

export { lipSync };
