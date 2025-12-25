import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "@/components/layout";
import astronautCape from "@assets/Astronaut-cartoon-illustration-vector_1766637602817.png";
import planetsSheet from "@assets/Planets_1766637592592.png";

const data = [
  { name: '5', miles: 2000 },
  { name: '10', miles: 2800 },
  { name: '15', miles: 1800 },
  { name: '20', miles: 2400 },
  { name: '25', miles: 1900 },
  { name: '30', miles: 2600 },
];

export default function Leaderboard() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-6">
        {/* Header */}
        <div className="text-center mb-8">
           <h2 className="text-lg font-bold text-purple-600 flex items-center justify-center gap-2">
             <span className="inline-block w-3 h-3 rotate-45 bg-purple-600" />
             iPhone 16 Pro - 2
           </h2>
        </div>

        {/* Mission & Chart Section */}
        <div className="mb-8 relative">
           <h1 className="text-2xl font-bold font-display uppercase mb-1 tracking-tighter">Mission Number: 1</h1>
           <p className="text-base font-bold mb-4 uppercase tracking-tight">Miles: 60</p>
           
           <div className="h-48 w-full bg-orange-50/50 rounded-2xl mb-4 relative overflow-hidden border border-orange-100">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#e67e22" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af', fontWeight: 'bold'}} />
                 <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                 <Tooltip />
                 <Area type="monotone" dataKey="miles" stroke="#e67e22" strokeWidth={3} fillOpacity={1} fill="url(#colorMiles)" />
               </AreaChart>
             </ResponsiveContainer>
             
             {/* Floating Astronaut */}
             <div className="absolute -right-4 top-2 w-32 h-32">
                <img src={astronautCape} alt="Astronaut" className="w-full h-full object-contain drop-shadow-xl" />
             </div>
           </div>
        </div>

        {/* Mission Stats */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-3 uppercase tracking-tighter">Mission</h3>
          <div className="bg-lime-100/80 rounded-2xl p-4 flex items-center gap-4 border-2 border-lime-300/50 shadow-sm">
             <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
               {/* Slicing Saturn-like planet from the sheet */}
               <div className="w-16 h-16 shrink-0" style={{ backgroundImage: `url(${planetsSheet})`, backgroundSize: '400% 200%', backgroundPosition: '66% 100%' }} />
             </div>
             <div className="font-bold text-sm text-gray-900 uppercase tracking-tight">
               1 Mission | 100mi | 7 Days Streak
             </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-4 uppercase tracking-tighter">Badges</h3>
          <div className="flex justify-between items-center gap-2 no-scrollbar">
            {[
              { name: 'Moon', miles: '100 mi', pos: '66% 0%' },
              { name: 'Mercury', miles: '200 mi', pos: '33% 100%' },
              { name: 'Venus', miles: '300 mi', pos: '0% 0%' },
              { name: 'Jupiter', miles: '400 mi', pos: '100% 0%' },
              { name: 'Uranus', miles: '500 mi', pos: '100% 100%' }
            ].map((planet) => (
              <div key={planet.name} className="flex flex-col items-center gap-1 shrink-0">
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{planet.name}</div>
                 <div className="w-14 h-14 rounded-full shadow-lg border-2 border-white bg-white flex items-center justify-center overflow-hidden">
                    <div className="w-20 h-20 shrink-0" style={{ backgroundImage: `url(${planetsSheet})`, backgroundSize: '400% 200%', backgroundPosition: planet.pos }} />
                 </div>
                 <div className="text-[10px] font-black text-gray-900 mt-1 uppercase tracking-tighter text-center">{planet.miles}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
           <h3 className="font-display font-bold text-lg mb-4 uppercase tracking-tighter">Leaderboard</h3>
           <div className="space-y-3">
             {[
               { name: "NAME", days: 16, pos: '33% 100%' },
               { name: "NAME", days: 6, pos: '66% 0%' },
               { name: "NAME", days: 3, pos: '66% 0%' }
             ].map((user, i) => (
               <div key={i} className="flex items-center justify-between bg-gray-200/60 p-4 rounded-xl">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
                      <div className="w-16 h-16 shrink-0" style={{ backgroundImage: `url(${planetsSheet})`, backgroundSize: '400% 200%', backgroundPosition: user.pos }} />
                   </div>
                   <span className="font-black font-display uppercase tracking-widest text-gray-900">{user.name}</span>
                 </div>
                 <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{user.days} Days</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </Layout>
  );
}
