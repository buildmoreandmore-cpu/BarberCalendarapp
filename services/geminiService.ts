
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecommendedSlot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const RECOMMENDATION_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: "ISO date string" },
      reason: { type: Type.STRING, description: "Human-friendly reason for this recommendation" },
      score: { type: Type.STRING, enum: ["optimal", "good", "risky"] },
      event: { type: Type.STRING, description: "Specific event this cut is timed for, if any" }
    },
    required: ["date", "reason", "score"]
  }
};

export async function getStyleRecommendations(profile: UserProfile): Promise<RecommendedSlot[]> {
  try {
    const prompt = `
      Act as a high-end personal style strategist and master barber. 
      Analyze the following user profile and provide a list of 5 upcoming recommended booking dates over the next 2 months.
      
      Profile:
      - Name: ${profile.name}
      - Hair Type: ${profile.hairType}
      - Growth Rate: ${profile.growthRate}
      - Weekly Rhythm: ${profile.weeklyRhythm}
      - Last Cut: ${profile.lastCutDate}
      
      Strategy Logic:
      - If growth is fast, recommend every 2-3 weeks.
      - If social-weekend rhythm, prioritize Thursday/Friday cuts.
      - If busy-midweek, prioritize Monday/Tuesday.
      - Calculate "optimal" vs "good" vs "risky" based on the growth cycle from the last cut.
      - Provide helpful, punchy advice for the 'reason' field (e.g., "Stay crisp before the weekend rush", "Right before your growth hits the messy stage").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECOMMENDATION_SCHEMA,
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}

export async function getStrategistCommentary(profile: UserProfile, recommendations: RecommendedSlot[]): Promise<string> {
  try {
    const prompt = `
      As a confident and direct Style Strategist, give me a short (2-sentence) summary of the current plan for ${profile.name}.
      Refer to their ${profile.growthRate} growth and ${profile.weeklyRhythm} lifestyle. 
      The tone should be "Trusted Advisor" - sophisticated, premium, and reassuring.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "You're on track to stay sharp. Let's keep this rhythm.";
  } catch (error) {
    return "Your schedule is locked in. You'll look sharp for what matters.";
  }
}
