import { type UserProfile, type InsertUserProfile, type Meal, type InsertMeal, userProfiles, meals } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User Profile
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Meals
  getMeals(userId: string, date?: Date): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  deleteMeal(id: string, userId: string): Promise<void>;
  
  // Leaderboard
  getLeaderboard(): Promise<Array<{ userId: string; name: string | null; currentStreak: number; totalMiles: number }>>;
}

class DatabaseStorage implements IStorage {
  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profileData: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values({
        ...profileData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          ...profileData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return profile;
  }

  // Meals
  async getMeals(userId: string, date?: Date): Promise<Meal[]> {
    if (date) {
      // Get meals for a specific date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db
        .select()
        .from(meals)
        .where(
          and(
            eq(meals.userId, userId),
            gte(meals.createdAt, startOfDay),
            sql`${meals.createdAt} <= ${endOfDay}`
          )
        )
        .orderBy(desc(meals.createdAt));
    }
    
    // Get all meals for user
    return await db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId))
      .orderBy(desc(meals.createdAt));
  }

  async getMealById(id: string): Promise<Meal | undefined> {
    const [meal] = await db
      .select()
      .from(meals)
      .where(eq(meals.id, id));
    return meal;
  }

  async createMeal(mealData: InsertMeal): Promise<Meal> {
    const [meal] = await db
      .insert(meals)
      .values(mealData)
      .returning();
    return meal;
  }

  async deleteMeal(id: string, userId: string): Promise<void> {
    await db
      .delete(meals)
      .where(
        and(
          eq(meals.id, id),
          eq(meals.userId, userId)
        )
      );
  }

  // Leaderboard
  async getLeaderboard(): Promise<Array<{ userId: string; name: string | null; currentStreak: number; totalMiles: number }>> {
    const results = await db
      .select({
        userId: userProfiles.userId,
        name: userProfiles.name,
        currentStreak: userProfiles.currentStreak,
        totalMiles: userProfiles.totalMiles,
      })
      .from(userProfiles)
      .where(sql`${userProfiles.currentStreak} > 0 OR ${userProfiles.totalMiles} > 0`)
      .orderBy(desc(userProfiles.currentStreak), desc(userProfiles.totalMiles))
      .limit(50);
    
    return results;
  }
}

export const storage = new DatabaseStorage();
