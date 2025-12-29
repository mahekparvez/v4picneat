import { motion } from "framer-motion";
import Layout from "@/components/layout";
import astronautRocket from "@assets/Adobe_Express_-_file_1766602010364.png";

export default function Home() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-6">
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
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="aspect-square relative flex items-center justify-center"
          >
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
               <circle
                 cx="50"
                 cy="50"
                 r="2"
                 fill="#e67e22"
                 className="origin-center"
                 style={{ transform: 'rotate(0deg) translate(48px)' }}
               />
             </svg>
             <div className="text-center z-10">
               <div className="text-[52px] font-bold font-display tracking-tighter leading-none">0</div>
               <div className="text-[18px] text-gray-400 font-bold tracking-tighter mt-1">/1809</div>
             </div>
          </motion.div>

          {/* Macros Card */}
          <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-[#f0f2f5] rounded-3xl p-6 flex flex-col justify-center space-y-5"
          >
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Protein</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">0g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Carbs</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">0g</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="font-bold text-[22px] tracking-tighter uppercase">Fats</span>
              <span className="text-gray-500 text-[20px] font-bold tracking-tighter">0g</span>
            </div>
          </motion.div>
        </div>

        {/* Empty State */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#f0f2f5] rounded-3xl p-10 text-center border-none"
        >
          <p className="text-[20px] font-bold text-gray-500 uppercase tracking-tighter mb-1">No meals logged yet today</p>
          <p className="text-[15px] font-medium text-gray-400">Go to Camera to add your first meal!</p>
        </motion.div>
      </div>
    </Layout>
  );
}
