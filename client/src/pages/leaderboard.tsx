import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "@/components/layout";
import astronautStanding from "@assets/generated_images/cartoon_astronaut_with_red_cape.png";
import planets from "@assets/generated_images/colorful_cartoon_planets_icons.png";

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
        <div className="text-center mb-6">
           <h2 className="text-lg font-bold text-purple-600 flex items-center justify-center gap-2">
             <span className="inline-block w-3 h-3 rotate-45 bg-purple-600" />
             iPhone 16 Pro - 2
           </h2>
        </div>

        {/* Mission & Chart Section */}
        <div className="mb-8 relative">
           <h1 className="text-xl font-bold font-display uppercase mb-1">Mission Number: 1</h1>
           <p className="text-sm font-bold mb-4">MILES: 60</p>
           
           <div className="h-48 w-full bg-white/50 rounded-xl mb-4 relative">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                 <defs>
                   <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#e67e22" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#95a5a6'}} />
                 <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                 <Tooltip />
                 <Area type="monotone" dataKey="miles" stroke="#e67e22" strokeWidth={2} fillOpacity={1} fill="url(#colorMiles)" />
               </AreaChart>
             </ResponsiveContainer>
             
             {/* Floating Astronaut */}
             <div className="absolute -right-4 top-10 w-24 h-24">
                <img src={astronautStanding} alt="Astronaut" className="w-full h-full object-contain drop-shadow-lg" />
             </div>
           </div>
        </div>

        {/* Mission Stats */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-3 uppercase">Mission</h3>
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-2xl">
               🪐
             </div>
             <div className="font-medium text-sm">
               1 Mission | 100mi | 7 Days Streak
             </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg mb-4 uppercase">Badges</h3>
          <div className="flex justify-between px-2">
            {['Moon', 'Mercury', 'Venus', 'Jupiter', 'Uranus'].map((planet, i) => (
              <div key={planet} className="flex flex-col items-center gap-2">
                 <div className="text-[10px] font-medium text-gray-500 uppercase">{planet}</div>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-white overflow-hidden bg-${['blue', 'red', 'purple', 'orange', 'cyan'][i]}-100`}>
                    <div className={`w-full h-full bg-gradient-to-br from-${['slate', 'red', 'pink', 'amber', 'cyan'][i]}-300 to-${['slate', 'red', 'purple', 'orange', 'blue'][i]}-500 opacity-80`} />
                 </div>
                 <div className="text-[10px] font-bold text-gray-900">{100 * (i + 1)} mi</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
           <h3 className="font-display font-bold text-lg mb-4 uppercase">Leaderboard</h3>
           <div className="space-y-3">
             {[
               { name: "NAME", days: 16, color: "bg-red-800" },
               { name: "NAME", days: 6, color: "bg-blue-300" },
               { name: "NAME", days: 3, color: "bg-blue-200" }
             ].map((user, i) => (
               <div key={i} className="flex items-center justify-between bg-gray-200/50 p-3 rounded-xl">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full ${user.color} shadow-sm border-2 border-white`} />
                   <span className="font-medium font-display uppercase">{user.name}</span>
                 </div>
                 <span className="font-medium text-sm">{user.days} Days</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </Layout>
  );
}
