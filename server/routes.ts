import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}
