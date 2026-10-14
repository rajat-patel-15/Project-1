import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Filter, 
  Layers, 
  MapPin, 
  PieChart as PieChartIcon, 
  PlusCircle, 
  RefreshCw, 
  RotateCcw, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Weight 
} from 'lucide-react';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, challengeService, logService } from '../../services/api';
import { CampusKPIs, RecyclingLog, WasteType } from '../../types';
import { challengeCreateSchema } from '../../utils/validation';

const CATEGORY_COLORS: Record<string, string> = {
  PLASTIC: '#f59e0b',
  PAPER: '#3b82f6',
  GLASS: '#14b8a6',
  METAL: '#a855f7',
  E_WASTE: '#ef4444',
  OTHER: '#64748b',
};

export const AdminDashboard: React.FC = () => {
  const { user, addToast, resetDatabase } = useAuth();

  const [kpis, setKpis] = useState<CampusKPIs | null>(null);
  const [logs, setLogs] = useState<RecyclingLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Audit Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWasteFilter, setSelectedWasteFilter] = useState<string>('ALL');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');

  // New Challenge Form State
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chDescription, setChDescription] = useState('');
  const [chPoints, setChPoints] = useState(75);
  const [chDeadline, setChDeadline] = useState('2026-11-20');
  const [chCategory, setChCategory] = useState<string>('GENERAL');
  const [challengeError, setChallengeError] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [kpiData, allLogs] = await Promise.all([
        analyticsService.getCampusKPIs(),
        logService.getLogs(),
      ]);
      setKpis(kpiData);
      setLogs(allLogs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setChallengeError(null);

    const validation = challengeCreateSchema.safeParse({
      title: chTitle,
      description: chDescription,
      rewardPoints: Number(chPoints),
      deadline: chDeadline,
      category: chCategory as any,
    });

    if (!validation.success) {
      setChallengeError(validation.error.errors[0]?.message || 'Please verify form fields');
      return;
    }

    try {
      await challengeService.createChallenge(validation.data, user.id);
      addToast({
        type: 'success',
        title: 'New Campus Challenge Published!',
        message: `"${validation.data.title}" is now available for all students.`,
      });
      setIsCreatingChallenge(false);
      setChTitle('');
      setChDescription('');
    } catch (err: any) {
      setChallengeError(err.message || 'Failed to create challenge.');
    }
  };

  // Filter audit table logs
  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      (l.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.binStationId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWaste = selectedWasteFilter === 'ALL' || l.wasteType === selectedWasteFilter;
    const matchesLocation = selectedLocationFilter === 'ALL' || l.location.includes(selectedLocationFilter);

    return matchesSearch && matchesWaste && matchesLocation;
  });

  // Prepare Pie Chart data across all campus logs
  const campusCategoryCounts: Record<string, number> = {};
  logs.forEach(l => {
    campusCategoryCounts[l.wasteType] = (campusCategoryCounts[l.wasteType] || 0) + 1;
  });
  const pieData = Object.entries(campusCategoryCounts).map(([type, count]) => ({
    name: type,
    value: count,
    color: CATEGORY_COLORS[type] || '#16a34a',
  }));

  // Prepare Daily Trajectory data across campus
  const trajectoryMap: Record<string, { date: string; displayDate: string; count: number; weightKg: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const iso = d.toISOString().split('T')[0];
    const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    trajectoryMap[iso] = { date: iso, displayDate: display, count: 0, weightKg: 0 };
  }
  logs.forEach(l => {
    const dStr = l.createdAt.split('T')[0];
    if (trajectoryMap[dStr]) {
      trajectoryMap[dStr].count += 1;
      trajectoryMap[dStr].weightKg += (l.estimatedWeightGrams || 0) / 1000;
    }
  });
  const trajectoryData = Object.values(trajectoryMap);

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = ['ID', 'Student Name', 'Category', 'Quantity Bracket', 'Weight (g)', 'Location', 'Bin ID', 'Points', 'Verified', 'Timestamp'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.userName || 'Anonymous'}"`,
      l.wasteType,
      `"${l.quantityBracket}"`,
      l.estimatedWeightGrams,
      `"${l.location}"`,
      l.binStationId || 'N/A',
      l.pointsEarned,
      l.verified ? 'YES' : 'NO',
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_campus_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Audit Log Exported',
      message: `Downloaded CSV with ${filteredLogs.length} verified campus records.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Admin Command Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-forest to-emerald-950 text-white p-6 sm:p-8 shadow-eco flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-3 border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Office of Campus Sustainability & Facilities Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Audit & Campus KPIs
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time telemetry bridging the gap between student awareness (95%) and physical recycling participation ({kpis?.participationRate ?? 45}%).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCreatingChallenge(!isCreatingChallenge)}
            className="eco-button-primary text-xs py-2 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Campus Challenge</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all user logs, badges, and challenge statuses to default seed demo state?')) {
                resetDatabase();
                loadAdminData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 border border-slate-700 text-xs font-semibold transition-colors"
            title="Reset database to default seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database</span>
          </button>
        </div>
      </div>

      {/* CREATE CHALLENGE COLLAPSIBLE FORM */}
      {isCreatingChallenge && (
        <div className="eco-card p-6 border-emerald-300 bg-emerald-50/20 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Publish New Campus Challenge to Students</span>
            </h3>
            <button
              onClick={() => setIsCreatingChallenge(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          {challengeError && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {challengeError}
            </div>
          )}

          <form onSubmit={handleCreateChallenge} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Challenge Title</label>
                <input
                  type="text"
                  placeholder="e.g. End of Semester Textbook Drive"
                  value={chTitle}
                  onChange={e => setChTitle(e.target.value)}
                  className="eco-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Waste Category</label>
                <select
                  value={chCategory}
                  onChange={e => setChCategory(e.target.value)}
                  className="eco-input text-xs"
                >
                  <option value="GENERAL">General Campus Activity</option>
                  <option value="PAPER">Paper & Cardboard</option>
                  <option value="PLASTIC">Plastic</option>
                  <option value="E_WASTE">E-Waste</option>
                  <option value="METAL">Metal</option>
                  <option value="GLASS">Glass</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reward Eco Points</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={chPoints}
                  onChange={e => setChPoints(Number(e.target.value))}
                  className="eco-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={chDeadline}
                  onChange={e => setChDeadline(e.target.value)}
                  className="eco-input text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Challenge Description & Rules</label>
              <textarea
                placeholder="Explain the required action students must take to claim the reward..."
                value={chDescription}
                onChange={e => setChDescription(e.target.value)}
                className="eco-input text-xs h-20"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="eco-button-primary text-xs py-2 px-4"
              >
                Publish Challenge to Leaderboard
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4 INSTITUTIONAL KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Registered Students */}
        <div className="eco-card p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {kpis?.totalRegisteredStudents ?? 10}
            </span>
            <span className="text-xs font-semibold text-emerald-600">active cohorts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">10 demo student profiles seeded</p>
        </div>

        {/* KPI 2: Participation Gap (Awareness vs Action) */}
        <div className="eco-card p-5 bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Participation Rate</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-950">
              {kpis?.participationRate ?? 45}%
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              vs. 95% awareness
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {kpis?.activeRecyclingStudents ?? 5} active recyclers on campus
          </p>
        </div>

        {/* KPI 3: Total Diverted Waste */}
        <div className="eco-card p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Waste Diverted</span>
            <Weight className="w-5 h-5 text-teal-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {kpis?.totalDivertedKg ?? 0}
            </span>
            <span className="text-xs font-semibold text-teal-600">kg total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all 5 verified bin stations</p>
        </div>

        {/* KPI 4: Total Points Awarded */}
        <div className="eco-card p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Eco Points Distributed</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {kpis?.totalPointsAwarded ?? 0}
            </span>
            <span className="text-xs font-semibold text-amber-600">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{kpis?.totalActivitiesLogged ?? 0} logged actions</p>
        </div>
      </div>

      {/* CAMPUS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie: Campus Category Breakdown */}
        <div className="lg:col-span-5 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Campus Stream Breakdown</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Aggregate collection volume across campus facilities
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [`${val} campus deposits`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium">{item.name}</span>
                <span className="text-slate-400 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trajectory: Campus-Wide Daily Trajectory */}
        <div className="lg:col-span-7 eco-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Campus Daily Diversion (14 Days)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Institutional Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Total volume of student recycling activity across academic quads & residential halls
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <defs>
                    <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val} actions (~${item.payload.weightKg.toFixed(1)} kg)`,
                      'Campus Activity',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAdmin)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated across all residential clusters</span>
            <span className="font-semibold text-teal-800">5 active monitored bin stations</span>
          </div>
        </div>
      </div>

      {/* LIVE AUDIT TABLE SECTION */}
      <div className="eco-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Live Campus Recycling Audit Table</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive institutional record of all student entries for accreditation and verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, location, bin code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="eco-input pl-9 text-xs py-2"
            />
          </div>

          {/* Waste Type Filter */}
          <div>
            <select
              value={selectedWasteFilter}
              onChange={e => setSelectedWasteFilter(e.target.value)}
              className="eco-input text-xs py-2"
            >
              <option value="ALL">All Categories (Plastic, Paper, Glass, Metal, E-Waste)</option>
              <option value="PLASTIC">Plastic</option>
              <option value="PAPER">Paper</option>
              <option value="GLASS">Glass</option>
              <option value="METAL">Metal</option>
              <option value="E_WASTE">E-Waste</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocationFilter}
              onChange={e => setSelectedLocationFilter(e.target.value)}
              className="eco-input text-xs py-2"
            >
              <option value="ALL">All Campus Locations</option>
              <option value="Quad">Main Academic Quad</option>
              <option value="Library">Central Library</option>
              <option value="Hostel">Hostel Cluster</option>
              <option value="Cafeteria">Campus Cafeteria</option>
              <option value="Science">Science & Engineering</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Waste Category</th>
                <th className="px-4 py-3">Quantity Bracket</th>
                <th className="px-4 py-3">Location / Bin ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No matching student audit logs found for current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userName || 'Anonymous Student'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800">
                        {log.wasteType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.quantityBracket} (~{log.estimatedWeightGrams}g)
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-slate-900 block truncate max-w-xs">
                          {log.location}
                        </span>
                        {log.binStationId && (
                          <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {log.binStationId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                      +{log.pointsEarned} pts
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
