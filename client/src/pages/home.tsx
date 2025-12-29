import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";
import { Trash2 } from "lucide-react";

export default function Home() {
  const [meals, setMeals] = useState<any[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('logged_meals');
    if (saved) setMeals(JSON.parse(saved));
  }, []);

  const deleteMeal = (id: number) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    localStorage.setItem('logged_meals', JSON.stringify(updated));
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const calorieLimit = 1809;
  const progress = Math.min((totals.calories / calorieLimit) * 360, 360);

  return (
    <Layout>
      <div className="px-6 pt-12 pb-24">
        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f0f2f5] rounded-3xl p-8 relative overflow-hidden mb-8 h-56"
        >
          <div className="relative z-10 w-2/3">
            <h1 className="text-[38px] font-bold font-display uppercase leading-[0.9] mb-4 tracking-tighter text-black">
              Make Neil<br />Space Ready
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
               <motion.circle
                 cx="50"
                 cy="50"
                 r="2"
                 fill="#e67e22"
                 className="origin-center"
                 animate={{ rotate: progress }}
                 transition={{ type: "spring", stiffness: 50 }}
                 style={{ transform: 'rotate(0deg) translate(48px)' }}
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
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{totals.protein}g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Carbs</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{totals.carbs}g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Fats</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">{totals.fats}g</span>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-display uppercase tracking-tighter">Today's Meals</h3>
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
                >
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 uppercase text-sm tracking-tight">{meal.name}</h4>
                      <button 
                        onClick={() => deleteMeal(meal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">{meal.calories} Cals</p>
                    <div className="flex gap-3 text-[12px] text-gray-400 font-bold uppercase mt-1 items-center">
                      <span className="flex items-center gap-1"><span className="rotate-45">🍗</span> {meal.protein}g</span>
                      <span className="flex items-center gap-1">🌾 {meal.carbs}g</span>
                      <span className="flex items-center gap-1">🔥 {meal.fats}g</span>
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
                <p className="text-[20px] font-bold text-gray-500 uppercase tracking-tighter mb-1">No meals logged yet today</p>
                <Link href="/camera" className="text-[15px] font-medium text-gray-400 underline underline-offset-4 decoration-gray-300">
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
