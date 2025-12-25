import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Search, Menu } from "lucide-react";
import astronautMascot from "@assets/Adobe_Express_-_file_1766602010364.png";

export default function SearchPage() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="text-sm font-medium text-gray-500">9:41</div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-900 rounded-sm" />
            <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          </div>
        </div>

        {/* Search Header */}
        <div className="relative mb-6 shrink-0">
          <div className="bg-gray-200/60 rounded-xl h-12 flex items-center px-4 gap-3">
            <Menu className="w-5 h-5 text-gray-500" />
            <span className="text-gray-400 text-sm flex-1 font-medium">Hinted search text</span>
            <Search className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Dining Court List */}
        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-24">
          {[1, 2, 3, 4].map((item, i) => (
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

        {/* Floating Mascot */}
        <div className="fixed bottom-24 right-8 w-28 h-28 z-10 pointer-events-none drop-shadow-2xl">
           <div className="relative w-full h-full">
             <img 
               src={astronautMascot} 
               alt="Astronaut" 
               className="w-full h-full object-contain"
             />
             <div className="absolute top-2 right-2 w-7 h-7 bg-red-600 rounded-full border-[3px] border-white flex items-center justify-center text-xs text-white font-black shadow-lg">
               !
             </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
