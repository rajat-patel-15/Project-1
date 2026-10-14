import { Badge, BinStation, CampusKPIs, Challenge, RecyclingLog, StudentDashboardStats, User, UserBadge, UserChallenge } from '../types';
import { calculateImpactMetrics, calculateNextMilestone, calculateNextStreak, calculatePoints, evaluateBadgesToUnlock } from '../utils/calculations';
import { ChallengeCreateInput, LoginInput, RecyclingLogInput, RegisterInput } from '../utils/validation';
import { db } from './storage';

// Simulated network delay helper for realistic API experience
const delay = (ms: number = 80) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await delay(30);
    const userId = db.getCurrentUserId();
    if (!userId) return null;
    return db.getUserById(userId) || null;
  },

  async login(credentials: LoginInput): Promise<{ user: User; token: string }> {
    await delay(120);
    const user = db.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    if (user.passwordHash && user.passwordHash !== credentials.password) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    db.setCurrentUserId(user.id);
    return {
      user,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
    };
  },

  async demoLogin(role: 'STUDENT' | 'ADMIN'): Promise<{ user: User; token: string }> {
    await delay(60);
    const targetEmail = role === 'STUDENT' ? 'student@ecotrack.demo' : 'admin@ecotrack.demo';
    const user = db.getUserByEmail(targetEmail);
    if (!user) {
      throw new Error(`Demo ${role} account could not be found.`);
    }

    db.setCurrentUserId(user.id);
    return {
      user,
      token: `demo-token-${user.id}`,
    };
  },

  async register(data: RegisterInput): Promise<{ user: User; token: string }> {
    await delay(150);
    const existing = db.getUserByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role || 'STUDENT',
      department: data.department,
      studentId: data.studentId,
      totalPoints: 0,
      streakCount: 0,
      lastActiveDate: null,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
    };

    const users = db.getUsers();
    users.push(newUser);
    db.saveUsers(users);
    db.setCurrentUserId(newUser.id);

    return {
      user: newUser,
      token: `mock-jwt-${newUser.id}`,
    };
  },

  async logout(): Promise<void> {
    await delay(30);
    db.setCurrentUserId(null);
  },

  async switchUser(userId: string): Promise<User> {
    await delay(40);
    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');
    db.setCurrentUserId(user.id);
    return user;
  },

  async getAllUsers(): Promise<User[]> {
    return db.getUsers();
  }
};

export const binService = {
  async getBins(): Promise<BinStation[]> {
    await delay(40);
    return db.getBinStations();
  },

  async verifyBin(qrCode: string): Promise<{ valid: boolean; bin?: BinStation; message: string }> {
    await delay(100);
    const bin = db.findBinByQRCode(qrCode);
    if (!bin) {
      return {
        valid: false,
        message: `Station code "${qrCode}" was not recognized. Please scan a valid EcoTrack station.`,
      };
    }
    if (!bin.isActive) {
      return {
        valid: false,
        bin,
        message: `Station "${bin.name}" is currently undergoing scheduled maintenance.`,
      };
    }
    return {
      valid: true,
      bin,
      message: `Verified Station: ${bin.name} (${bin.qrCode})`,
    };
  },
};

