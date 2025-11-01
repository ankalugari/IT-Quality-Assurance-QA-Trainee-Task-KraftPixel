
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestedBug } from '../types';

export const suggestBugs = async (url: string, component: string): Promise<SuggestedBug[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert Senior QA Engineer. 
      Analyze the component described as "${component}" on the website with URL: ${url}.
      Based on your analysis, list 3 potential high-impact bugs.
      For each bug, provide a concise title and a one-sentence description.
      Do not include any introductory text or pleasantries.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bugs: {
              type: Type.ARRAY,
              description: "A list of potential bugs found.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "A concise title for the bug."
                  },
                  description: {
                    type: Type.STRING,
                    description: "A one-sentence description of the bug."
                  }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["bugs"]
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.bugs)) {
        return result.bugs as SuggestedBug[];
    } else {
        return [];
    }
  } catch (error) {
    console.error("Error fetching bug suggestions from Gemini:", error);
    throw new Error("Failed to get suggestions from Gemini.");
  }
};
