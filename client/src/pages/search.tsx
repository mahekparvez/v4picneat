import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Search, Menu, X } from "lucide-react";
import foodHero from "@assets/Gemini_Generated_Image_pd099ypd099ypd09_1766760815827.png";
import { useState } from "react";

const CATEGORIES = [
  { name: "Protein", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Carbs", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { name: "Fats", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { name: "Vitamins", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "Minerals", color: "bg-green-100 text-green-700 border-green-200" },
];

const DINING_COURTS = [
  { name: "Wiley Dining Court", distance: "0.2 mi", categories: ["Protein", "Carbs", "Vitamins"], details: ["Vitamin C", "B12"] },
  { name: "Earhart Dining Court", distance: "0.5 mi", categories: ["Protein", "Fats", "Minerals"], details: ["Zinc", "Iron"] },
  { name: "Ford Dining Court", distance: "0.8 mi", categories: ["Carbs", "Vitamins", "Minerals"], details: ["Vitamin C", "Magnesium"] },
  { name: "Hillenbrand", distance: "1.2 mi", categories: ["Protein", "Carbs", "Fats", "Vitamins", "Minerals"], details: ["Vitamin C", "Vitamin D", "Fiber"] },
  { name: "Windsor Dining", distance: "1.5 mi", categories: ["Protein", "Minerals"], details: ["Calcium"] },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourts = DINING_COURTS.filter(court => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check if query matches category name (e.g., "Vitamins")
    const matchesCategory = court.categories.some(cat => cat.toLowerCase().includes(query));
    
    // Specific requirement: if typing "Vitamin C", check if Vitamin C is in details AND "Vitamins" is a category
    const isVitaminCSearch = query.includes("vitamin c");
    const hasVitaminsCategory = court.categories.includes("Vitamins");
    const hasVitaminCDetail = court.details?.some(d => d.toLowerCase().includes("vitamin c"));
    
    if (isVitaminCSearch) {
      return hasVitaminsCategory && hasVitaminCDetail;
    }

    return (
      court.name.toLowerCase().includes(query) || 
      matchesCategory ||
      court.details?.some(d => d.toLowerCase().includes(query))
    );
  });

  return (
    <Layout>
      <div className="px-6 pt-12 pb-6 h-full flex flex-col">
        {/* Search Header */}
        <div className="relative mb-6 shrink-0">
          <div className="bg-gray-200/60 rounded-xl h-14 flex items-center px-4 gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Menu className="w-5 h-5 text-gray-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Vitamin C, Carbohydrates..."
              className="bg-transparent border-none focus:ring-0 text-gray-900 text-sm flex-1 font-bold uppercase tracking-tight placeholder:text-gray-400 outline-none"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            ) : (
              <Search className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full rounded-2xl overflow-hidden mb-4 shrink-0 shadow-lg border-2 border-white">
          <img src={foodHero} alt="Food Hero" className="w-full h-auto object-cover" />
        </div>

        {/* Dining Court List */}
        <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pb-24">
          {filteredCourts.length > 0 ? (
            filteredCourts.map((court, i) => (
              <motion.div 
                key={court.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-100 rounded-2xl p-5 border border-gray-200/50 shadow-sm"
              >
                <h3 className="font-bold font-display uppercase text-lg mb-1 tracking-tighter">{court.name}</h3>
                <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-tight">{court.distance}</p>
                
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
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
