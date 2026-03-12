import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";
import {
  Trash2, LogOut, ChevronRight, X, Minus, Plus, Check,
  ChevronLeft, QrCode, PenLine,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoodItem {
  name: string;
  portion_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface LoggedMeal {
  id: number;
  image: string | null;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods?: FoodItem[];
  timestamp: string;
}

interface EditItem {
  name: string;
  currentGrams: number;
  perGramCalories: number;
  perGramProtein: number;
  perGramCarbs: number;
  perGramFats: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function foodEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('chicken')) return '🍗';
  if (n.includes('beef') || n.includes('steak') || n.includes('burger')) return '🥩';
  if (n.includes('fish') || n.includes('salmon') || n.includes('shrimp')) return '🐟';
  if (n.includes('egg')) return '🥚';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('pasta') || n.includes('spaghetti') || n.includes('noodle')) return '🍝';
  if (n.includes('rice')) return '🍚';
  if (n.includes('salad') || n.includes('vegetable') || n.includes('broccoli')) return '🥗';
  if (n.includes('sandwich') || n.includes('wrap') || n.includes('taco') || n.includes('burrito')) return '🌯';
  if (n.includes('soup') || n.includes('chili')) return '🍜';
  if (n.includes('pancake') || n.includes('waffle') || n.includes('toast')) return '🥞';
  if (n.includes('fruit') || n.includes('apple') || n.includes('banana')) return '🍎';
  if (n.includes('yogurt') || n.includes('milk') || n.includes('cheese')) return '🥛';
  if (n.includes('fries') || n.includes('potato')) return '🍟';
  return '🍽️';
}

/** localStorage key for a given date */
function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `logged_meals_${y}-${m}-${d}`;
}

function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function mealToEditItems(meal: LoggedMeal): EditItem[] {
  const foods: FoodItem[] = meal.foods && meal.foods.length > 0
    ? meal.foods
    : [{ name: meal.name, portion_grams: 100, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fats: meal.fats }];

  return foods.map(f => {
    const g = f.portion_grams > 0 ? f.portion_grams : 100;
    return {
      name: f.name,
      currentGrams: g,
      perGramCalories: f.calories / g,
      perGramProtein: f.protein / g,
      perGramCarbs: f.carbs / g,
      perGramFats: f.fats / g,
    };
  });
}

