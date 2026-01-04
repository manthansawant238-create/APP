
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptFramework, Tone, ChannelProfile } from "../types";

export async function generateResearchAndHooks(topic: string, niche: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this YouTube topic: "${topic}" in the "${niche}" niche. 
    1. Research key facts, trends, and what the competition is missing.
    2. Generate 3 unique "Scroll-Stopping" hook variations for the first 15 seconds. 
    Focus on curiosity gaps, pattern interrupts, and emotional triggers.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          research: { type: Type.STRING, description: "A detailed summary of research facts and insights." },
          hooks: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Three distinct viral-optimized hook scripts."
          }
        },
        required: ["research", "hooks"]
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
}

export async function generateFullScript(
  topic: string, 
  framework: ScriptFramework, 
  tone: Tone, 
  profile: ChannelProfile,
  research: string,
  selectedHook: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemPrompt = `You are an elite YouTube scriptwriter for a ${profile.niche} channel. 
  Your primary objective is maximum viewer retention (AHR). Use "Open Loops", "Pattern Interrupts", and "Conversational Narration". 
  NEVER use AI clichés like "In today's video" or "Let's dive in". 
  Write specifically for: ${profile.targetAudience}. Speak as a peer, but with the authority of an expert.`;

  const prompt = `Construct a full ${framework} script for the topic: "${topic}".
  Tone: ${tone}. 
  Incorporate this research: ${research}
  Start with this Hook: "${selectedHook}"
  
  Structure the output into these logical phases:
  1. Introduction & Hook (Refine the provided hook for flow)
  2. The Stakes (Define the problem or the curiosity gap clearly)
  3. Core Narrative (The "meat" of the video, broken into digestible segments)
  4. Conclusion & Retention-CTA (A call to action that keeps them on the platform).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      // Giving the pro model a thinking budget for complex writing logic
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "The name of the script phase." },
            content: { type: Type.STRING, description: "the actual spoken narration for this phase." }
          },
          required: ["label", "content"]
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
}

export async function regenerateSection(
  currentContent: string, 
  instruction: string,
  tone: Tone
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this specific script section following these instructions: "${instruction}". 
    Maintain the ${tone} tone. Return ONLY the new content for this section.
    
    Section Content:
    ${currentContent}`,
  });

  return response.text || currentContent;
}
