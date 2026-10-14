import React, { useEffect, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  Flame, 
  MapPin, 
  PlusCircle, 
  QrCode, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  Trophy, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, badgeService, logService } from '../../services/api';
import { Badge, RecyclingLog, StudentDashboardStats, UserBadge } from '../../types';

interface StudentDashboardProps {
  onOpenLogModal: () => void;
  onOpenQRScanner: () => void;
  onNavigateToEducation: () => void;
  onNavigateToGamification: () => void;
  refreshTrigger: number;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenLogModal,
  onOpenQRScanner,
  onNavigateToEducation,
  onNavigateToGamification,
  refreshTrigger,
}) => {
  const { user, addToast, refreshUser } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<RecyclingLog[]>([]);
  const [userBadges, setUserBadges] = useState<(UserBadge & { badge: Badge })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [userStats, logs, badges] = await Promise.all([
        analyticsService.getStudentStats(user.id),
        logService.getUserLogs(user.id),
        badgeService.getUserBadges(user.id),
      ]);
      setStats(userStats);
      setRecentLogs(logs.slice(0, 8));
      setUserBadges(badges);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, refreshTrigger]);

  const handleDeleteLog = async (logId: string) => {
    if (window.confirm('Are you sure you want to remove this log entry? Points will be adjusted.')) {
      await logService.deleteLog(logId);
      await refreshUser();
      loadData();
      addToast({
        type: 'info',
        title: 'Log Removed',
        message: 'The recycling activity has been removed from your history.',
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <Recycle className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800">Please sign in to view your EcoTrack portal</h3>
      </div>
    );
  }

  const categoryColor = (type: string) => {
    switch (type) {
      case 'PLASTIC': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PAPER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'GLASS': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'METAL': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'E_WASTE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Welcome & Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-forest-light to-emerald-800 text-white p-6 sm:p-8 shadow-eco">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3 text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Active Student Researcher & Recycler</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user.name}! 🌿
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
            Every verified log directly feeds the university sustainability audit while boosting your campus rank.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenLogModal}
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Log Recycling Now</span>
            </button>

            <button
              onClick={onOpenQRScanner}
              className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-500/40 px-4 py-2.5 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Verify at Station QR</span>
            </button>
          </div>
        </div>

        {/* Subtle background decorative shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 opacity-10 text-white pointer-events-none hidden sm:block">
          <Recycle className="w-48 h-48" />
        </div>
      </div>

      {/* 4 TOP STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Total Points */}
        <div className="eco-card p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Eco Points</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalPoints ?? user.totalPoints}
            </span>
            <span className="text-xs font-semibold text-emerald-600">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime gamified reward credits</p>
        </div>

        {/* Stat 2: Activities Count */}
        <div className="eco-card p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activities Logged</p>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.activitiesCount ?? 0}
            </span>
            <span className="text-xs font-semibold text-blue-600">actions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified campus deposits</p>
        </div>

        {/* Stat 3: Campus Rank */}
        <div className="eco-card p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Rank</p>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              #{stats?.campusRank ?? 1}
            </span>
            <span className="text-xs font-semibold text-purple-600">of 10 students</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            <button
              onClick={onNavigateToGamification}
              className="text-purple-600 hover:underline font-semibold"
            >
              View Leaderboard →
            </button>
          </p>
        </div>

        {/* Stat 4: Active Streak */}
        <div className="eco-card p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Streak</p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.activeStreak ?? user.streakCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {(stats?.activeStreak ?? 0) >= 7 ? '🔥 Eco Streak Master unlocked!' : 'Maintain daily to avoid reset'}
          </p>
        </div>
      </div>

      {/* BADGE PROGRESS CARD */}
      {stats?.nextMilestone && (
        <div className="eco-card p-5 sm:p-6 border-emerald-100 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-600 text-white">
                  <Award className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Next Milestone: {stats.nextMilestone.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {stats.nextMilestone.pointsNeeded > 0 ? (
                  <span>
                    Only <strong className="text-emerald-700 font-bold">{stats.nextMilestone.pointsNeeded} points away</strong> from unlocking this tier.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">Milestone Achieved! 🎉</span>
                )}
              </p>
            </div>

            <div className="text-right sm:shrink-0">
              <span className="text-xs font-bold text-slate-800">
                {stats.nextMilestone.currentPoints} / {stats.nextMilestone.targetPoints} pts
              </span>
              <p className="text-[10px] text-slate-500">{stats.nextMilestone.progressPercentage}% Completed</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.max(6, stats.nextMilestone.progressPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* UNLOCKED BADGES SHOWCASE */}
      <div className="eco-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">My Unlocked Badges</h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {userBadges.length} Earned
            </span>
          </div>

          <button
            onClick={onNavigateToGamification}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All Badges & Challenges</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userBadges.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No badges unlocked yet. Log your 1st activity to earn the Eco Starter badge!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {userBadges.map(ub => (
              <div
                key={ub.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-start gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                    {ub.badge.title}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {ub.badge.description}
                  </p>
                  <span className="text-[9px] font-mono text-emerald-700 block mt-1">
                    Unlocked {new Date(ub.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK SHORTCUTS & EDUCATIONAL CALLOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Search Teaser */}
        <div className="eco-card p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Segregation Lookup</span>
            </div>
            <h4 className="text-base font-bold">Unsure if an item can be recycled?</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Search over 30+ common campus items like coffee cups, pizza boxes, cables, and packaging before throwing them out.
            </p>
          </div>
          <button
            onClick={onNavigateToEducation}
            className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors self-start"
          >
            <span>Open "Can I Recycle This?" Tool</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Environmental Diverted Stat Box */}
        <div className="eco-card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/10 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personal Environmental Telemetry</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">Your Landfill Diversion</h4>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                <p className="text-[10px] text-slate-500">Waste Diverted</p>
                <p className="text-lg font-extrabold text-emerald-700">
                  {stats?.divertedWeightKg ?? 0} <span className="text-xs font-normal">kg</span>
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                <p className="text-[10px] text-slate-500">CO₂ Avoided</p>
                <p className="text-lg font-extrabold text-teal-700">
                  ~{stats?.co2PreventedKg ?? 0} <span className="text-xs font-normal">kg CO₂e</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Calculated via EPA Waste Reduction Model (WARM) campus metrics.
          </p>
        </div>
      </div>

      {/* RECENT RECYCLING LOGS STREAM */}
      <div className="eco-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Recycling Activities</h3>
            <p className="text-xs text-slate-500">Your verified campus deposit trail</p>
          </div>

          <button
            onClick={onOpenLogModal}
            className="eco-button-primary text-xs py-1.5 px-3 gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Log</span>
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No recycling logs yet. Make your first deposit and scan an eco-station!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentLogs.map(log => (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded-md font-bold text-[10px] border ${categoryColor(log.wasteType)} shrink-0`}>
                    {log.wasteType}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {log.quantityBracket} (~{log.estimatedWeightGrams}g)
                      </span>
                      {log.verified ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>QR Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Unverified Station</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{log.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">"{log.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-600">
                      +{log.pointsEarned} pts
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
