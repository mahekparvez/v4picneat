import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";
import { Trash2, LogOut } from "lucide-react";

export default function Home() {
  const [meals, setMeals] = useState<any[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("logged_meals");
    if (saved) setMeals(JSON.parse(saved));
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.clear();
    window.location.href = "/welcome";
  };

  const deleteMeal = (id: number) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    localStorage.setItem("logged_meals", JSON.stringify(updated));
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  const calorieLimit = parseInt(
    localStorage.getItem("user_target_calories") || "1809",
  );

  return (
    <Layout>
      <div className="px-4 pt-8 pb-24 max-w-md mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-end mb-3 relative z-[100]">
          <a
            href="/welcome"
            onClick={handleLogout}
            data-testid="button-logout"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-tight cursor-pointer px-2 py-1"
          >
            <LogOut size={14} />
            Log Out
          </a>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f0f2f5] rounded-2xl p-5 relative overflow-hidden mb-6 h-40"
        >
          <div className="relative z-10 w-[60%]">
            <h1 className="text-[28px] font-bold font-display uppercase leading-[0.95] mb-2 tracking-tighter text-black">
              Make Neil
              <br />
              Space Ready
            </h1>
            <p className="text-[20px] font-bold text-gray-500 uppercase tracking-tighter">
              DAY 1 / 7
            </p>
          </div>
          <div className="absolute right-[-5px] bottom-[-15px] w-[160px] h-[160px] z-0">
            <img
              src={astronautRocket}
              alt="Astronaut"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-[1fr_1.2fr] gap-4 mb-6">
          {/* Calorie Ring */}
          <div className="aspect-square relative flex items-center justify-center max-w-[140px]">
            <div className="absolute inset-0 rounded-full border-[2px] border-gray-100" />
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
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
                animate={{
                  strokeDashoffset:
                    301.59 -
                    Math.min(totals.calories / calorieLimit, 1) * 301.59,
                }}
                strokeLinecap="round"
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </svg>
            <div className="text-center z-10">
              <div className="text-[36px] font-bold font-display tracking-tighter leading-none">
                {totals.calories}
              </div>
              <div className="text-[14px] text-gray-400 font-bold tracking-tighter mt-0.5">
                /{calorieLimit}
              </div>
            </div>
          </div>

          {/* Macros Card */}
          <div className="bg-[#f0f2f5] rounded-2xl p-4 flex flex-col justify-center space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[16px] tracking-tighter uppercase">
                Protein
              </span>
              <span className="text-gray-500 text-[15px] font-bold tracking-tighter">
                {totals.protein}g
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[16px] tracking-tighter uppercase">
                Carbs
              </span>
              <span className="text-gray-500 text-[15px] font-bold tracking-tighter">
                {totals.carbs}g
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[16px] tracking-tighter uppercase">
                Fats
              </span>
              <span className="text-gray-500 text-[15px] font-bold tracking-tighter">
                {totals.fats}g
              </span>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-3">
          <h3 className="text-[18px] font-bold font-display uppercase tracking-tighter">
            Today's Meals
          </h3>
          <AnimatePresence mode="popLayout">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#f0f2f5] rounded-2xl p-3 flex gap-3 items-center relative group"
                  data-testid={`meal-card-${meal.id}`}
                >
                  <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 uppercase text-[14px] tracking-tight">
                        {meal.name}
                      </h4>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        data-testid={`button-delete-${meal.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">
                      {meal.calories} Cals
                    </p>
                    <div className="flex gap-[3px] text-[12px] text-gray-400 font-bold uppercase mt-0.5 items-center">
                      <span className="flex items-center gap-0.5">
                        <span className="inline-block rotate-[135deg]">🍗</span>{" "}
                        {meal.protein}g
                      </span>
                      <span className="flex items-center gap-0.5">
                        🌾 {meal.carbs}g
                      </span>
                      <span className="flex items-center gap-0.5">
                        🔥 {meal.fats}g
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#f0f2f5] rounded-2xl p-6 text-center border-none"
              >
                <p className="text-[16px] font-bold text-gray-500 uppercase tracking-tighter mb-1">
                  No meals logged yet
                </p>
                <Link
                  href="/camera"
                  className="text-[12px] font-medium text-gray-400"
                >
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
