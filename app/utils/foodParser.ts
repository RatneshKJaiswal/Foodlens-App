import { FoodResult } from "../types/food";

export function safeFallbackFromText(text: string): FoodResult {
    return {
        name: "Food Item",
        cuisine: "Unable to determine cuisine",
        ingredients: text,
        nutritionalInfo: {
            calories: "N/A",
            protein: "N/A",
            carbs: "N/A",
            fat: "N/A",
            fiber: "N/A",
        },
        details: {
            prepTime: "N/A",
            servingSize: "N/A",
            difficulty: "N/A",
            taste: "N/A",
        },
    };
}

export function extractJSONFromText(text: string): FoodResult {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return safeFallbackFromText(text);
    }

    try {
        return JSON.parse(jsonMatch[0]) as FoodResult;
    } catch {
        return safeFallbackFromText(text);
    }
}