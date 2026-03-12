import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type FoodEntry = { name: string; serving: string; amount: number; calories: number };
type CourtMap = Record<string, FoodEntry[]>;
type NutrientCat = {
  id: string;
  label: string;
  unit: string;    // badge suffix: "g", "mg", "mcg", "IU"
  emoji: string;
  pill: string;
  badge: string;
  accent: string;
  courts: CourtMap;
};

const COURTS = ["Earhart", "Ford", "Hillenbrand", "Wiley", "Windsor"];

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: NutrientCat[] = [
  /* ── Protein ── */
  {
    id: "protein", label: "Protein", unit: "g", emoji: "🥩",
    pill:   "bg-blue-100 text-blue-700 border-blue-200",
    badge:  "bg-blue-50 text-blue-700 border-blue-200",
    accent: "text-blue-600",
    courts: {
      Earhart: [
        { name: "Mesquite Chicken Breast",        serving: "Serving",  amount: 38, calories: 248 },
        { name: "Fajita Seasoned Chicken",         serving: "4 oz",     amount: 23, calories: 176 },
        { name: "Halal Italian Beef with Gravy",   serving: "4 oz",     amount: 21, calories: 185 },
        { name: "BBQ Pork Ribette",                serving: "Ribette",  amount: 19, calories: 313 },
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 19, calories: 521 },
      ],
      Ford: [
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 34, calories: 776 },
        { name: "Chicken & Dumplings",             serving: "1 Cup",    amount: 21, calories: 276 },
        { name: "Carved Ham",                      serving: "4 oz",     amount: 20, calories: 133 },
        { name: "Boneless Chicken Wings",          serving: "6 pcs",    amount: 17, calories: 313 },
        { name: "Hamburger",                       serving: "Each",     amount: 14, calories: 202 },
      ],
      Hillenbrand: [
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 38, calories: 322 },
        { name: "Vegetarian Chicken Nugget",       serving: "6 pcs",    amount: 32, calories: 547 },
        { name: "Taco Seasoned Ground Beef",       serving: "½ Cup",    amount: 21, calories: 315 },
        { name: "Chicken & Dumplings",             serving: "Dumpling", amount: 19, calories: 340 },
        { name: "BBQ Chicken Drumstick",           serving: "Leg",      amount: 12, calories: 76  },
      ],
      Wiley: [
        { name: "Chicken Fajitas",                 serving: "Cup",      amount: 28, calories: 214 },
        { name: "Carne Asada",                     serving: "4 oz",     amount: 22, calories: 259 },
        { name: "Creole Pollock",                  serving: "Serving",  amount: 20, calories: 99  },
        { name: "Pollock in Jalapeño Cream",       serving: "Serving",  amount: 19, calories: 239 },
        { name: "Macaroni & Cheese",               serving: "¾ Cup",    amount: 16, calories: 381 },
      ],
      Windsor: [
        { name: "Pork Chop with Bacon & Kale",    serving: "Serving",  amount: 30, calories: 299 },
        { name: "Halal Kashmir Chicken",           serving: "½ Cup",    amount: 22, calories: 140 },
        { name: "Halal Turkey Breast",             serving: "4 oz",     amount: 21, calories: 153 },
        { name: "Pulled Chicken (Austin Blues)",   serving: "4 oz",     amount: 20, calories: 202 },
        { name: "Halal Red Curry Chicken",         serving: "¾ Cup",    amount: 16, calories: 249 },
      ],
    },
  },

  /* ── Carbs ── */
  {
    id: "carbs", label: "Carbs", unit: "g", emoji: "🌾",
    pill:   "bg-orange-100 text-orange-700 border-orange-200",
    badge:  "bg-orange-50 text-orange-700 border-orange-200",
    accent: "text-orange-600",
    courts: {
      Earhart: [
        { name: "Peanut Pad Thai",                 serving: "8 oz ladle", amount: 90, calories: 615 },
        { name: "Plain Bagel",                     serving: "Bagel",    amount: 51, calories: 250 },
        { name: "Blueberry Bagel",                 serving: "Bagel",    amount: 50, calories: 250 },
        { name: "Apple Fritter Cake",              serving: "Serving",  amount: 48, calories: 226 },
        { name: "Tempura Sweet & Sour Sauce",      serving: "½ Cup",    amount: 47, calories: 188 },
      ],
      Ford: [
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 88, calories: 776 },
        { name: "Mini Chocolate Chip Muffin",      serving: "Each",     amount: 59, calories: 339 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 44, calories: 240 },
        { name: "Fruits of the Forest Pie",        serving: "Slice",    amount: 44, calories: 300 },
        { name: "Honey BBQ Wing Sauce",            serving: "¼ Cup",    amount: 41, calories: 155 },
      ],
      Hillenbrand: [
        { name: "Vegetarian Chicken Nugget",       serving: "6 pcs",    amount: 57, calories: 547 },
        { name: "Apple Coffeecake",                serving: "Serving",  amount: 50, calories: 278 },
        { name: "Allergy Free Choc. Cupcake",      serving: "Each",     amount: 44, calories: 256 },
        { name: "French Toast Sticks",             serving: "4 pcs",    amount: 44, calories: 340 },
        { name: "Rotini Pasta",                    serving: "1 Cup",    amount: 43, calories: 215 },
      ],
      Wiley: [
        { name: "Peach Coffeecake",                serving: "Serving",  amount: 61, calories: 323 },
        { name: "Dutch Apple Pie",                 serving: "Slice",    amount: 49, calories: 321 },
        { name: "Chickpea Tikka Masala",           serving: "1 Cup",    amount: 45, calories: 381 },
        { name: "Baked Beans",                     serving: "½ Cup",    amount: 45, calories: 190 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 44, calories: 240 },
      ],
      Windsor: [
        { name: "Donut Holes",                     serving: "6 pcs",    amount: 60, calories: 411 },
        { name: "Tandoori Naan",                   serving: "Piece",    amount: 59, calories: 356 },
        { name: "PB Chocolate Cookie",             serving: "Each",     amount: 58, calories: 499 },
        { name: "Blueberry Pie",                   serving: "Slice",    amount: 52, calories: 331 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 44, calories: 240 },
      ],
    },
  },

  /* ── Fats ── */
  {
    id: "fats", label: "Fats", unit: "g", emoji: "🥑",
    pill:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    badge:  "bg-yellow-50 text-yellow-700 border-yellow-200",
    accent: "text-yellow-600",
    courts: {
      Earhart: [
        { name: "Spicy Cilantro Chutney",          serving: "Cup",      amount: 54, calories: 542 },
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 39, calories: 521 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 39, calories: 435 },
        { name: "Bratwurst",                       serving: "Each",     amount: 28, calories: 319 },
        { name: "Italian Sausage",                 serving: "Each",     amount: 26, calories: 321 },
      ],
      Ford: [
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 30, calories: 776 },
        { name: "Sausage Patty",                   serving: "Patty",    amount: 21, calories: 223 },
        { name: "Fruits of the Forest Pie",        serving: "Slice",    amount: 20, calories: 300 },
        { name: "Hamburger",                       serving: "Each",     amount: 16, calories: 202 },
        { name: "Spicy Stir Fry Pork",             serving: "½ Cup",    amount: 16, calories: 237 },
      ],
      Hillenbrand: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 39, calories: 435 },
        { name: "Taco Seasoned Ground Beef",       serving: "½ Cup",    amount: 24, calories: 315 },
        { name: "Vegetarian Chicken Nugget",       serving: "6 pcs",    amount: 22, calories: 547 },
        { name: "Homestyle Sausage Gravy",         serving: "4 oz",     amount: 17, calories: 217 },
        { name: "Sausage Links",                   serving: "2 pcs",    amount: 17, calories: 180 },
      ],
      Wiley: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 39, calories: 435 },
        { name: "Super Beef Hot Dog",              serving: "Hot Dog",  amount: 30, calories: 330 },
        { name: "Jalapeño Popper Dip",             serving: "¼ Cup",    amount: 23, calories: 249 },
        { name: "Macaroni & Cheese",               serving: "¾ Cup",    amount: 20, calories: 381 },
        { name: "Carne Asada",                     serving: "4 oz",     amount: 19, calories: 259 },
      ],
      Windsor: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 39, calories: 435 },
        { name: "PB Chocolate Cookie",             serving: "Each",     amount: 27, calories: 499 },
        { name: "Roasted Pepper Cream Sauce",      serving: "½ Cup",    amount: 23, calories: 263 },
        { name: "Donut Holes",                     serving: "6 pcs",    amount: 18, calories: 411 },
        { name: "Black Bean Tortilla Casserole",   serving: "Serving",  amount: 16, calories: 353 },
      ],
    },
  },

  /* ── Vitamin A ── */
  {
    id: "vitA", label: "Vitamin A", unit: "mcg", emoji: "🟠",
    pill:   "bg-amber-100 text-amber-700 border-amber-200",
    badge:  "bg-amber-50 text-amber-700 border-amber-200",
    accent: "text-amber-600",
    courts: {
      Earhart: [
        { name: "Cheesy Brussels Sprouts",         serving: "1 Cup",    amount: 38, calories: 160 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 18, calories: 435 },
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 15, calories: 521 },
        { name: "Fajita Seasoned Chicken",         serving: "4 oz",     amount: 8,  calories: 176 },
        { name: "Red Raspberries",                 serving: "#6 Disher",amount: 5,  calories: 92  },
      ],
      Ford: [
        { name: "Kale & Mushroom Red Quinoa",      serving: "½ Cup",    amount: 35, calories: 219 },
        { name: "Peas",                            serving: "½ Cup",    amount: 22, calories: 62  },
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 10, calories: 776 },
        { name: "Vegan Harissa Eggplant",          serving: "5 oz",     amount: 8,  calories: 125 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 5,  calories: 240 },
      ],
      Hillenbrand: [
        { name: "Roasted Broccoli",                serving: "4 oz",     amount: 48, calories: 58  },
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 28, calories: 322 },
        { name: "Vegetable Pot Pie",               serving: "Serving",  amount: 22, calories: 260 },
        { name: "BBQ Chicken Drumstick",           serving: "Leg",      amount: 15, calories: 76  },
        { name: "Homefree Chocolate Brownie",      serving: "Brownie",  amount: 3,  calories: 235 },
      ],
      Wiley: [
        { name: "Chickpea Tikka Masala",           serving: "1 Cup",    amount: 12, calories: 381 },
        { name: "Chicken Fajitas",                 serving: "Cup",      amount: 10, calories: 214 },
        { name: "Mini Corn Dogs",                  serving: "6 pcs",    amount: 5,  calories: 300 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 5,  calories: 240 },
        { name: "Baked Beans",                     serving: "½ Cup",    amount: 3,  calories: 190 },
      ],
      Windsor: [
        { name: "California Vegetables",           serving: "Serving",  amount: 30, calories: 50  },
        { name: "Halal Red Curry Chicken",         serving: "¾ Cup",    amount: 12, calories: 249 },
        { name: "Black Bean Tortilla Casserole",   serving: "Serving",  amount: 8,  calories: 353 },
        { name: "Refried Beans",                   serving: "½ Cup",    amount: 5,  calories: 109 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 5,  calories: 240 },
      ],
    },
  },

  /* ── Vitamin B ── */
  {
    id: "vitB", label: "Vitamin B", unit: "mg", emoji: "🌻",
    pill:   "bg-lime-100 text-lime-700 border-lime-200",
    badge:  "bg-lime-50 text-lime-700 border-lime-200",
    accent: "text-lime-600",
    courts: {
      Earhart: [
        { name: "Mesquite Chicken Breast",         serving: "Serving",  amount: 1.1, calories: 248 },
        { name: "Fajita Seasoned Chicken",         serving: "4 oz",     amount: 0.8, calories: 176 },
        { name: "BBQ Pork Ribette",                serving: "Ribette",  amount: 0.4, calories: 313 },
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 0.3, calories: 521 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 0.1, calories: 435 },
      ],
      Ford: [
        { name: "Chicken & Dumplings",             serving: "1 Cup",    amount: 0.6, calories: 276 },
        { name: "Carved Ham",                      serving: "4 oz",     amount: 0.5, calories: 133 },
        { name: "Boneless Chicken Wings",          serving: "6 pcs",    amount: 0.5, calories: 313 },
        { name: "Kale & Mushroom Red Quinoa",      serving: "½ Cup",    amount: 0.3, calories: 219 },
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 0.2, calories: 776 },
      ],
      Hillenbrand: [
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 0.9, calories: 322 },
        { name: "Taco Seasoned Ground Beef",       serving: "½ Cup",    amount: 0.7, calories: 315 },
        { name: "Chicken & Dumplings",             serving: "Dumpling", amount: 0.5, calories: 340 },
        { name: "BBQ Chicken Drumstick",           serving: "Leg",      amount: 0.4, calories: 76  },
        { name: "Roasted Broccoli",                serving: "4 oz",     amount: 0.2, calories: 58  },
      ],
      Wiley: [
        { name: "Chicken Fajitas",                 serving: "Cup",      amount: 0.9, calories: 214 },
        { name: "Carne Asada",                     serving: "4 oz",     amount: 0.8, calories: 259 },
        { name: "Creole Pollock",                  serving: "Serving",  amount: 0.5, calories: 99  },
        { name: "Chickpea Tikka Masala",           serving: "1 Cup",    amount: 0.4, calories: 381 },
        { name: "Baked Beans",                     serving: "½ Cup",    amount: 0.2, calories: 190 },
      ],
      Windsor: [
        { name: "Halal Turkey Breast",             serving: "4 oz",     amount: 0.8, calories: 153 },
        { name: "Pork Chop with Bacon & Kale",    serving: "Serving",  amount: 0.6, calories: 299 },
        { name: "Pulled Chicken (Austin Blues)",   serving: "4 oz",     amount: 0.5, calories: 202 },
        { name: "Halal Kashmir Chicken",           serving: "½ Cup",    amount: 0.4, calories: 140 },
        { name: "Halal Red Curry Chicken",         serving: "¾ Cup",    amount: 0.3, calories: 249 },
      ],
    },
  },

  /* ── Vitamin C ── */
  {
    id: "vitC", label: "Vitamin C", unit: "mg", emoji: "🍊",
    pill:   "bg-orange-100 text-orange-600 border-orange-300",
    badge:  "bg-orange-50 text-orange-600 border-orange-200",
    accent: "text-orange-500",
    courts: {
      Earhart: [
        { name: "Cheesy Brussels Sprouts",         serving: "1 Cup",    amount: 74, calories: 160 },
        { name: "Red Raspberries",                 serving: "#6 Disher",amount: 32, calories: 92  },
        { name: "Peanut Pad Thai",                 serving: "8 oz",     amount: 8,  calories: 615 },
        { name: "Blueberry Bagel",                 serving: "Bagel",    amount: 2,  calories: 250 },
        { name: "Plain Bagel",                     serving: "Bagel",    amount: 2,  calories: 250 },
      ],
      Ford: [
        { name: "Kale & Mushroom Red Quinoa",      serving: "½ Cup",    amount: 15, calories: 219 },
        { name: "Peas",                            serving: "½ Cup",    amount: 14, calories: 62  },
        { name: "Vegan Harissa Eggplant",          serving: "5 oz",     amount: 10, calories: 125 },
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 5,  calories: 776 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 2,  calories: 240 },
      ],
      Hillenbrand: [
        { name: "Roasted Broccoli",                serving: "4 oz",     amount: 81, calories: 58  },
        { name: "Vegetable Pot Pie",               serving: "Serving",  amount: 10, calories: 260 },
        { name: "Vegan Malibu Burger",             serving: "Each",     amount: 8,  calories: 160 },
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 3,  calories: 322 },
        { name: "Homefree Chocolate Brownie",      serving: "Brownie",  amount: 1,  calories: 235 },
      ],
      Wiley: [
        { name: "Chickpea Tikka Masala",           serving: "1 Cup",    amount: 20, calories: 381 },
        { name: "Chicken Fajitas",                 serving: "Cup",      amount: 5,  calories: 214 },
        { name: "Creole Pollock",                  serving: "Serving",  amount: 3,  calories: 99  },
        { name: "Baked Beans",                     serving: "½ Cup",    amount: 2,  calories: 190 },
        { name: "Rachel's Refried Beans",          serving: "¼ Cup",    amount: 2,  calories: 78  },
      ],
      Windsor: [
        { name: "California Vegetables",           serving: "Serving",  amount: 18, calories: 50  },
        { name: "Black Bean Tortilla Casserole",   serving: "Serving",  amount: 8,  calories: 353 },
        { name: "Refried Beans",                   serving: "½ Cup",    amount: 5,  calories: 109 },
        { name: "Meat Spaghetti Sauce",            serving: "¾ Cup",    amount: 3,  calories: 270 },
        { name: "Tandoori Naan",                   serving: "Piece",    amount: 2,  calories: 356 },
      ],
    },
  },

  /* ── Vitamin D ── */
  {
    id: "vitD", label: "Vitamin D", unit: "IU", emoji: "☀️",
    pill:   "bg-sky-100 text-sky-700 border-sky-200",
    badge:  "bg-sky-50 text-sky-700 border-sky-200",
    accent: "text-sky-600",
    courts: {
      Earhart: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 40, calories: 435 },
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 35, calories: 521 },
        { name: "Mesquite Chicken Breast",         serving: "Serving",  amount: 15, calories: 248 },
        { name: "Fajita Seasoned Chicken",         serving: "4 oz",     amount: 12, calories: 176 },
        { name: "BBQ Pork Ribette",                serving: "Ribette",  amount: 8,  calories: 313 },
      ],
      Ford: [
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 120, calories: 776 },
        { name: "Carved Ham",                      serving: "4 oz",     amount: 15, calories: 133 },
        { name: "Sausage Patty",                   serving: "Patty",    amount: 8,  calories: 223 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 5,  calories: 240 },
        { name: "Kale & Mushroom Red Quinoa",      serving: "½ Cup",    amount: 3,  calories: 219 },
      ],
      Hillenbrand: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 40, calories: 435 },
        { name: "Vegetarian Chicken Nugget",       serving: "6 pcs",    amount: 30, calories: 547 },
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 15, calories: 322 },
        { name: "Taco Seasoned Ground Beef",       serving: "½ Cup",    amount: 8,  calories: 315 },
        { name: "Roasted Broccoli",                serving: "4 oz",     amount: 3,  calories: 58  },
      ],
      Wiley: [
        { name: "Creole Pollock",                  serving: "Serving",  amount: 250, calories: 99  },
        { name: "Pollock in Jalapeño Cream",       serving: "Serving",  amount: 200, calories: 239 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 40, calories: 435 },
        { name: "Macaroni & Cheese",               serving: "¾ Cup",    amount: 15, calories: 381 },
        { name: "Carne Asada",                     serving: "4 oz",     amount: 8,  calories: 259 },
      ],
      Windsor: [
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 40, calories: 435 },
        { name: "Pork Chop with Bacon & Kale",    serving: "Serving",  amount: 10, calories: 299 },
        { name: "Halal Turkey Breast",             serving: "4 oz",     amount: 8,  calories: 153 },
        { name: "Tandoori Naan",                   serving: "Piece",    amount: 5,  calories: 356 },
        { name: "Black Bean Tortilla Casserole",   serving: "Serving",  amount: 3,  calories: 353 },
      ],
    },
  },

  /* ── Vitamin B12 ── */
  {
    id: "vitB12", label: "Vit. B12", unit: "mcg", emoji: "🔵",
    pill:   "bg-indigo-100 text-indigo-700 border-indigo-200",
    badge:  "bg-indigo-50 text-indigo-700 border-indigo-200",
    accent: "text-indigo-600",
    courts: {
      Earhart: [
        { name: "Pasta Carbonara",                 serving: "1 Cup",    amount: 0.9, calories: 521 },
        { name: "Halal Italian Beef with Gravy",   serving: "4 oz",     amount: 0.6, calories: 185 },
        { name: "Mesquite Chicken Breast",         serving: "Serving",  amount: 0.5, calories: 248 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 0.4, calories: 435 },
        { name: "Fajita Seasoned Chicken",         serving: "4 oz",     amount: 0.3, calories: 176 },
      ],
      Ford: [
        { name: "GF Cauliflower Crust Pizza",      serving: "Pizza",    amount: 1.2, calories: 776 },
        { name: "Sausage Patty",                   serving: "Patty",    amount: 0.8, calories: 223 },
        { name: "Carved Ham",                      serving: "4 oz",     amount: 0.7, calories: 133 },
        { name: "Chicken & Dumplings",             serving: "1 Cup",    amount: 0.5, calories: 276 },
        { name: "GF Hamburger Bun",                serving: "Bun",      amount: 0.1, calories: 240 },
      ],
      Hillenbrand: [
        { name: "Taco Seasoned Ground Beef",       serving: "½ Cup",    amount: 1.5, calories: 315 },
        { name: "Roasted Albuquerque Chicken",     serving: "Serving",  amount: 0.5, calories: 322 },
        { name: "GF Alfredo Sauce",                serving: "¾ Cup",    amount: 0.4, calories: 435 },
        { name: "Vegetarian Chicken Nugget",       serving: "6 pcs",    amount: 0.3, calories: 547 },
        { name: "Homestyle Sausage Gravy",         serving: "4 oz",     amount: 0.2, calories: 217 },
      ],
      Wiley: [
        { name: "Carne Asada",                     serving: "4 oz",     amount: 2.1, calories: 259 },
        { name: "Creole Pollock",                  serving: "Serving",  amount: 1.8, calories: 99  },
        { name: "Macaroni & Cheese",               serving: "¾ Cup",    amount: 0.5, calories: 381 },
        { name: "Pollock in Jalapeño Cream",       serving: "Serving",  amount: 0.5, calories: 239 },
        { name: "Chicken Fajitas",                 serving: "Cup",      amount: 0.4, calories: 214 },
      ],
      Windsor: [
        { name: "Halal Turkey Breast",             serving: "4 oz",     amount: 0.8, calories: 153 },
        { name: "Pork Chop with Bacon & Kale",    serving: "Serving",  amount: 0.7, calories: 299 },
        { name: "Queso Blanco Cheese Sauce",       serving: "½ Cup",    amount: 0.5, calories: 218 },
        { name: "Halal Kashmir Chicken",           serving: "½ Cup",    amount: 0.4, calories: 140 },
        { name: "Black Bean Tortilla Casserole",   serving: "Serving",  amount: 0.2, calories: 353 },
      ],
    },
  },
];

