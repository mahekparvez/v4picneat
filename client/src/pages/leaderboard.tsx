import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "@/components/layout";
import astronautCape from "@assets/Astronaut-cartoon-illustration-vector_1766601525774.jpg";
import planets from "@assets/Planets_1766601562881.avif";

const data = [
  { name: '5', miles: 2000 },
  { name: '10', miles: 2800 },
  { name: '15', miles: 1800 },
  { name: '20', miles: 2400 },
  { name: '25', miles: 1900 },
  { name: '30', miles: 2600 },
];

const planetData = [
  { name: 'Moon', miles: '100 mi', bg: 'from-blue-200 to-blue-400' },
  { name: 'Mercury', miles: '200 mi', bg: 'from-red-300 to-red-500' },
  { name: 'Venus', miles: '300 mi', bg: 'from-pink-300 to-purple-500' },
  { name: 'Jupiter', miles: '400 mi', bg: 'from-orange-300 to-orange-500' },
  { name: 'Uranus', miles: '500 mi', bg: 'from-cyan-300 to-purple-500' },
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
           <h1 className="text-2xl font-bold font-display uppercase mb-1">Mission Number: 1</h1>
           <p className="text-base font-bold mb-4">Miles: 60</p>
           
           <div className="h-48 w-full bg-orange-50 rounded-2xl mb-4 relative overflow-hidden border border-orange-100">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#e67e22" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} />
                 <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                 <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px' }} />
                 <Area type="monotone" dataKey="miles" stroke="#e67e22" strokeWidth={2} fillOpacity={1} fill="url(#colorMiles)" />
               </AreaChart>
             </ResponsiveContainer>
             
             {/* Floating Astronaut */}
             <div className="absolute -right-6 top-2 w-32 h-32">
                <img src={astronautCape} alt="Astronaut" className="w-full h-full object-contain drop-shadow-lg" />
             </div>
           </div>
        </div>

        {/* Mission Stats */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-3 uppercase">Mission</h3>
          <div className="bg-lime-100 rounded-2xl p-4 flex items-center gap-4 border-2 border-lime-300 shadow-sm">
             <div className="w-12 h-12 text-2xl flex items-center justify-center">
               🪐
             </div>
             <div className="font-medium text-sm text-gray-900">
               1 Mission | 100mi | 7 Days Streak
             </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-4 uppercase">Badges</h3>
          <div className="flex justify-between items-center">
            {planetData.map((planet) => (
              <div key={planet.name} className="flex flex-col items-center gap-2">
                 <div className="text-[10px] font-bold text-gray-700 uppercase">{planet.name}</div>
                 <div className={`w-14 h-14 rounded-full shadow-md border-2 border-white overflow-hidden bg-gradient-to-br ${planet.bg} flex items-center justify-center`}>
                   <span className="text-lg">•</span>
                 </div>
                 <div className="text-[10px] font-bold text-gray-900 text-center leading-tight">{planet.miles}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
           <h3 className="font-display font-bold text-lg mb-4 uppercase">Leaderboard</h3>
           <div className="space-y-3">
             {[
               { name: "NAME", days: 16, color: "bg-red-700" },
               { name: "NAME", days: 6, color: "bg-blue-300" },
               { name: "NAME", days: 3, color: "bg-blue-200" }
             ].map((user, i) => (
               <div key={i} className="flex items-center justify-between bg-gray-200 p-4 rounded-xl">
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full ${user.color} shadow-sm border-2 border-white`} />
                   <span className="font-bold font-display text-gray-900 uppercase tracking-wide">{user.name}</span>
                 </div>
                 <span className="font-bold text-sm text-gray-900">{user.days} Days</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </Layout>
  );
}