export const logService = {
  async getLogs(): Promise<RecyclingLog[]> {
    await delay(50);
    return db.getLogs();
  },

  async getUserLogs(userId: string): Promise<RecyclingLog[]> {
    await delay(40);
    const logs = db.getLogs();
    return logs.filter(l => l.userId === userId);
  },

  async createLog(input: RecyclingLogInput, userId: string): Promise<{
    log: RecyclingLog;
    user: User;
    newBadges: Badge[];
    streakInfo: { newStreak: number; increased: boolean; message: string };
  }> {
    await delay(120);

    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    // 1. Deterministic Point Calculation
    const { points, estimatedWeightGrams } = calculatePoints(input.wasteType, input.quantityBracket);

    // 2. Bin verification check
    let verified = false;
    let binStationName: string | undefined = undefined;
    if (input.binStationId) {
      const bin = db.findBinByQRCode(input.binStationId);
      if (bin && bin.isActive) {
        verified = true;
        binStationName = bin.name;
      }
    }

    const logDateStr = input.date || new Date().toISOString().split('T')[0];

    // 3. Deterministic Streak Calculation
    const streakResult = calculateNextStreak(user.streakCount, user.lastActiveDate, logDateStr);

    // 4. Create new Log object
    const newLog: RecyclingLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      wasteType: input.wasteType,
      quantityBracket: input.quantityBracket,
      estimatedWeightGrams,
      location: input.location,
      binStationId: input.binStationId || null,
      binStationName,
      pointsEarned: points,
      verified,
      notes: input.notes,
      createdAt: input.date ? `${input.date}T${new Date().toTimeString().split(' ')[0]}Z` : new Date().toISOString(),
    };

    // Save log
    db.addLog(newLog);

    // 5. Update User totals
    const newTotalPoints = user.totalPoints + points;
    const updatedUser = db.updateUser(user.id, {
      totalPoints: newTotalPoints,
      streakCount: streakResult.newStreak,
      lastActiveDate: logDateStr,
    });

    // 6. Recalculate rank for leaderboard
    const allStudents = db.getUsers().filter(u => u.role === 'STUDENT');
    const sorted = [...allStudents].sort((a, b) => b.totalPoints - a.totalPoints);
    const currentRank = sorted.findIndex(s => s.id === user.id) + 1;

    // 7. Automated Badge Trigger Hooks
    const userLogs = db.getLogs().filter(l => l.userId === user.id);
    const existingUserBadges = db.getUserBadges(user.id);
    const existingBadgeCodes = existingUserBadges
      .map(ub => {
        const b = db.getBadges().find(x => x.id === ub.badgeId);
        return b?.code;
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    const badgesToUnlock = evaluateBadgesToUnlock({
      user: updatedUser,
      userLogsCount: userLogs.length,
      newTotalPoints,
      newStreakCount: streakResult.newStreak,
      currentRank,
      existingBadgeCodes,
    });

    // Award any new badges
    for (const badge of badgesToUnlock) {
      const newUserBadge: UserBadge = {
        id: `ub-${Date.now()}-${badge.id}`,
        userId: user.id,
        badgeId: badge.id,
        badge,
        unlockedAt: new Date().toISOString(),
      };
      db.addUserBadge(newUserBadge);
    }

    return {
      log: newLog,
      user: updatedUser,
      newBadges: badgesToUnlock,
      streakInfo: {
        newStreak: streakResult.newStreak,
        increased: streakResult.streakIncreased,
        message: streakResult.message,
      },
    };
  },

  async deleteLog(logId: string): Promise<void> {
    await delay(60);
    db.deleteLog(logId);
  },
};

export const badgeService = {
  async getBadges(): Promise<Badge[]> {
    return db.getBadges();
  },

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    await delay(30);
    const userBadges = db.getUserBadges(userId);
    const allBadges = db.getBadges();

    return userBadges.map(ub => ({
      ...ub,
      badge: ub.badge || allBadges.find(b => b.id === ub.badgeId)!,
    })).filter(ub => Boolean(ub.badge));
  },
};

export const challengeService = {
  async getChallenges(): Promise<Challenge[]> {
    await delay(40);
    return db.getChallenges();
  },

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    await delay(40);
    return db.getUserChallenges(userId);
  },

  async joinChallenge(challengeId: string, userId: string): Promise<UserChallenge> {
    await delay(80);
    const list = db.getUserChallenges();
    const existing = list.find(c => c.challengeId === challengeId && c.userId === userId);
    if (existing) return existing;

    const newUc: UserChallenge = {
      id: `uc-${Date.now()}`,
      userId,
      challengeId,
      status: 'JOINED',
      completedAt: null,
      progress: 25,
    };

    list.push(newUc);
    db.saveUserChallenges(list);
    return newUc;
  },

  async claimReward(challengeId: string, userId: string): Promise<{
    user: User;
    userChallenge: UserChallenge;
    pointsAwarded: number;
    newBadges: Badge[];
  }> {
    await delay(100);
    const list = db.getUserChallenges();
    const ucIndex = list.findIndex(c => c.challengeId === challengeId && c.userId === userId);
    if (ucIndex === -1) {
      throw new Error('You must join this challenge first.');
    }
    if (list[ucIndex].status === 'COMPLETED') {
      throw new Error('Reward has already been claimed for this challenge.');
    }

    const challenge = db.getChallenges().find(c => c.id === challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    // Mark as completed
    list[ucIndex] = {
      ...list[ucIndex],
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      progress: 100,
    };
    db.saveUserChallenges(list);

    // Award bonus reward points
    const newTotalPoints = user.totalPoints + challenge.rewardPoints;
    const updatedUser = db.updateUser(user.id, {
      totalPoints: newTotalPoints,
    });

    // Check rank and badges
    const allStudents = db.getUsers().filter(u => u.role === 'STUDENT');
    const sorted = [...allStudents].sort((a, b) => b.totalPoints - a.totalPoints);
    const currentRank = sorted.findIndex(s => s.id === user.id) + 1;
    const userLogs = db.getLogs().filter(l => l.userId === user.id);
    const existingUserBadges = db.getUserBadges(user.id);
    const existingBadgeCodes = existingUserBadges
      .map(ub => db.getBadges().find(x => x.id === ub.badgeId)?.code)
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    const newBadges = evaluateBadgesToUnlock({
      user: updatedUser,
      userLogsCount: userLogs.length,
      newTotalPoints,
      newStreakCount: updatedUser.streakCount,
      currentRank,
      existingBadgeCodes,
    });

    for (const badge of newBadges) {
      db.addUserBadge({
        id: `ub-${Date.now()}-${badge.id}`,
        userId: user.id,
        badgeId: badge.id,
        badge,
        unlockedAt: new Date().toISOString(),
      });
    }

    return {
      user: updatedUser,
      userChallenge: list[ucIndex],
      pointsAwarded: challenge.rewardPoints,
      newBadges,
    };
  },

  async createChallenge(input: ChallengeCreateInput, adminId: string): Promise<Challenge> {
    await delay(120);
    const newCh: Challenge = {
      id: `ch-${Date.now()}`,
      title: input.title,
      description: input.description,
      rewardPoints: input.rewardPoints,
      deadline: input.deadline,
      isActive: true,
      createdById: adminId,
      category: input.category === 'GENERAL' ? undefined : (input.category as any),
    };

    return db.addChallenge(newCh);
  },
};

