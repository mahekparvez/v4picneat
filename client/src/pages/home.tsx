import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";
import { Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Meal } from "@shared/schema";

async function fetchMeals(): Promise<Meal[]> {
  const response = await fetch("/api/meals?date=" + new Date().toISOString(), {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch meals");
  }
  
  return response.json();
}

async function deleteMeal(id: string): Promise<void> {
  const response = await fetch(`/api/meals/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete meal");
  }
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: meals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ["/api/meals"],
    queryFn: fetchMeals,
    enabled: !!user,
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.proteinG,
    carbs: acc.carbs + meal.carbsG,
    fats: acc.fats + meal.fatsG,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const calorieLimit = 1809;

  if (authLoading || mealsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-6 pt-12 pb-24 max-w-md mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleLogout}
            data-testid="button-logout"
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-tight"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>

        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f0f2f5] rounded-3xl p-8 relative overflow-hidden mb-8 h-56"
        >
          <div className="relative z-10 w-2/3 -ml-[27px]">
            <h1 className="text-[38px] font-bold font-display uppercase leading-[0.9] mb-4 tracking-tighter text-black">
              Make {user?.firstName || 'You'}<br />Space Ready
            </h1>
            <p className="text-[28px] font-bold text-gray-500 uppercase tracking-tighter">DAY 1 / 7</p>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] w-[240px] h-[240px] z-0">
             <img src={astronautRocket} alt="Astronaut" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-[1fr_1.1fr] gap-6 mb-8">
          {/* Calorie Ring */}
          <div className="aspect-square relative flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-[2px] border-gray-100" />
             <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
               <circle
                 cx="50"
                 cy="50"
                 r="48"
                 fill="none"
                 stroke="#f0f2f5"
                 strokeWidth="2"
               />
               <motion.circle
                 cx="50"
                 cy="50"
                 r="48"
                 fill="none"
                 stroke="#e67e22"
                 strokeWidth="4"
                 strokeDasharray="301.59"
                 initial={{ strokeDashoffset: 301.59 }}
                 animate={{ strokeDashoffset: 301.59 - (Math.min(totals.calories / calorieLimit, 1) * 301.59) }}
                 strokeLinecap="round"
                 transition={{ type: "spring", stiffness: 50, damping: 20 }}
               />
             </svg>
             <div className="text-center z-10">
               <div className="text-[52px] font-bold font-display tracking-tighter leading-none">{totals.calories}</div>
               <div className="text-[18px] text-gray-400 font-bold tracking-tighter mt-1">/{calorieLimit}</div>
             </div>
          </div>

          {/* Macros Card */}
          <div className="bg-[#f0f2f5] rounded-3xl p-6 flex flex-col justify-center space-y-5">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Protein</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{Math.round(totals.protein)}g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Carbs</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{Math.round(totals.carbs)}g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Fats</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{Math.round(totals.fats)}g</span>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h3 className="text-[23px] font-bold font-display uppercase tracking-tighter">Today's Meals</h3>
          <AnimatePresence mode="popLayout">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <motion.div 
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#f0f2f5] rounded-2xl p-4 flex gap-4 items-center relative group"
                  data-testid={`meal-card-${meal.id}`}
                >
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    {meal.imageUrl ? (
                      <img src={meal.imageUrl} alt={meal.foodName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 uppercase text-[16px] tracking-tight" data-testid={`meal-name-${meal.id}`}>{meal.foodName}</h4>
                      <button 
                        onClick={() => deleteMealMutation.mutate(meal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        data-testid={`button-delete-${meal.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[14px] font-bold text-gray-500 uppercase tracking-tight" data-testid={`meal-calories-${meal.id}`}>{meal.calories} Cals</p>
                    <div className="flex gap-3 text-[14px] text-gray-400 font-bold uppercase mt-1 items-center">
                      <span className="flex items-center gap-1"><span className="rotate-45">🍗</span> {Math.round(meal.proteinG)}g</span>
                      <span className="flex items-center gap-1">🌾 {Math.round(meal.carbsG)}g</span>
                      <span className="flex items-center gap-1">🔥 {Math.round(meal.fatsG)}g</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#f0f2f5] rounded-3xl p-10 text-center border-none"
              >
                <p className="text-[22px] font-bold text-gray-500 uppercase tracking-tighter mb-1">No meals logged yet today</p>
                <Link href="/camera" className="text-[17px] font-medium text-gray-400 underline underline-offset-4 decoration-gray-300">
                  Go to Camera to add your first meal!
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