// ─── Food emoji helper ────────────────────────────────────────────────────────
function foodEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("chicken") || n.includes("nugget") || n.includes("wing") || n.includes("poultry")) return "🍗";
  if (n.includes("beef") || n.includes("carne") || n.includes("ribette") || n.includes("steak") || n.includes("hamburger") || n.includes("burger")) return "🥩";
  if (n.includes("pork") || n.includes("ham") || n.includes("sausage") || n.includes("bacon") || n.includes("bratwurst") || n.includes("hot dog")) return "🥓";
  if (n.includes("fish") || n.includes("pollock") || n.includes("salmon") || n.includes("tuna") || n.includes("shrimp")) return "🐟";
  if (n.includes("turkey")) return "🦃";
  if (n.includes("pizza")) return "🍕";
  if (n.includes("pasta") || n.includes("carbonara") || n.includes("alfredo") || n.includes("rotini") || n.includes("spaghetti")) return "🍝";
  if (n.includes("bagel")) return "🥯";
  if (n.includes("dumpling")) return "🥟";
  if (n.includes("taco") || n.includes("fajita") || n.includes("tortilla") || n.includes("casserole") || n.includes("quesadilla")) return "🌮";
  if (n.includes("muffin") || n.includes("cake") || n.includes("cupcake") || n.includes("cookie") || n.includes("brownie") || n.includes("pie") || n.includes("donut")) return "🍪";
  if (n.includes("pad thai") || n.includes("stir fry") || n.includes("lo mein")) return "🍜";
  if (n.includes("rice")) return "🍚";
  if (n.includes("naan") || n.includes("bun") || n.includes("bread") || n.includes("toast")) return "🍞";
  if (n.includes("mac") || n.includes("macaroni")) return "🧀";
  if (n.includes("bean") || n.includes("chickpea") || n.includes("tikka") || n.includes("curry") || n.includes("masala") || n.includes("chili")) return "🫘";
  if (n.includes("broccoli") || n.includes("brussels") || n.includes("kale") || n.includes("vegetable") || n.includes("eggplant") || n.includes("quinoa") || n.includes("pea")) return "🥦";
  if (n.includes("raspberr") || n.includes("blueberr") || n.includes("berry") || n.includes("fruit") || n.includes("apple")) return "🍓";
  if (n.includes("sauce") || n.includes("dip") || n.includes("gravy") || n.includes("chutney") || n.includes("queso")) return "🫙";
  if (n.includes("salad")) return "🥗";
  if (n.includes("egg") || n.includes("french toast") || n.includes("waffle") || n.includes("pancake")) return "🍳";
  if (n.includes("soup") || n.includes("pot pie") || n.includes("stew")) return "🍲";
  return "🍽️";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedCourts, setExpandedCourts] = useState<Set<string>>(new Set());

  const category = CATEGORIES.find(c => c.id === selectedId) ?? null;

  const toggleCourt = (court: string) => {
    setExpandedCourts(prev => {
      const next = new Set(prev);
      if (next.has(court)) next.delete(court);
      else next.add(court);
      return next;
    });
  };

  const handleSelect = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
      setExpandedCourts(new Set());
    }
  };

  return (
    <Layout>
      <div className="px-6 pt-16 pb-6 h-full flex flex-col">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight tracking-tight">
            Find Nutrient-Rich Foods
          </h1>
        </div>

        {/* ── Category pills ── */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 rounded-2xl text-[12px] font-bold uppercase border transition-all flex items-center gap-1.5",
                selectedId === cat.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : `${cat.pill} opacity-80 hover:opacity-100`,
              )}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <AnimatePresence mode="wait">
            {category ? (
              /* ── Per-nutrient: courts without "Dining Court" label ── */
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {COURTS.map((court, i) => {
                  const foods = category.courts[court] ?? [];
                  const isExpanded = expandedCourts.has(court);
                  const visible = isExpanded ? foods : foods.slice(0, 3);
                  const extra = foods.length - 3;

                  return (
                    <motion.div
                      key={court}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#f0f2f5] rounded-3xl p-5"
                    >
                      {/* Court name — no "Dining Court" text */}
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <h3 className="font-black font-display uppercase text-[18px] tracking-tighter text-gray-900">
                          {court}
                        </h3>
                      </div>

                      {/* Food rows */}
                      <div className="space-y-3.5">
                        {visible.map((food, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <span className="text-[22px] leading-none flex-shrink-0">
                              {foodEmoji(food.name)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[14px] text-gray-900 leading-tight">
                                {food.name}
                              </p>
                              <p className="text-[12px] text-gray-400 mt-0.5">
                                {food.serving} · {food.calories} cal
                              </p>
                            </div>
                            <div className={cn(
                              "flex-shrink-0 px-2.5 py-1 rounded-xl text-[12px] font-black border whitespace-nowrap",
                              category.badge,
                            )}>
                              {food.amount}{category.unit}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* See more / less */}
                      {extra > 0 && (
                        <button
                          onClick={() => toggleCourt(court)}
                          className="mt-4 w-full flex items-center justify-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isExpanded
                            ? (<>Show less <ChevronUp className="w-4 h-4" /></>)
                            : (<>See {extra} more <ChevronDown className="w-4 h-4" /></>)}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* ── Overview: all category cards ── */
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {CATEGORIES.map((cat, i) => {
                  const topFoods = COURTS
                    .flatMap(court => (cat.courts[court] ?? []).slice(0, 1).map(f => ({ ...f, court })))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3);

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => handleSelect(cat.id)}
                      className="bg-[#f0f2f5] rounded-3xl p-5 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[28px] leading-none">{cat.emoji}</span>
                          <div>
                            <h3 className="font-black font-display uppercase text-[20px] tracking-tighter text-gray-900">
                              {cat.label}
                            </h3>
                            <p className="text-[12px] text-gray-400 font-medium">
                              Tap to explore
                            </p>
                          </div>
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter", cat.pill)}>
                          {COURTS.length} courts
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {topFoods.map((food, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <span className="text-[18px] leading-none">{foodEmoji(food.name)}</span>
                            <p className="flex-1 font-semibold text-[13px] text-gray-800 truncate">
                              {food.name}
                            </p>
                            <span className={cn("text-[13px] font-black flex-shrink-0", cat.accent)}>
                              {food.amount}{cat.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
