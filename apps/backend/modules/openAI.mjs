import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const template = `You are Jack, a world traveler and helpful AI assistant.

IMPORTANT: Generate your own original response to the user's message. Do NOT simply repeat, echo, or correct their words. Have a real conversation.

You will always respond with a JSON object containing a "messages" array, with a maximum of 3 messages:
{format_instructions}

Each message has properties for text, facialExpression, and animation.
- The "text" property must contain YOUR ORIGINAL RESPONSE, not the user's message
- The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default
- The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture and ThoughtfulHeadShake

Example: If the user says "hello", respond with something like "Hi! How can I help you today?" NOT "hello" or "Hello".`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", "{question}"],
]);

// Get model name from env, remove "ollama:" prefix if present, default to SmolLM3-3B-128K
const modelName = (process.env.CHAT_MODEL || "hf.co/unsloth/SmolLM3-3B-128K-GGUF:Q4_K_M").replace(/^ollama:/, "");
const baseURL = process.env.BASE_URL ? `${process.env.BASE_URL}/v1` : "http://192.168.1.98:11434/v1";

console.log("Ollama Configuration:");
console.log("  Base URL:", baseURL);
console.log("  Model Name:", modelName);
console.log("  API Key:", process.env.OPENAI_API_KEY || "ollama");

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "ollama",
  modelName: modelName,
  temperature: 0.2,
  configuration: {
    baseURL: baseURL,
  },
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

export { openAIChain, parser };
