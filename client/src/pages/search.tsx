import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Search, Menu } from "lucide-react";
import searchingAstronaut from "@assets/cute-astronaut-searching-location-moon-cartoon-vector-icon-ill_1766638033225.png";

const CATEGORIES = [
  { name: "Protein", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Carbs", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { name: "Fats", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { name: "Vitamins", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "Minerals", color: "bg-green-100 text-green-700 border-green-200" },
];

const DINING_COURTS = [
  { name: "Wiley Dining Court", distance: "0.2 mi", categories: ["Protein", "Carbs", "Vitamins"] },
  { name: "Earhart Dining Court", distance: "0.5 mi", categories: ["Protein", "Fats", "Minerals"] },
  { name: "Ford Dining Court", distance: "0.8 mi", categories: ["Carbs", "Vitamins", "Minerals"] },
  { name: "Hillenbrand", distance: "1.2 mi", categories: ["Protein", "Carbs", "Fats", "Vitamins", "Minerals"] },
  { name: "Windsor Dining", distance: "1.5 mi", categories: ["Protein", "Minerals"] },
];

export default function SearchPage() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-6 h-full flex flex-col">
        {/* Search Header */}
        <div className="relative mb-6 shrink-0">
          <div className="bg-gray-200/60 rounded-xl h-12 flex items-center px-4 gap-3">
            <Menu className="w-5 h-5 text-gray-500" />
            <span className="text-gray-400 text-xs flex-1 font-bold uppercase tracking-tight">Search Vitamin C, Carbohydrates, Omega 3...</span>
            <Search className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Mascot replaces the old one position */}
        <div className="w-full flex justify-center mb-6 shrink-0">
          <img src={searchingAstronaut} alt="Searching" className="w-48 h-48 object-contain" />
        </div>

        {/* Dining Court List */}
        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-24">
          {DINING_COURTS.map((court, i) => (
            <motion.div 
              key={court.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-200/50 rounded-xl p-5"
            >
              <h3 className="font-bold font-display uppercase text-lg mb-1 tracking-tighter">{court.name}</h3>
              <p className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">{court.distance}</p>
              
              <div className="flex flex-wrap gap-2">
                {court.categories.map(catName => {
                  const cat = CATEGORIES.find(c => c.name === catName);
                  return (
                    <div 
                      key={catName} 
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${cat?.color}`}
                    >
                      {catName}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
