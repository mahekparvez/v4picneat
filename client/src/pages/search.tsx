import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Search, Menu } from "lucide-react";
import searchingAstronaut from "@assets/cute-astronaut-searching-location-moon-cartoon-vector-icon-ill_1766638033225.png";

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
          {[1, 2, 3, 4, 5].map((item, i) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-200/50 rounded-xl p-5"
            >
              <h3 className="font-bold font-display uppercase text-lg mb-1 tracking-tighter">Dining Court</h3>
              <p className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-tight">Distance</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Protein, Carbs, Fats, Others</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
