import { GoogleGenAI, Type } from "@google/genai";
import { ScriptFramework, Tone, ChannelProfile } from "../types";

// Helper to sanitize JSON output from the model (removes markdown code blocks)
function cleanAndParseJSON(text: string) {
  try {
    // Remove ```json ... ``` or just ``` ... ```
    // Also remove any leading/trailing whitespace or non-JSON characters
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Heuristic: Find the first '{' and last '}' to handle preamble/postamble text
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleanText);
  } catch (e) {
    // Return null or throw a sanitized error to be caught by retry logic
    throw new Error("Invalid JSON format from AI");
  }
}

// Helper for retry logic with exponential backoff
async function generateWithRetry<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // If we have retries left, wait and retry
    if (retries > 0) {
      // Log to debug only, keeping console clean
      console.debug(`AI Operation retry (${retries} left).`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(operation, retries - 1, delay * 2);
    }
    // No retries left, throw original error
    throw error;
  }
}

export async function generateResearchAndHooks(topic: string, niche: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Define the operation logic
  const performGeneration = async (useSearch: boolean) => {
    const config: any = {
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
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this YouTube topic: "${topic}" in the "${niche}" niche. 
      1. Research key facts, trends, and what the competition is missing.
      2. Generate 3 unique "Scroll-Stopping" hook variations for the first 15 seconds.`,
      config
    });

    if (!response.text) throw new Error("No response from AI");
    return cleanAndParseJSON(response.text);
  };

  try {
    // Attempt 1: Try with Google Search (1 retry allowed)
    return await generateWithRetry(() => performGeneration(true), 1, 1000);
  } catch (e) {
    // Quietly fallback
    console.debug("Search tool unavailable, switching to offline mode.");
    // Attempt 2: Fallback to basic knowledge (3 retries allowed)
    return await generateWithRetry(() => performGeneration(false), 3, 2000);
  }
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
  Target Audience: ${profile.targetAudience}. 
  Objective: Maximum viewer retention. 
  Style: ${framework}, Tone: ${tone}.`;

  const prompt = `Topic: "${topic}"
  Research: ${research}
  Selected Hook: "${selectedHook}"
  
  Generate the full script. Return a JSON object containing an array of sections.`;

  // We wrap the array in an object for better JSON mode stability
  const schema = {
    type: Type.OBJECT,
    properties: {
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "Phase name" },
            content: { type: Type.STRING, description: "Script content" }
          },
          required: ["label", "content"]
        }
      }
    }
  };

  const performGeneration = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Force Flash for maximum stability
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (!response.text) throw new Error("No response from AI");
    const parsed = cleanAndParseJSON(response.text);
    return parsed.sections; // Unwrap the sections array
  };

  // Execute with robust retry logic
  return await generateWithRetry(() => performGeneration(), 3, 2000);
}

export async function regenerateSection(
  currentContent: string, 
  instruction: string,
  tone: Tone
) {
  return generateWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite this script section. Instruction: "${instruction}". Tone: ${tone}. 
      Original: "${currentContent}"
      Return ONLY the new content text.`,
    });

    return response.text || currentContent;
  });
}