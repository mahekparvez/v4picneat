import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock Supabase client for prototyping without keys
const createMockClient = () => {
  console.log("⚠️ Using Mock Supabase Client (No API keys found)");
  
  return {
    auth: {
      signInWithPassword: async ({ email, password }: any) => {
        console.log("Mock Login:", email);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (password === "error") {
          return { data: { user: null }, error: { message: "Invalid credentials" } };
        }
        
        return { 
          data: { 
            user: { id: "mock-user-123", email } 
          }, 
          error: null 
        };
      },
      signUp: async ({ email, password }: any) => {
        console.log("Mock Signup:", email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          data: { 
            user: { id: "mock-user-123", email } 
          }, 
          error: null 
        };
      },
      getSession: async () => {
        // Return a mock session to allow protected routes to load
        return { 
          data: { 
            session: { user: { id: "mock-user-123" } } 
          }, 
          error: null 
        };
      },
      signOut: async () => {
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: {}, error: null }),
          data: [],
          error: null
        }),
        order: () => ({ data: [], error: null }),
        data: [],
        error: null
      }),
      insert: async (data: any) => {
        console.log(`Mock DB Insert [${table}]:`, data);
        return { error: null };
      }
    })
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Database types
export type User = {
  id: string;
  email: string;
  name: string;
  gender?: string;
  date_of_birth?: string;
  daily_calorie_goal: number;
  current_streak: number;
  total_miles: number;
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
};
