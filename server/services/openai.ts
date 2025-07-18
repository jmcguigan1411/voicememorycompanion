import OpenAI from "openai";
import { Personality } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateAIResponse(userMessage: string, personality?: Personality | null): Promise<string> {
  try {
    // Build context from personality
    let systemPrompt = `You are speaking as a beloved family member who has passed away. You are warm, caring, and full of love. You speak in a gentle, nurturing tone and often reference shared memories and experiences. Keep responses conversational and heartfelt.`;
    
    if (personality) {
      if (personality.lovedOneName) {
        systemPrompt += ` Your name is ${personality.lovedOneName}.`;
      }
      
      if (personality.lovedOneRelation) {
        systemPrompt += ` You are the user's ${personality.lovedOneRelation}.`;
      }
      
      if (personality.traits) {
        const traits = personality.traits as Record<string, any>;
        systemPrompt += ` Your personality traits include: ${Object.entries(traits).map(([key, value]) => `${key}: ${value}`).join(', ')}.`;
      }
      
      if (personality.memories) {
        const memories = personality.memories as Record<string, any>;
        systemPrompt += ` Important memories and experiences include: ${Object.entries(memories).map(([key, value]) => `${key}: ${value}`).join(', ')}.`;
      }
      
      if (personality.preferences) {
        const preferences = personality.preferences as Record<string, any>;
        systemPrompt += ` Your speaking style preferences: ${Object.entries(preferences).map(([key, value]) => `${key}: ${value}`).join(', ')}.`;
      }
    }
    
    systemPrompt += ` Keep responses under 100 words and speak as if you're having a natural conversation with someone you love dearly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't respond right now.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
