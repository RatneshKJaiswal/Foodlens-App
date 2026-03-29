import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateDynamicDietPlan(apiKey: string, userStats: any) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Act as a professional Nutritionist for a user: ${userStats.gender}, ${userStats.age}y, ${userStats.weight}kg, ${userStats.goal}.
    
    Create a 7-day diet plan. For EVERY meal, you MUST provide:
    1. "meal": Descriptive name.
    2. "kcal": Number.
    3. "imageKeyword": 2-word food search term (e.g., "grilled salmon").
    4. "icon": ONLY use these: "egg", "fish", "food-apple", "bread-slice", "leaf", "turkey".

    Return ONLY a JSON object:
    {
      "analysis": { "calories": 2200, "reasoning": "..." },
      "days": { "Mon": [ { "type": "Breakfast", "meal": "...", "kcal": 400, "imageKeyword": "...", "icon": "..." } ], ... }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    return null;
  }
}