export const analyticsService = {
  async getStudentStats(userId: string): Promise<StudentDashboardStats> {
    await delay(40);
    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    const logs = db.getLogs().filter(l => l.userId === userId);
    const impact = calculateImpactMetrics(logs);
    const milestone = calculateNextMilestone(user.totalPoints);

    // Calculate campus rank among all students
    const students = db.getUsers().filter(u => u.role === 'STUDENT');
    const sorted = [...students].sort((a, b) => b.totalPoints - a.totalPoints);
    const rank = sorted.findIndex(s => s.id === userId) + 1;

    return {
      totalPoints: user.totalPoints,
      activitiesCount: logs.length,
      campusRank: rank || 1,
      activeStreak: user.streakCount,
      divertedWeightKg: impact.totalKg,
      co2PreventedKg: impact.co2AvoidedKg,
      nextMilestone: milestone,
    };
  },

  async getCampusKPIs(): Promise<CampusKPIs> {
    await delay(50);
    const allUsers = db.getUsers();
    const students = allUsers.filter(u => u.role === 'STUDENT');
    const logs = db.getLogs();
    const bins = db.getBinStations();

    // Active recycling students: have at least 1 log
    const userIdsWithLogs = new Set(logs.map(l => l.userId));
    const activeStudentsCount = students.filter(s => userIdsWithLogs.has(s.id)).length;
    const participationRate = students.length > 0
      ? Math.round((activeStudentsCount / students.length) * 100)
      : 45;

    const totalWeightGrams = logs.reduce((sum, l) => sum + (l.estimatedWeightGrams || 0), 0);
    const totalPointsAwarded = logs.reduce((sum, l) => sum + (l.pointsEarned || 0), 0);

    return {
      totalRegisteredStudents: students.length,
      activeRecyclingStudents: activeStudentsCount,
      participationRate,
      awarenessRate: 95, // Academic baseline statistic from survey
      totalDivertedKg: Number((totalWeightGrams / 1000).toFixed(1)),
      totalPointsAwarded,
      totalActivitiesLogged: logs.length,
      verifiedStationsCount: bins.filter(b => b.isActive).length,
    };
  },

  async getLeaderboard(filter: 'all' | 'monthly' | 'weekly' = 'all') {
    await delay(40);
    const students = db.getUsers().filter(u => u.role === 'STUDENT');
    const logs = db.getLogs();
    const userBadges = db.getUserBadges();

    const now = Date.now();
    const oneWeekMs = 7 * 86400000;
    const oneMonthMs = 30 * 86400000;

    return students.map(student => {
      let filteredLogs = logs.filter(l => l.userId === student.id);
      if (filter === 'weekly') {
        filteredLogs = filteredLogs.filter(l => now - new Date(l.createdAt).getTime() <= oneWeekMs);
      } else if (filter === 'monthly') {
        filteredLogs = filteredLogs.filter(l => now - new Date(l.createdAt).getTime() <= oneMonthMs);
      }

      const points = filter === 'all'
        ? student.totalPoints
        : filteredLogs.reduce((sum, l) => sum + l.pointsEarned, 0);

      const badgesCount = userBadges.filter(b => b.userId === student.id).length;

      return {
        ...student,
        displayPoints: points,
        periodLogsCount: filteredLogs.length,
        badgesCount,
      };
    }).sort((a, b) => b.displayPoints - a.displayPoints);
  },
};
