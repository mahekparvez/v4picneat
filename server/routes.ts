import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// ─── Nutrition lookup database (per typical serving) ───────────────────────
const NUTRITION_DB: {
  keywords: string[];
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}[] = [
  // Purdue Dining Hall classics
  { keywords: ['ribette', 'pork ribette', 'pork rib'], name: 'Pork Ribette', calories: 280, protein: 20, carbs: 6, fats: 20 },
  { keywords: ['mac and cheese', 'mac & cheese', 'macaroni'], name: 'Mac & Cheese', calories: 420, protein: 14, carbs: 52, fats: 18 },
  { keywords: ['chicken tenders', 'chicken strips', 'chicken fingers'], name: 'Chicken Tenders', calories: 380, protein: 28, carbs: 24, fats: 18 },
  { keywords: ['chicken sandwich', 'crispy chicken sandwich'], name: 'Chicken Sandwich', calories: 450, protein: 30, carbs: 42, fats: 18 },
  // Proteins
  { keywords: ['grilled chicken', 'chicken breast', 'plain chicken', 'baked chicken', 'roasted chicken'], name: 'Grilled Chicken', calories: 185, protein: 31, carbs: 0, fats: 5 },
  { keywords: ['fried chicken'], name: 'Fried Chicken', calories: 340, protein: 25, carbs: 18, fats: 19 },
  { keywords: ['chicken'], name: 'Chicken', calories: 220, protein: 28, carbs: 3, fats: 10 },
  { keywords: ['beef', 'ground beef', 'hamburger patty'], name: 'Beef', calories: 290, protein: 22, carbs: 0, fats: 22 },
  { keywords: ['burger', 'hamburger', 'cheeseburger'], name: 'Burger', calories: 460, protein: 24, carbs: 40, fats: 22 },
  { keywords: ['steak', 'sirloin', 'ribeye', 'filet'], name: 'Steak', calories: 300, protein: 28, carbs: 0, fats: 20 },
  { keywords: ['salmon', 'grilled salmon', 'baked salmon'], name: 'Grilled Salmon', calories: 280, protein: 28, carbs: 0, fats: 17 },
  { keywords: ['fish', 'tilapia', 'cod', 'halibut', 'baked fish'], name: 'Fish', calories: 210, protein: 26, carbs: 0, fats: 10 },
  { keywords: ['shrimp', 'shrimp scampi', 'grilled shrimp'], name: 'Shrimp', calories: 160, protein: 26, carbs: 2, fats: 5 },
  { keywords: ['turkey', 'turkey breast', 'turkey sandwich'], name: 'Turkey', calories: 200, protein: 28, carbs: 2, fats: 8 },
  { keywords: ['egg', 'scrambled egg', 'fried egg', 'boiled egg', 'eggs', 'omelette', 'omelet'], name: 'Eggs', calories: 180, protein: 13, carbs: 2, fats: 14 },
  { keywords: ['tofu'], name: 'Tofu', calories: 180, protein: 16, carbs: 5, fats: 10 },
  // Pizza
  { keywords: ['pizza', 'cheese pizza', 'pepperoni pizza', 'margherita'], name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
  // Pasta
  { keywords: ['pasta', 'spaghetti', 'penne', 'fettuccine', 'linguine', 'noodle', 'noodles', 'lo mein'], name: 'Pasta', calories: 360, protein: 13, carbs: 62, fats: 6 },
  { keywords: ['pasta alfredo', 'fettuccine alfredo', 'cream pasta'], name: 'Pasta Alfredo', calories: 490, protein: 16, carbs: 54, fats: 24 },
  { keywords: ['pasta marinara', 'spaghetti marinara', 'tomato pasta'], name: 'Pasta Marinara', calories: 320, protein: 12, carbs: 58, fats: 5 },
  // Rice
  { keywords: ['rice', 'white rice', 'brown rice', 'steamed rice'], name: 'Steamed Rice', calories: 240, protein: 5, carbs: 52, fats: 0.5 },
  { keywords: ['fried rice', 'chicken fried rice', 'vegetable fried rice'], name: 'Fried Rice', calories: 360, protein: 12, carbs: 58, fats: 10 },
  // Stir fry
  { keywords: ['stir fry', 'stir-fry', 'beef stir fry', 'chicken stir fry', 'vegetable stir fry'], name: 'Stir Fry', calories: 380, protein: 24, carbs: 40, fats: 12 },
  // Sandwiches / Wraps
  { keywords: ['sandwich', 'sub', 'hoagie', 'hero'], name: 'Sandwich', calories: 380, protein: 20, carbs: 42, fats: 14 },
  { keywords: ['wrap', 'burrito', 'quesadilla', 'tortilla'], name: 'Wrap', calories: 400, protein: 20, carbs: 46, fats: 15 },
  { keywords: ['taco', 'tacos', 'soft taco'], name: 'Tacos', calories: 260, protein: 14, carbs: 26, fats: 11 },
  // Breakfast
  { keywords: ['pancake', 'pancakes'], name: 'Pancakes', calories: 310, protein: 8, carbs: 52, fats: 9 },
  { keywords: ['waffle', 'waffles'], name: 'Waffles', calories: 290, protein: 7, carbs: 44, fats: 10 },
  { keywords: ['french toast'], name: 'French Toast', calories: 270, protein: 9, carbs: 36, fats: 10 },
  { keywords: ['oatmeal', 'oats', 'porridge'], name: 'Oatmeal', calories: 200, protein: 7, carbs: 38, fats: 4 },
  { keywords: ['cereal', 'granola'], name: 'Cereal', calories: 250, protein: 6, carbs: 48, fats: 4 },
  // Sides / Starchy
  { keywords: ['fries', 'french fries', 'potato fries'], name: 'French Fries', calories: 380, protein: 4, carbs: 50, fats: 18 },
  { keywords: ['mashed potato', 'mashed potatoes', 'mash'], name: 'Mashed Potatoes', calories: 240, protein: 4, carbs: 36, fats: 9 },
  { keywords: ['potato', 'baked potato', 'sweet potato'], name: 'Baked Potato', calories: 200, protein: 4, carbs: 44, fats: 0.2 },
  { keywords: ['bread', 'toast', 'roll', 'dinner roll'], name: 'Bread Roll', calories: 140, protein: 5, carbs: 26, fats: 2 },
  // Salads
  { keywords: ['salad', 'garden salad', 'green salad', 'side salad'], name: 'Garden Salad', calories: 130, protein: 4, carbs: 14, fats: 7 },
  { keywords: ['caesar salad'], name: 'Caesar Salad', calories: 210, protein: 9, carbs: 14, fats: 14 },
  { keywords: ['grilled chicken salad', 'chicken salad'], name: 'Grilled Chicken Salad', calories: 320, protein: 34, carbs: 14, fats: 14 },
  // Soup
  { keywords: ['soup', 'chicken soup', 'vegetable soup', 'minestrone', 'chili', 'chili bowl'], name: 'Soup', calories: 190, protein: 10, carbs: 24, fats: 6 },
  // Vegetables
  { keywords: ['broccoli', 'steamed broccoli'], name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fats: 0.6 },
  { keywords: ['mixed vegetables', 'vegetables', 'veggies', 'roasted vegetables'], name: 'Mixed Vegetables', calories: 90, protein: 4, carbs: 16, fats: 2 },
  // Dairy / Snacks
  { keywords: ['yogurt', 'greek yogurt'], name: 'Greek Yogurt', calories: 150, protein: 14, carbs: 17, fats: 3 },
  { keywords: ['cheese', 'cottage cheese'], name: 'Cheese', calories: 200, protein: 12, carbs: 2, fats: 16 },
  // Fruits
  { keywords: ['apple'], name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { keywords: ['banana'], name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { keywords: ['orange'], name: 'Orange', calories: 62, protein: 1.2, carbs: 15, fats: 0.2 },
  // Other
  { keywords: ['sushi', 'sushi roll', 'california roll'], name: 'Sushi Roll', calories: 290, protein: 10, carbs: 50, fats: 6 },
  { keywords: ['curry', 'chicken curry', 'beef curry'], name: 'Curry', calories: 380, protein: 24, carbs: 30, fats: 18 },
  { keywords: ['nachos'], name: 'Nachos', calories: 440, protein: 14, carbs: 52, fats: 22 },
  { keywords: ['hot dog', 'hotdog'], name: 'Hot Dog', calories: 290, protein: 12, carbs: 24, fats: 17 },
];

function lookupNutrition(query: string): {
  name: string; calories: number; protein: number; carbs: number; fats: number; confidence: number; source: string; matched: boolean;
} {
  const q = query.toLowerCase().trim();
  const qWords = new Set(q.split(/\s+/));
  let bestMatch = null;
  let bestScore = 0;

  for (const item of NUTRITION_DB) {
    for (const kw of item.keywords) {
      // Exact substring match → strongest signal
      const exact = q.includes(kw) || kw.includes(q);
      const kwWords = kw.split(/\s+/);
      const overlap = kwWords.filter((w) => qWords.has(w)).length;
      const score = overlap / Math.max(kwWords.length, qWords.size);
      const finalScore = exact ? Math.max(score, 0.9) : score;
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMatch = item;
      }
    }
  }

  if (bestMatch && bestScore >= 0.35) {
    return {
      name: bestMatch.name,
      calories: bestMatch.calories,
      protein: bestMatch.protein,
      carbs: bestMatch.carbs,
      fats: bestMatch.fats,
      confidence: Math.min(Math.round(bestScore * 40 + 58), 94),
      source: 'Menu Estimate',
      matched: true,
    };
  }

  // Generic fallback estimate
  return {
    name: query.charAt(0).toUpperCase() + query.slice(1),
    calories: 350,
    protein: 15,
    carbs: 38,
    fats: 12,
    confidence: 40,
    source: 'General Estimate',
    matched: false,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Meal name lookup – returns nutrition estimate from menu/database
  app.post("/api/lookup-meal", async (req: any, res) => {
    const { name } = req.body ?? {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "No meal name provided" });
    }
    const result = lookupNutrition(name.trim());
    return res.json(result);
  });

  // ML Food Prediction Route (no auth required for now)
  app.post("/api/predict", async (req: any, res) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // For now, use a simple mock prediction
      // TODO: Replace with actual ML model inference
      const foods = [
        { food_name: "Pizza", calories: 285, protein: 12, carbs: 36, fats: 10, confidence: 85 },
        { food_name: "Pasta", calories: 320, protein: 12, carbs: 58, fats: 4, confidence: 78 },
        { food_name: "Pancake", calories: 227, protein: 6, carbs: 28, fats: 10, confidence: 92 },
        { food_name: "Grilled Chicken Salad", calories: 350, protein: 35, carbs: 12, fats: 18, confidence: 88 },
        { food_name: "Beef Stir Fry", calories: 450, protein: 28, carbs: 45, fats: 22, confidence: 82 },
      ];
      
      const prediction = foods[Math.floor(Math.random() * foods.length)];
      
      res.json(prediction);
    } catch (error) {
      console.error("Error predicting food:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Simple meal logging without auth
  app.post("/api/log-meal", async (req: any, res) => {
    try {
      const { name, calories, protein, carbs, fats, image } = req.body;

      // Return success - actual storage happens on client side for now
      res.json({
        success: true,
        meal: { name, calories, protein, carbs, fats, image }
      });
    } catch (error) {
      console.error("Error logging meal:", error);
      res.status(400).json({ error: "Failed to log meal" });
    }
  });

  // Leaderboard — returns top streaks/miles from userProfiles
  app.get("/api/leaderboard", async (_req: any, res) => {
    try {
      const data = await storage.getLeaderboard();
      res.json(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  return httpServer;
}