function computeItem(item: EditItem) {
  const g = Math.max(item.currentGrams, 1);
  return {
    calories: Math.round(item.perGramCalories * g),
    protein: Math.round(item.perGramProtein * g * 10) / 10,
    carbs: Math.round(item.perGramCarbs * g * 10) / 10,
    fats: Math.round(item.perGramFats * g * 10) / 10,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [, setLocation] = useLocation();

  // Edit sheet state
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [editItems, setEditItems] = useState<EditItem[]>([]);
  const [gramInputs, setGramInputs] = useState<string[]>([]);

  // Add meal sheet state
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addTab, setAddTab] = useState<'manual' | 'qr'>('manual');
  const [manualForm, setManualForm] = useState({
    name: '', calories: '', protein: '', carbs: '', fats: '',
  });

  // Load meals when date changes
  useEffect(() => {
    const key = dateKey(viewDate);
    const saved = localStorage.getItem(key);
    // Backward-compat: if viewing today and no date-key found, check legacy key
    if (!saved && isToday(viewDate)) {
      const legacy = localStorage.getItem('logged_meals');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        setMeals(parsed);
        // Migrate to date-keyed storage
        localStorage.setItem(key, legacy);
        localStorage.removeItem('logged_meals');
        return;
      }
    }
    setMeals(saved ? JSON.parse(saved) : []);
  }, [viewDate]);

  const saveMeals = (updated: LoggedMeal[]) => {
    setMeals(updated);
    localStorage.setItem(dateKey(viewDate), JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    setLocation("/welcome");
  };

  const deleteMeal = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = meals.filter(m => m.id !== id);
    saveMeals(updated);
    if (editingMealId === id) setEditingMealId(null);
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: Math.round((acc.protein + meal.protein) * 10) / 10,
    carbs: Math.round((acc.carbs + meal.carbs) * 10) / 10,
    fats: Math.round((acc.fats + meal.fats) * 10) / 10,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const calorieLimit = parseInt(localStorage.getItem('user_target_calories') || '1809');

  // ── Date navigation ─────────────────────────────────────────────────────────

  const goBack = () => {
    setViewDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const goForward = () => {
    if (!isToday(viewDate)) {
      setViewDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 1);
        return d;
      });
    }
  };

  // ── Edit sheet logic ────────────────────────────────────────────────────────

  const openEdit = (meal: LoggedMeal) => {
    const items = mealToEditItems(meal);
    setEditItems(items);
    setGramInputs(items.map(i => String(i.currentGrams)));
    setEditingMealId(meal.id);
  };

  const closeEdit = () => setEditingMealId(null);

  const editingMeal = meals.find(m => m.id === editingMealId) ?? null;

  const setGrams = (index: number, grams: number) => {
    setEditItems(prev => prev.map((item, i) =>
      i === index ? { ...item, currentGrams: Math.max(5, grams) } : item
    ));
  };

  const handleGramInput = (index: number, raw: string) => {
    setGramInputs(prev => prev.map((v, i) => i === index ? raw : v));
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n > 0) setGrams(index, n);
  };

  const handleGramBlur = (index: number) => {
    setGramInputs(prev => prev.map((v, i) =>
      i === index ? String(editItems[i].currentGrams) : v
    ));
  };

  const step = (index: number, delta: number) => {
    const next = Math.max(5, editItems[index].currentGrams + delta);
    setGrams(index, next);
    setGramInputs(prev => prev.map((v, i) => i === index ? String(next) : v));
  };

  const computedItems = editItems.map(item => ({ ...item, ...computeItem(item) }));

  const editTotals = computedItems.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: Math.round((acc.protein + item.protein) * 10) / 10,
    carbs: Math.round((acc.carbs + item.carbs) * 10) / 10,
    fats: Math.round((acc.fats + item.fats) * 10) / 10,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const saveEdit = () => {
    if (!editingMeal) return;
    const updatedMeal: LoggedMeal = {
      ...editingMeal,
      calories: editTotals.calories,
      protein: editTotals.protein,
      carbs: editTotals.carbs,
      fats: editTotals.fats,
      foods: computedItems.map(item => ({
        name: item.name,
        portion_grams: item.currentGrams,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
      })),
    };
    const updated = meals.map(m => m.id === editingMealId ? updatedMeal : m);
    saveMeals(updated);
    closeEdit();
  };

  // ── Add meal logic ──────────────────────────────────────────────────────────

  const addManualMeal = () => {
    const cal = parseInt(manualForm.calories) || 0;
    const p = parseFloat(manualForm.protein) || 0;
    const c = parseFloat(manualForm.carbs) || 0;
    const f = parseFloat(manualForm.fats) || 0;
    if (!manualForm.name.trim() || cal <= 0) return;

    const newMeal: LoggedMeal = {
      id: Date.now(),
      image: null,
      name: manualForm.name.trim(),
      calories: cal,
      protein: p,
      carbs: c,
      fats: f,
      timestamp: viewDate.toISOString(),
    };

    saveMeals([...meals, newMeal]);
    setManualForm({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    setShowAddSheet(false);
  };

  return (
    <Layout>
      <div className="px-6 pt-12 pb-24 max-w-md mx-auto">
        {/* Header */}
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
          className="bg-[#f0f2f5] rounded-3xl p-8 relative overflow-hidden mb-6 h-56"
        >
          <div className="relative z-10 w-2/3 -ml-[27px]">
            <h1 className="text-[38px] font-bold font-display uppercase leading-[0.9] mb-4 tracking-tighter text-black">
              Make Neil<br />Space Ready
            </h1>
            <p className="text-[28px] font-bold text-gray-500 uppercase tracking-tighter">DAY 1 / 7</p>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] w-[240px] h-[240px] z-0">
            <img src={astronautRocket} alt="Astronaut" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* ── Date Navigator ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-[#f0f2f5] rounded-2xl px-4 py-3 mb-6">
          <button
            onClick={goBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-gray-900 active:scale-90 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <motion.div
            key={viewDate.toDateString()}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="font-black uppercase tracking-tight text-[16px] text-gray-900">
              {formatDateLabel(viewDate)}
            </p>
            {!isToday(viewDate) && (
              <p className="text-[11px] text-gray-400 font-semibold">
                {viewDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </motion.div>

          <button
            onClick={goForward}
            disabled={isToday(viewDate)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-gray-900 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-[1fr_1.1fr] gap-6 mb-8">
          {/* Calorie Ring */}
          <div className="aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[2px] border-gray-100" />
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#f0f2f5" strokeWidth="2" />
              <motion.circle
                cx="50" cy="50" r="48" fill="none" stroke="#e67e22" strokeWidth="4"
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
          <div className="bg-[#f0f2f5] rounded-2xl p-5 flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[17px] text-gray-800 tracking-tight">PROTEIN</span>
              <span className="text-gray-400 text-[17px] font-semibold">{totals.protein}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[17px] text-gray-800 tracking-tight">CARBS</span>
              <span className="text-gray-400 text-[17px] font-semibold">{totals.carbs}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[17px] text-gray-800 tracking-tight">FATS</span>
              <span className="text-gray-400 text-[17px] font-semibold">{totals.fats}g</span>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h3 className="text-[23px] font-bold font-display uppercase tracking-tighter">
            {isToday(viewDate) ? "Today's Meals" : `${formatDateLabel(viewDate)}'s Meals`}
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
                  onClick={() => openEdit(meal)}
                  className="bg-[#f0f2f5] rounded-2xl p-4 flex gap-4 items-center relative cursor-pointer active:scale-[0.98] transition-transform"
                  data-testid={`meal-card-${meal.id}`}
                >
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    {meal.image
                      ? <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">{foodEmoji(meal.name)}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-gray-900 uppercase text-[16px] tracking-tight truncate">{meal.name}</h4>
                      <button
                        onClick={(e) => deleteMeal(e, meal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        data-testid={`button-delete-${meal.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[14px] font-bold text-gray-500 uppercase tracking-tight">{meal.calories} Cals</p>
                    <div className="flex gap-3 text-[13px] text-gray-400 font-semibold uppercase mt-1 items-center">
                      <span>P {meal.protein}g</span>
                      <span>C {meal.carbs}g</span>
                      <span>F {meal.fats}g</span>
                      {meal.foods && meal.foods.length > 1 && (
                        <span className="ml-auto text-[11px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                          {meal.foods.length} items
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#f0f2f5] rounded-3xl p-10 text-center"
              >
                <p className="text-[22px] font-bold text-gray-500 uppercase tracking-tighter mb-1">
                  No meals logged {isToday(viewDate) ? 'today' : 'this day'}
                </p>
                {isToday(viewDate) && (
                  <Link href="/camera" className="text-[17px] font-medium text-gray-400 underline underline-offset-4 decoration-gray-300">
                    Tap + or go to Camera to add a meal!
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Floating Action Button ─────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 22 }}
        onClick={() => { setAddTab('manual'); setShowAddSheet(true); }}
        className="fixed bottom-24 right-6 z-30 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Add meal"
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      {/* ── Add Meal Sheet ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              key="add-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSheet(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              key="add-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 shrink-0">
                <h2 className="font-black uppercase tracking-tight text-[20px] text-gray-900">Add Meal</h2>
                <button onClick={() => setShowAddSheet(false)} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-3 px-5 pb-4 shrink-0">
                {(['manual', 'qr'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAddTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[14px] uppercase tracking-tight transition-all ${
                      addTab === tab
                        ? 'bg-gray-900 text-white'
                        : 'bg-[#f0f2f5] text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {tab === 'manual' ? <PenLine size={16} /> : <QrCode size={16} />}
                    {tab === 'manual' ? 'Manual Entry' : 'Scan QR'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="overflow-y-auto flex-1 px-5 pb-6">
                <AnimatePresence mode="wait">
                  {addTab === 'manual' ? (
                    <motion.div
                      key="manual"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Meal Name */}
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                          Meal Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Grilled Chicken & Rice"
                          value={manualForm.name}
                          onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full bg-[#f0f2f5] rounded-2xl px-4 py-3.5 font-semibold text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        />
                      </div>

                      {/* Calories */}
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                          Calories *
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 450"
                          value={manualForm.calories}
                          onChange={e => setManualForm(f => ({ ...f, calories: e.target.value }))}
                          className="w-full bg-[#f0f2f5] rounded-2xl px-4 py-3.5 font-semibold text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* Macros row */}
                      <div className="grid grid-cols-3 gap-3">
                        {(['protein', 'carbs', 'fats'] as const).map(macro => (
                          <div key={macro}>
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                              {macro} (g)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={manualForm[macro]}
                              onChange={e => setManualForm(f => ({ ...f, [macro]: e.target.value }))}
                              className="w-full bg-[#f0f2f5] rounded-2xl px-3 py-3.5 font-semibold text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Preview row */}
                      {(parseInt(manualForm.calories) > 0 || manualForm.name) && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-orange-50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-orange-100"
                        >
                          <span className="text-2xl">{foodEmoji(manualForm.name || 'meal')}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 uppercase text-[14px] tracking-tight truncate">
                              {manualForm.name || 'Your Meal'}
                            </p>
                            <p className="text-[12px] text-orange-500 font-bold">
                              {parseInt(manualForm.calories) || 0} kcal
                              {parseFloat(manualForm.protein) > 0 && ` · P ${manualForm.protein}g`}
                              {parseFloat(manualForm.carbs) > 0 && ` · C ${manualForm.carbs}g`}
                              {parseFloat(manualForm.fats) > 0 && ` · F ${manualForm.fats}g`}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Log button */}
                      <button
                        onClick={addManualMeal}
                        disabled={!manualForm.name.trim() || !parseInt(manualForm.calories)}
                        className="w-full py-4 bg-gray-900 text-white font-bold text-[15px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Check size={18} />
                        Log Meal
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center py-8 gap-6"
                    >
                      {/* QR Viewfinder */}
                      <div className="relative w-56 h-56 bg-[#f0f2f5] rounded-3xl overflow-hidden flex items-center justify-center">
                        {/* Corner brackets */}
                        {[
                          'top-3 left-3 border-t-4 border-l-4',
                          'top-3 right-3 border-t-4 border-r-4',
                          'bottom-3 left-3 border-b-4 border-l-4',
                          'bottom-3 right-3 border-b-4 border-r-4',
                        ].map((cls, i) => (
                          <div key={i} className={`absolute w-8 h-8 rounded-sm border-gray-900 ${cls}`} />
                        ))}
                        <div className="text-center">
                          <QrCode size={56} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-[13px] font-semibold text-gray-400">Point at a QR code</p>
                        </div>
                      </div>

                      <div className="text-center max-w-[260px]">
                        <p className="font-black uppercase tracking-tight text-[17px] text-gray-900 mb-1">
                          Scan Dining Hall QR
                        </p>
                        <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                          Scan QR codes at Purdue dining courts to instantly log your meal with accurate nutrition info.
                        </p>
                      </div>

                      <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 w-full max-w-[280px]">
                        <p className="text-[12px] font-bold text-orange-500 uppercase tracking-tight text-center">
                          🚧 Camera integration coming soon
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Edit Sheet ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingMeal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEdit}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {editingMeal.image
                    ? <img src={editingMeal.image} alt={editingMeal.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">{foodEmoji(editingMeal.name)}</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 uppercase tracking-tight text-[17px] truncate">{editingMeal.name}</h2>
                  <p className="text-[13px] text-gray-400 font-semibold">
                    {editItems.length} item{editItems.length !== 1 ? 's' : ''} detected
                  </p>
                </div>
                <button onClick={closeEdit} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Food Items — scrollable */}
              <div className="overflow-y-auto flex-1 px-5 py-3 space-y-1">
                {computedItems.map((item, i) => (
                  <div key={i} className="py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{foodEmoji(item.name)}</span>
                        <span className="font-bold text-gray-900 text-[15px] uppercase tracking-tight truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-orange-500 text-[15px] shrink-0 ml-2">{item.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 text-[12px] text-gray-400 font-semibold uppercase mb-3 pl-8">
                      <span>P {item.protein}g</span>
                      <span>C {item.carbs}g</span>
                      <span>F {item.fats}g</span>
                    </div>
                    <div className="flex items-center gap-3 pl-8">
                      <button
                        onClick={() => step(i, -10)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-90 transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="flex items-center bg-gray-100 rounded-xl px-3 py-1.5 gap-1">
                        <input
                          type="number"
                          value={gramInputs[i] ?? String(item.currentGrams)}
                          onChange={e => handleGramInput(i, e.target.value)}
                          onBlur={() => handleGramBlur(i)}
                          className="w-12 bg-transparent text-center font-bold text-gray-900 text-[15px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min={5}
                        />
                        <span className="text-[13px] font-semibold text-gray-400">g</span>
                      </div>
                      <button
                        onClick={() => step(i, 10)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-90 transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals + Save */}
              <div className="shrink-0 px-5 pt-3 pb-6 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 text-[15px] uppercase tracking-tight">Total</span>
                  <span className="font-bold text-[22px] text-orange-500 tracking-tight">{editTotals.calories} kcal</span>
                </div>
                <div className="flex gap-4 text-[13px] text-gray-400 font-semibold uppercase mb-4">
                  <span>P {editTotals.protein}g</span>
                  <span>C {editTotals.carbs}g</span>
                  <span>F {editTotals.fats}g</span>
                </div>
                <button
                  onClick={saveEdit}
                  className="w-full py-4 bg-gray-900 text-white font-bold text-[15px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Check size={18} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
