import { BASE_POINTS, QUANTITY_MULTIPLIERS, SYSTEM_BADGES } from '../constants/gamification';
import { Badge, QuantityBracket, RecyclingLog, User, WasteType } from '../types';

/**
 * Deterministic point calculation
 * Formula: pointsEarned = Math.round(basePoints * quantityMultiplier)
 */
export function calculatePoints(wasteType: WasteType, quantityBracket: QuantityBracket): {
  points: number;
  basePoints: number;
  multiplier: number;
  estimatedWeightGrams: number;
} {
  const base = BASE_POINTS[wasteType] ?? 5;
  const { multiplier, estGrams } = QUANTITY_MULTIPLIERS[quantityBracket] ?? { multiplier: 1.0, estGrams: 50 };
  const points = Math.round(base * multiplier);

  return {
    points,
    basePoints: base,
    multiplier,
    estimatedWeightGrams: estGrams,
  };
}

/**
 * Deterministic streak calculation
 * - If lastActiveDate is yesterday: streakCount += 1
 * - If lastActiveDate is today: keep current streak
 * - If lastActiveDate is older than yesterday or null: reset streakCount = 1
 */
export function calculateNextStreak(
  currentStreak: number,
  lastActiveDateStr: string | null | undefined,
  logDateStr: string = new Date().toISOString().split('T')[0]
): { newStreak: number; streakIncreased: boolean; message: string } {
  if (!lastActiveDateStr) {
    return {
      newStreak: 1,
      streakIncreased: true,
      message: 'Day 1 streak started!',
    };
  }

  // Parse YYYY-MM-DD
  const lastActive = new Date(lastActiveDateStr);
  const current = new Date(logDateStr);

  // Normalize midnight UTC
  const lastActiveTime = Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate());
  const currentTime = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());

  const diffDays = Math.round((currentTime - lastActiveTime) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today
    return {
      newStreak: Math.max(1, currentStreak),
      streakIncreased: false,
      message: `Streak retained at ${currentStreak} days!`,
    };
  } else if (diffDays === 1) {
    // Yesterday
    const next = currentStreak + 1;
    return {
      newStreak: next,
      streakIncreased: true,
      message: `Streak continued! You are on a ${next}-day eco streak!`,
    };
  } else if (diffDays < 0) {
    // Backdated log
    return {
      newStreak: Math.max(1, currentStreak),
      streakIncreased: false,
      message: 'Activity recorded for previous date.',
    };
  } else {
    // Diff > 1 day, streak was broken
    return {
      newStreak: 1,
      streakIncreased: false,
      message: 'Streak reset: starting fresh on Day 1 today!',
    };
  }
}

/**
 * Automated Badge Trigger Hooks
 * Evaluates whether any new badges should be awarded to the student
 */
export function evaluateBadgesToUnlock(params: {
  user: User;
  userLogsCount: number;
  newTotalPoints: number;
  newStreakCount: number;
  currentRank: number;
  existingBadgeCodes: string[];
}): Badge[] {
  const {
    userLogsCount,
    newTotalPoints,
    newStreakCount,
    currentRank,
    existingBadgeCodes,
  } = params;

  const toUnlock: Badge[] = [];

  for (const badge of SYSTEM_BADGES) {
    if (existingBadgeCodes.includes(badge.code)) {
      continue;
    }

    let shouldUnlock = false;

    switch (badge.code) {
      case 'ECO_STARTER':
        // Unlocks on 1st recycling log
        if (userLogsCount >= 1) shouldUnlock = true;
        break;

      case 'RECYCLER':
        // Unlocks on 10th recycling log
        if (userLogsCount >= 10) shouldUnlock = true;
        break;

      case 'GREEN_CHAMPION':
        // Unlocks when totalPoints >= 500
        if (newTotalPoints >= 500) shouldUnlock = true;
        break;

      case 'ECO_STREAK':
        // Unlocks when streakCount >= 7
        if (newStreakCount >= 7) shouldUnlock = true;
        break;

      case 'SUSTAINABILITY_LEADER':
        // Unlocks if current rank <= 3
        if (currentRank > 0 && currentRank <= 3) shouldUnlock = true;
        break;
    }

    if (shouldUnlock) {
      toUnlock.push(badge);
    }
  }

  return toUnlock;
}

/**
 * Environmental impact calculations
 */
export function calculateImpactMetrics(logs: RecyclingLog[]) {
  const totalGrams = logs.reduce((sum, log) => sum + (log.estimatedWeightGrams || 0), 0);
  const totalKg = Number((totalGrams / 1000).toFixed(2));
  // EPA WARM estimate: ~2.1 kg CO2 avoided per kg recycled
  const co2AvoidedKg = Number((totalKg * 2.1).toFixed(2));
  // Trees preserved estimate (from paper portion): ~0.017 trees per kg paper
  const paperKg = logs
    .filter(l => l.wasteType === 'PAPER')
    .reduce((sum, l) => sum + (l.estimatedWeightGrams || 0), 0) / 1000;
  const treesPreserved = Number((paperKg * 0.017).toFixed(3));

  return {
    totalKg,
    co2AvoidedKg,
    treesPreserved,
    totalLogs: logs.length,
    verifiedLogs: logs.filter(l => l.verified).length,
  };
}

/**
 * Next milestone calculation for student dashboard
 */
export function calculateNextMilestone(totalPoints: number) {
  const milestones = [
    { title: 'Eco Starter (1st Log)', points: 50 },
    { title: 'Bronze Recycler', points: 150 },
    { title: 'Silver Sustainer', points: 300 },
    { title: 'Green Champion', points: 500 },
    { title: 'Eco Titan', points: 750 },
    { title: 'Campus Legend', points: 1000 },
  ];

  const next = milestones.find(m => m.points > totalPoints) || {
    title: 'Earth Guardian (Ultimate)',
    points: totalPoints + 250,
  };

  const prevPoints = milestones
    .filter(m => m.points <= totalPoints)
    .pop()?.points || 0;

  const pointsNeeded = Math.max(0, next.points - totalPoints);
  const bracketRange = next.points - prevPoints;
  const earnedInRange = totalPoints - prevPoints;
  const progressPercentage = Math.min(100, Math.round((earnedInRange / bracketRange) * 100));

  return {
    title: next.title,
    targetPoints: next.points,
    currentPoints: totalPoints,
    pointsNeeded,
    progressPercentage,
  };
}
