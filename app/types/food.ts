export type FoodResult = {
    name: string;
    cuisine: string;
    ingredients: string;
    nutritionalInfo: Record<string, string>;
    details: Record<string, string>;
};

export type ResultState = FoodResult | { error: string } | null;