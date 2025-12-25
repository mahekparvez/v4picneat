import { motion } from "framer-motion";
import Layout from "@/components/layout";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";

export default function Home() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-[17px] font-medium text-gray-500">9:41</div>
          <div className="flex gap-1">
            <div className="w-5 h-5 bg-gray-900 rounded-sm" />
            <div className="w-5 h-5 bg-gray-900 rounded-sm" />
          </div>
        </div>

        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 rounded-3xl p-6 relative overflow-hidden mb-8 h-48"
        >
          <div className="relative z-10 w-2/3">
            <h1 className="text-[27px] font-bold font-display uppercase leading-tight mb-2">
              Make Neil<br />Space Ready
            </h1>
            <p className="text-[17px] font-medium text-gray-600">DAY 1 / 7</p>
          </div>
          <div className="absolute right-[-15px] bottom-[-25px] w-48 h-48 z-0">
             <img src={astronautRocket} alt="Astronaut" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-4 mb-8">
          {/* Calorie Ring */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="aspect-square relative flex items-center justify-center"
          >
             <div className="absolute inset-0 rounded-full border-[6px] border-gray-100" />
             <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
               <circle
                 cx="50"
                 cy="50"
                 r="47"
                 fill="none"
                 stroke="url(#gradient)"
                 strokeWidth="6"
                 strokeDasharray="295"
                 strokeDashoffset="10"
                 strokeLinecap="round"
               />
               <defs>
                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#ff4d4d" />
                   <stop offset="100%" stopColor="#ff9f43" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="text-center z-10">
               <div className="text-[43px] font-bold font-display tracking-tighter">1980</div>
               <div className="text-[15px] text-gray-500 font-medium">/1800</div>
             </div>
          </motion.div>

          {/* Macros Card */}
          <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-gray-200/50 rounded-2xl p-5 flex flex-col justify-center space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-[17px]">PROTEIN</span>
              <span className="text-gray-600 text-[17px] font-mono tracking-tighter">Xg</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="font-bold text-[17px]">CARBS</span>
              <span className="text-gray-600 text-[17px] font-mono tracking-tighter">Yg</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="font-bold text-[17px]">FATS</span>
              <span className="text-gray-600 text-[17px] font-mono tracking-tighter">Zg</span>
            </div>
          </motion.div>
        </div>

        {/* Food List */}
        <div className="space-y-4">
          {[1, 2, 3].map((item, i) => (
            <motion.div 
              key={item}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-gray-200/50 rounded-xl p-3 flex gap-4 items-center"
            >
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0">
                <img 
                  src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop`} 
                  alt="Food" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 uppercase text-sm tracking-tight">food name</h3>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">N Cals</p>
                <div className="flex gap-4 text-xs text-gray-400 font-mono">
                  <span>Xg</span>
                  <span>Yg</span>
                  <span>Zg</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
