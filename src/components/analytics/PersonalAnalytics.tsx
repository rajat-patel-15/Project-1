import React, { useEffect, useState } from 'react';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  Activity, 
  CheckCircle2, 
  Droplet, 
  FileText, 
  Flame, 
  Layers, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Recycle, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  TreePine, 
  Wind 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, logService } from '../../services/api';
import { RecyclingLog, StudentDashboardStats } from '../../types';
import { calculateImpactMetrics } from '../../utils/calculations';

const CATEGORY_COLORS: Record<string, string> = {
  PLASTIC: '#f59e0b', // Amber
  PAPER: '#3b82f6',   // Blue
  GLASS: '#14b8a6',   // Teal
  METAL: '#a855f7',   // Purple
  E_WASTE: '#ef4444', // Red
  OTHER: '#64748b',   // Slate
};

export const PersonalAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<RecyclingLog[]>([]);
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [userLogs, userStats] = await Promise.all([
          logService.getUserLogs(user.id),
          analyticsService.getStudentStats(user.id),
        ]);
        setLogs(userLogs);
        setStats(userStats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  if (!user) return null;

  const impact = calculateImpactMetrics(logs);

  // 1. Prepare Category Distribution Data for Pie/Doughnut Chart
  const categoryCounts: Record<string, { count: number; weightGrams: number; points: number }> = {};
  logs.forEach(l => {
    if (!categoryCounts[l.wasteType]) {
      categoryCounts[l.wasteType] = { count: 0, weightGrams: 0, points: 0 };
    }
    categoryCounts[l.wasteType].count += 1;
    categoryCounts[l.wasteType].weightGrams += l.estimatedWeightGrams || 0;
    categoryCounts[l.wasteType].points += l.pointsEarned || 0;
  });

  const pieData = Object.entries(categoryCounts).map(([type, data]) => ({
    name: type,
    value: data.count,
    weightKg: Number((data.weightGrams / 1000).toFixed(2)),
    points: data.points,
    color: CATEGORY_COLORS[type] || '#16a34a',
  }));

  // 2. Prepare Activity Count over Time (last 14 days)
  const timelineMap: Record<string, { date: string; displayDate: string; count: number; points: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const isoDate = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    timelineMap[isoDate] = { date: isoDate, displayDate, count: 0, points: 0 };
  }

  logs.forEach(l => {
    const logDate = l.createdAt.split('T')[0];
    if (timelineMap[logDate]) {
      timelineMap[logDate].count += 1;
      timelineMap[logDate].points += l.pointsEarned;
    }
  });

  const timelineData = Object.values(timelineMap);

  // 3. Prepare Monthly Points Breakdown
  const monthlyMap: Record<string, { month: string; points: number; weightKg: number }> = {};
  logs.forEach(l => {
    const d = new Date(l.createdAt);
    const monthKey = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { month: monthKey, points: 0, weightKg: 0 };
    }
    monthlyMap[monthKey].points += l.pointsEarned;
    monthlyMap[monthKey].weightKg += (l.estimatedWeightGrams || 0) / 1000;
  });
  const monthlyData = Object.values(monthlyMap);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-eco">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Personal Environmental Telemetry & Science Models</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Ecological Impact & Analytics
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Transparent institutional auditing. Visualize how your individual recycling decisions compound into significant landfill diversion and avoided carbon emissions.
          </p>
        </div>
      </div>

      {/* 4 SCIENTIFIC IMPACT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Diverted */}
        <div className="eco-card p-5 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Diverted from Landfill</span>
            <Scale className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-950">{impact.totalKg}</span>
            <span className="text-sm font-bold text-emerald-700">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">~{(impact.totalKg * 2.20462).toFixed(1)} lbs physical mass saved</p>
        </div>

        {/* Metric 2: Avoided Carbon */}
        <div className="eco-card p-5 bg-gradient-to-br from-teal-50/50 to-white">
          <div className="flex items-center justify-between text-teal-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CO₂e Avoided</span>
            <Wind className="w-5 h-5 text-teal-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-teal-950">{impact.co2AvoidedKg}</span>
            <span className="text-sm font-bold text-teal-700">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">EPA Waste Reduction (WARM) factor 2.1x</p>
        </div>

        {/* Metric 3: Trees Preserved */}
        <div className="eco-card p-5 bg-gradient-to-br from-amber-50/50 to-white">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tree Preservation</span>
            <TreePine className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-950">{impact.treesPreserved}</span>
            <span className="text-sm font-bold text-amber-700">trees</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Equivalent virgin pulp fiber saved</p>
        </div>

        {/* Metric 4: QR Station Verification Rate */}
        <div className="eco-card p-5 bg-gradient-to-br from-blue-50/50 to-white">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Station Verification</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-blue-950">
              {logs.length > 0 ? Math.round((impact.verifiedLogs / logs.length) * 100) : 0}%
            </span>
            <span className="text-sm font-bold text-blue-700">verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {impact.verifiedLogs} of {logs.length} scanned at bins
          </p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: WASTE CATEGORY DOUGHNUT/PIE (5 cols) */}
        <div className="lg:col-span-5 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Waste Category Distribution</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of your logged recycling actions by stream
            </p>

            {pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No activity data to chart yet.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value} logs (${item.payload.weightKg} kg, ${item.payload.points} pts)`,
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Custom Category Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium truncate">{item.name}</span>
                <span className="text-slate-400 text-[11px] ml-auto">{item.value} ({item.weightKg}kg)</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: ACTIVITY OVER TIME (LAST 14 DAYS) (7 cols) */}
        <div className="lg:col-span-7 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Activity Trajectory (Last 14 Days)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Continuous Habits
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Number of verified campus recycling actions logged per day
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val} activities (${item.payload.points} pts)`,
                      'Recycling Logs',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tracking active streak consistency</span>
            <span className="font-bold text-emerald-700">Streak: {user.streakCount} days active</span>
          </div>
        </div>
      </div>

      {/* CHART 3: MONTHLY POINTS ACCUMULATION BAR CHART */}
      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Monthly Eco Points Accumulation</h3>
          </div>
          <span className="text-xs text-slate-500">Semester View</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Total points awarded across semester milestones
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${val} points (${item.payload.weightKg.toFixed(1)} kg diverted)`,
                  'Eco Points',
                ]}
              />
              <Bar dataKey="points" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
