import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Note: In mockup mode we allow this to fail gracefully if env vars aren't set
// In production this would throw an error
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

// Database types (auto-generated from your schema)
export type User = {
  id: string;
  email: string;
  name: string;
  gender?: string;
  date_of_birth?: string;
  daily_calorie_goal: number;
  current_streak: number;
  total_miles: number;
  // ... add other fields
};

export type Meal = {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g: number;
  image_url?: string;
  created_at: string;
  // ... add other fields
};
