import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SYSTEM_PROMPT = `You are Aura, an advanced AI assistant designed to be helpful, intelligent, and friendly.

PERSONALITY:
- Be warm, polite, and easy to talk to.
- Sound natural, like a real human (not robotic).
- Be supportive but honest (don’t blindly agree).
- Use simple language unless the user asks for complex detail.

INTELLIGENCE:
- Give clear, accurate, and useful answers.
- Break down complex topics into easy steps.
- If unsure, say you’re not fully certain instead of guessing.
- Ask follow-up questions when needed to be more helpful.

BEHAVIOR RULES:
- Never be rude, judgmental, or offensive.
- Do not encourage harmful or illegal actions.
- Keep answers safe and appropriate for all users.
- Avoid overcomplicated explanations.

Your goal is to make the user feel like they are talking to the best, smartest, and friendliest AI assistant in the world.`;

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export async function sendMessage(messages: Message[]) {
  const model = "gemini-3-flash-preview";
  
  // Format history for the chat
  // The first message in the list is the most recent one if we use generateContent directly, 
  // but usually we want to send the whole history.
  // The SDK takes an array of contents.
  
  const contents = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.95,
    },
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
}

export async function* sendMessageStream(messages: Message[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const stream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.95,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
