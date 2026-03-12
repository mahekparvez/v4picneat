import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis, ReferenceLine, Dot,
} from "recharts";
import Layout from "@/components/layout";
import { RefreshCw, Flame, Trophy, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import astronautCape from "@assets/Astronaut-cartoon-illustration-vector_1766637602817.png";
import planetsRow from "@assets/image_1766761255761.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaderEntry {
  userId: string;
  name: string | null;
  currentStreak: number;
  totalMiles: number;
}

interface DayData {
  day: string;
  date: string;
  calories: number;
  hasData: boolean;
  dateKey: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `logged_meals_${y}-${m}-${dd}`;
}

function getLast7Days(): DayData[] {
  const result: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = makeDateKey(d);
    const saved = localStorage.getItem(key);
    const meals: any[] = saved ? JSON.parse(saved) : [];
    const calories = meals.reduce((s, m) => s + (m.calories || 0), 0);
    result.push({
      day: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories,
      hasData: meals.length > 0,
      dateKey: key,
    });
  }
  return result;
}

function computeStreak(): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const saved = localStorage.getItem(makeDateKey(d));
    const meals: any[] = saved ? JSON.parse(saved) : [];
    if (meals.length === 0) break;
    streak++;
  }
  return streak;
}

function totalMilesFromStreak(streak: number): number {
  return streak * 10;
}

const PLANETS = [
  { name: 'Moon',    miles: 100, pos: '0%'   },
  { name: 'Mercury', miles: 200, pos: '25%'  },
  { name: 'Venus',   miles: 300, pos: '50%'  },
  { name: 'Jupiter', miles: 400, pos: '75%'  },
  { name: 'Uranus',  miles: 500, pos: '100%' },
];

function getInitials(name: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-orange-400', 'bg-blue-400', 'bg-purple-400',
  'bg-green-400', 'bg-pink-400', 'bg-yellow-400',
];

// ─── Custom Chart Cursor ───────────────────────────────────────────────────────

