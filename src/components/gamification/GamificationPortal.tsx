import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Crown, 
  Flame, 
  Gift, 
  Layers, 
  Medal, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  Users 
} from 'lucide-react';
import { SYSTEM_BADGES } from '../../constants/gamification';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, badgeService, challengeService } from '../../services/api';
import { Badge, Challenge, ChallengeStatus, UserBadge, UserChallenge } from '../../types';

export const GamificationPortal: React.FC = () => {
  const { user, addToast, refreshUser } = useAuth();

  const [activeLeaderboardFilter, setActiveLeaderboardFilter] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>(SYSTEM_BADGES);
  const [userBadges, setUserBadges] = useState<(UserBadge & { badge: Badge })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lb, ch, ub] = await Promise.all([
        analyticsService.getLeaderboard(activeLeaderboardFilter),
        challengeService.getChallenges(),
        user ? badgeService.getUserBadges(user.id) : Promise.resolve([]),
      ]);
      setLeaderboard(lb);
      setChallenges(ch);
      setUserBadges(ub);

      if (user) {
        const uc = await challengeService.getUserChallenges(user.id);
        setUserChallenges(uc);
      }
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeLeaderboardFilter, user?.id]);

  const getChallengeStatus = (challengeId: string): ChallengeStatus => {
    const uc = userChallenges.find(c => c.challengeId === challengeId);
    if (!uc) return 'AVAILABLE';
    if (uc.status === 'COMPLETED') return 'COMPLETED';
    // If progress is 100 or >= 50 in our simulation, let them claim!
    if ((uc.progress || 0) >= 60) return 'CLAIMABLE';
    return 'JOINED';
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      addToast({ type: 'warning', title: 'Sign In Required', message: 'Please sign in to join challenges.' });
      return;
    }
    try {
      setActionInProgress(challengeId);
      const joined = await challengeService.joinChallenge(challengeId, user.id);
      setUserChallenges(prev => [...prev.filter(c => c.challengeId !== challengeId), joined]);
      addToast({
        type: 'success',
        title: 'Challenge Joined!',
        message: 'Complete the target actions to claim your bonus eco points.',
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Action Failed', message: err.message });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleClaimReward = async (challengeId: string) => {
    if (!user) return;
    try {
      setActionInProgress(challengeId);
      const res = await challengeService.claimReward(challengeId, user.id);
      await refreshUser();
      loadData();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });

      addToast({
        type: 'success',
        title: `+${res.pointsAwarded} Bonus Points Claimed!`,
        message: 'Challenge marked as Completed. Keep up the high campus impact!',
      });

      if (res.newBadges && res.newBadges.length > 0) {
        for (const badge of res.newBadges) {
          addToast({
            type: 'info',
            title: `🏆 New Badge: ${badge.title}`,
            message: badge.description,
          });
        }
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Claim Failed', message: err.message });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-forest to-emerald-900 text-white p-6 sm:p-8 shadow-eco">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Behavioral Gamification & Institutional Competition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Leaderboard & Campus Eco Challenges
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Harness positive peer motivation. Climb the institutional leaderboards, preserve consecutive day streaks, and claim verified community challenge rewards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: DYNAMIC LEADERBOARD (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="eco-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base font-bold text-slate-900">Campus Student Leaderboard</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by verified eco points earned
                </p>
              </div>

              {/* Timeframe Filter Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveLeaderboardFilter('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeLeaderboardFilter === 'weekly'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setActiveLeaderboardFilter('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeLeaderboardFilter === 'monthly'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setActiveLeaderboardFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeLeaderboardFilter === 'all'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All-Time
                </button>
              </div>
            </div>

            {/* Leaderboard Table / Rows */}
            <div className="space-y-2">
              {leaderboard.map((student, index) => {
                const rank = index + 1;
                const isCurrent = user?.id === student.id;
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={student.id}
                    className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/70 border border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                        {rank === 1 && (
                          <span className="bg-amber-100 text-amber-800 p-1.5 rounded-xl border border-amber-300">
                            🥇
                          </span>
                        )}
                        {rank === 2 && (
                          <span className="bg-slate-200 text-slate-800 p-1.5 rounded-xl border border-slate-300">
                            🥈
                          </span>
                        )}
                        {rank === 3 && (
                          <span className="bg-amber-900/10 text-amber-950 p-1.5 rounded-xl border border-amber-700/30">
                            🥉
                          </span>
                        )}
                        {rank > 3 && (
                          <span className="text-slate-500 font-bold">#{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <img
                        src={student.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                        alt={student.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />

                      {/* Name & Details */}
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {student.name}
                          </p>
                          {isCurrent && (
                            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {student.department || 'Undergraduate Student'}
                        </p>
                      </div>
                    </div>

                    {/* Streak & Points */}
                    <div className="flex items-center gap-4 text-right shrink-0">
                      {student.streakCount > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{student.streakCount}d</span>
                        </div>
                      )}

                      <div>
                        <span className="text-base font-extrabold text-emerald-700 block">
                          {student.displayPoints} <span className="text-xs font-semibold">pts</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {student.badgesCount} badges
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ECO CHALLENGES & BADGES DIRECTORY (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CHALLENGES CARD GRID */}
          <div className="eco-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Campus Eco Challenges</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {challenges.length} Active
              </span>
            </div>

            <div className="space-y-3.5">
              {challenges.map(ch => {
                const status = getChallengeStatus(ch.id);
                const isWorking = actionInProgress === ch.id;

                return (
                  <div
                    key={ch.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            +{ch.rewardPoints} pts
                          </span>
                          {ch.category && (
                            <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              {ch.category}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5">{ch.title}</h4>
                      </div>

                      {/* Status indicator pill */}
                      <div>
                        {status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {status === 'CLAIMABLE' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                            <Gift className="w-3 h-3" /> Reward Ready
                          </span>
                        )}
                        {status === 'JOINED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            In Progress
                          </span>
                        )}
                        {status === 'AVAILABLE' && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            Open
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {ch.deadline}</span>
                      </span>

                      {/* State Machine Action Button */}
                      <div>
                        {status === 'AVAILABLE' && (
                          <button
                            onClick={() => handleJoinChallenge(ch.id)}
                            disabled={isWorking}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            {isWorking ? 'Joining...' : 'Join Challenge'}
                          </button>
                        )}

                        {status === 'JOINED' && (
                          <button
                            onClick={() => handleClaimReward(ch.id)}
                            disabled={isWorking}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <span>Mark Completed & Claim</span>
                          </button>
                        )}

                        {status === 'CLAIMABLE' && (
                          <button
                            onClick={() => handleClaimReward(ch.id)}
                            disabled={isWorking}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>Claim +{ch.rewardPoints} pts</span>
                          </button>
                        )}

                        {status === 'COMPLETED' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Reward Claimed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SYSTEM BADGES DIRECTORY */}
          <div className="eco-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Institutional Badges Matrix</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Automated deterministic hooks evaluate on every logged activity.
            </p>

            <div className="space-y-2.5">
              {allBadges.map(b => {
                const isUnlocked = userBadges.some(ub => ub.badgeId === b.id || ub.badge?.code === b.code);

                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{b.title}</p>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700">Unlocked ✓</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Locked</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