const ChartCursor = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      <line x1={cx} y1={0} x2={cx} y2={cy - 28} stroke="#e67e22" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
      <image href={astronautCape} x={cx - 18} y={cy - 48} width="36" height="36" />
    </g>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Leaderboard() {
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [activeDay, setActiveDay] = useState<DayData | null>(null);
  const [streak, setStreak] = useState(0);
  const [miles, setMiles] = useState(0);
  const [userName, setUserName] = useState<string>('You');
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [loadingLead, setLoadingLead] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const calorieGoal = parseInt(localStorage.getItem('user_target_calories') || '1809');

  // Load local data
  useEffect(() => {
    const data = getLast7Days();
    setChartData(data);
    setActiveDay(data[data.length - 1]);

    const s = computeStreak();
    setStreak(s);
    setMiles(totalMilesFromStreak(s));

    const stored = localStorage.getItem('user_name') || localStorage.getItem('userName');
    if (stored) setUserName(stored);
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    setLoadingLead(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data: LeaderEntry[] = await res.json();
        setLeaderboard(data);
      }
    } catch {
      // keep empty
    } finally {
      setLoadingLead(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30_000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // Current planet progress
  const nextPlanet = PLANETS.find(p => p.miles > miles);
  const prevPlanet = PLANETS.filter(p => p.miles <= miles).at(-1) ?? { miles: 0 };
  const progressPct = nextPlanet
    ? ((miles - prevPlanet.miles) / (nextPlanet.miles - prevPlanet.miles)) * 100
    : 100;

  // Build display leaderboard — inject current user if not present
  const displayBoard: LeaderEntry[] = leaderboard.length > 0
    ? leaderboard
    : [
        { userId: 'me', name: userName, currentStreak: streak, totalMiles: miles },
      ];

  const top3 = displayBoard.slice(0, 3);
  const rest = displayBoard.slice(3);

  return (
    <Layout>
      <div className="px-6 pt-12 pb-24 max-w-md mx-auto space-y-6">

        {/* ── Mission Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Mission Control</p>
            <h1 className="text-[34px] font-bold font-display uppercase leading-none tracking-tighter text-gray-900">
              Lead<br />Board
            </h1>
          </div>
          <button
            onClick={fetchLeaderboard}
            className="p-2.5 bg-[#f0f2f5] rounded-xl text-gray-500 hover:text-gray-900 transition-colors active:scale-90"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw size={18} className={loadingLead ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ── Your Stats Card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Your Mission</p>
              <p className="text-[22px] font-black uppercase tracking-tight">{userName}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1.5 rounded-full">
              <Flame size={16} className="text-orange-400" />
              <span className="font-black text-orange-400 text-[15px]">{streak} day streak</span>
            </div>
          </div>

          {/* Miles progress */}
          <div className="mb-2 flex justify-between items-center">
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">
              {miles} miles
            </span>
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">
              {nextPlanet ? `→ ${nextPlanet.name} at ${nextPlanet.miles}mi` : '🏆 All planets reached!'}
            </span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-orange-500 rounded-full"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-semibold">
            10 miles earned per day with logged meals
          </p>
        </motion.div>

        {/* ── 7-Day Calorie Chart ────────────────────────────────────────── */}
        <div className="bg-[#f0f2f5] rounded-3xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black uppercase tracking-tight text-[18px] text-gray-900">7-Day History</h2>
            {activeDay && (
              <motion.div
                key={activeDay.day}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-right"
              >
                <p className="text-[12px] font-bold text-gray-400 uppercase">{activeDay.date}</p>
                <p className="text-[18px] font-black text-orange-500 leading-none">
                  {activeDay.calories} <span className="text-[12px] text-gray-400">kcal</span>
                </p>
              </motion.div>
            )}
          </div>

          <div className="h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 40, right: 8, left: -24, bottom: 0 }}
                onMouseMove={(e: any) => {
                  if (e?.activePayload?.[0]) {
                    setActiveDay(e.activePayload[0].payload);
                  }
                }}
                onClick={(e: any) => {
                  if (e?.activePayload?.[0]) {
                    setActiveDay(e.activePayload[0].payload);
                  }
                }}
              >
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e67e22" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: '700' }}
                />
                <YAxis hide domain={[0, Math.max(calorieGoal * 1.3, 500)]} />
                <ReferenceLine
                  y={calorieGoal}
                  stroke="#e67e22"
                  strokeDasharray="4 3"
                  strokeOpacity={0.5}
                  label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#e67e22', fontWeight: 700 }}
                />
                <Tooltip content={() => null} cursor={<ChartCursor />} />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#e67e22"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#calGrad)"
                  activeDot={(props: any) => (
                    <Dot {...props} r={6} fill="#e67e22" stroke="#fff" strokeWidth={2} />
                  )}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!payload.hasData) return <circle key={cx} cx={cx} cy={cy} r={3} fill="#d1d5db" />;
                    return <circle key={cx} cx={cx} cy={cy} r={3} fill="#e67e22" />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Streak dots */}
          <div className="flex justify-between mt-3 px-1">
            {chartData.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(d)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                  d.hasData
                    ? activeDay?.day === d.day
                      ? 'bg-orange-500 scale-125'
                      : 'bg-orange-300'
                    : 'bg-gray-200'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Edit Previous Days Hint ─────────────────────────────────────── */}
        <Link href="/">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 cursor-pointer"
          >
            <span className="text-xl">📅</span>
            <div className="flex-1">
              <p className="font-black text-[14px] text-blue-700 uppercase tracking-tight">Edit Previous Days</p>
              <p className="text-[12px] text-blue-400 font-medium">Go to EAT tab → use ‹ › arrows to navigate dates</p>
            </div>
            <ChevronRight size={16} className="text-blue-400" />
          </motion.div>
        </Link>

        {/* ── Planet Badges ──────────────────────────────────────────────── */}
        <div>
          <h2 className="font-black uppercase tracking-tight text-[18px] text-gray-900 mb-4">Badges</h2>
          <div className="flex justify-between items-center gap-2">
            {PLANETS.map((planet) => {
              const unlocked = miles >= planet.miles;
              return (
                <div key={planet.name} className="flex flex-col items-center gap-1 flex-1">
                  <p className={`text-[10px] font-black uppercase tracking-tight text-center ${unlocked ? 'text-gray-700' : 'text-gray-300'}`}>
                    {planet.name}
                  </p>
                  <div className={`w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center overflow-hidden transition-all ${
                    unlocked ? 'border-orange-300 shadow-lg shadow-orange-100' : 'border-gray-100 grayscale opacity-40'
                  }`}>
                    <div
                      className="w-14 h-14 shrink-0 rounded-full scale-[1.3]"
                      style={{
                        backgroundImage: `url(${planetsRow})`,
                        backgroundSize: '500% 100%',
                        backgroundPosition: planet.pos,
                      }}
                    />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-tight text-center ${unlocked ? 'text-orange-500' : 'text-gray-300'}`}>
                    {planet.miles}mi
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Live Leaderboard ───────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black uppercase tracking-tight text-[18px] text-gray-900">Live Rankings</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loadingLead && leaderboard.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-8"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-orange-300 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                {/* Podium — Top 3 */}
                {top3.length > 0 && (
                  <div className="flex items-end justify-center gap-3 mb-6 pt-4">
                    {/* 2nd place */}
                    {top3[1] ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[16px] ${AVATAR_COLORS[1]}`}>
                          {getInitials(top3[1].name)}
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-gray-700 max-w-[60px] text-center truncate">
                          {top3[1].name ?? 'User'}
                        </p>
                        <div className="bg-gray-200 rounded-t-xl w-16 h-16 flex flex-col items-center justify-center">
                          <span className="text-[22px]">🥈</span>
                          <p className="text-[10px] font-black text-gray-500">{top3[1].currentStreak}d</p>
                        </div>
                      </div>
                    ) : <div className="w-16" />}

                    {/* 1st place */}
                    {top3[0] && (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="text-[18px]">👑</div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-[18px] ${AVATAR_COLORS[0]} ring-4 ring-orange-200`}>
                          {getInitials(top3[0].name)}
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 max-w-[70px] text-center truncate">
                          {top3[0].name ?? 'User'}
                        </p>
                        <div className="bg-orange-400 rounded-t-xl w-16 h-24 flex flex-col items-center justify-center">
                          <span className="text-[28px]">🥇</span>
                          <p className="text-[10px] font-black text-white">{top3[0].currentStreak}d</p>
                        </div>
                      </div>
                    )}

                    {/* 3rd place */}
                    {top3[2] ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[16px] ${AVATAR_COLORS[2]}`}>
                          {getInitials(top3[2].name)}
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-gray-700 max-w-[60px] text-center truncate">
                          {top3[2].name ?? 'User'}
                        </p>
                        <div className="bg-amber-700/40 rounded-t-xl w-16 h-10 flex flex-col items-center justify-center">
                          <span className="text-[18px]">🥉</span>
                          <p className="text-[10px] font-black text-gray-600">{top3[2].currentStreak}d</p>
                        </div>
                      </div>
                    ) : <div className="w-16" />}
                  </div>
                )}

                {/* Rest of leaderboard */}
                <div className="space-y-2">
                  {rest.map((entry, i) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 bg-[#f0f2f5] rounded-2xl px-4 py-3"
                    >
                      <span className="text-[13px] font-black text-gray-400 w-5 text-center">{i + 4}</span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-[14px] ${AVATAR_COLORS[(i + 3) % AVATAR_COLORS.length]}`}>
                        {getInitials(entry.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[14px] uppercase tracking-tight text-gray-900 truncate">
                          {entry.name ?? 'User'}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400">{entry.totalMiles} miles</p>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
                        <Flame size={12} className="text-orange-400" />
                        <span className="text-[12px] font-black text-orange-500">{entry.currentStreak}d</span>
                      </div>
                    </motion.div>
                  ))}

                  {displayBoard.length === 0 && (
                    <div className="text-center py-8 bg-[#f0f2f5] rounded-3xl">
                      <p className="text-[18px] font-bold text-gray-400 uppercase tracking-tight">
                        🚀 Be the first on the board!
                      </p>
                      <p className="text-[13px] text-gray-400 mt-1">
                        Log meals daily to earn your spot
                      </p>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mission Badge ──────────────────────────────────────────────── */}
        <div className="bg-lime-50 border-2 border-lime-200 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center text-4xl shrink-0">⭐</div>
          <div>
            <p className="font-black uppercase tracking-tight text-[16px] text-gray-900">Mission 1</p>
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-tight">
              {streak} day streak · {miles} miles · {nextPlanet ? `${nextPlanet.miles - miles}mi to ${nextPlanet.name}` : 'All planets reached!'}
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
