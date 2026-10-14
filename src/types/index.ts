export type Role = 'STUDENT' | 'ADMIN';

export type WasteType = 'PLASTIC' | 'PAPER' | 'GLASS' | 'METAL' | 'E_WASTE' | 'OTHER';

export type QuantityBracket = '<100g' | '100-500g' | '500g-1kg' | '1-5kg' | '>5kg';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: Role;
  totalPoints: number;
  streakCount: number;
  lastActiveDate: string | null; // ISO Date YYYY-MM-DD
  createdAt: string;
  avatarUrl?: string;
  department?: string;
  studentId?: string;
}

export interface BinStation {
  id: string;
  qrCode: string; // e.g. "BIN-COLLEGE-001"
  name: string;
  locationDescription: string;
  acceptedTypes: WasteType[];
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

export interface RecyclingLog {
  id: string;
  userId: string;
  userName?: string;
  wasteType: WasteType;
  quantityBracket: QuantityBracket;
  estimatedWeightGrams: number;
  location: string;
  binStationId: string | null;
  binStationName?: string;
  pointsEarned: number;
  verified: boolean;
  notes?: string;
  createdAt: string; // ISO string
}

export type BadgeCode = 
  | 'ECO_STARTER'
  | 'RECYCLER'
  | 'GREEN_CHAMPION'
  | 'ECO_STREAK'
  | 'SUSTAINABILITY_LEADER';

export interface Badge {
  id: string;
  code: BadgeCode;
  title: string;
  description: string;
  icon: string;
  criteriaType: 'LOG_COUNT' | 'POINTS' | 'STREAK' | 'RANK';
  criteriaThreshold: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge?: Badge;
  unlockedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  deadline: string; // ISO date
  isActive: boolean;
  createdById: string;
  category?: WasteType | 'GENERAL';
  targetCount?: number;
}

export type ChallengeStatus = 'AVAILABLE' | 'JOINED' | 'CLAIMABLE' | 'COMPLETED';

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'JOINED' | 'COMPLETED';
  completedAt: string | null;
  progress?: number;
}

export interface ItemGuide {
  id: string;
  name: string;
  category: WasteType;
  recyclable: boolean;
  instructions: string;
  prepSteps: string[];
  commonMisconceptions?: string;
  ecoTip: string;
  tags: string[];
}

export interface StudentDashboardStats {
  totalPoints: number;
  activitiesCount: number;
  campusRank: number;
  activeStreak: number;
  divertedWeightKg: number;
  co2PreventedKg: number;
  nextMilestone: {
    title: string;
    targetPoints: number;
    currentPoints: number;
    pointsNeeded: number;
    progressPercentage: number;
  };
}

export interface CampusKPIs {
  totalRegisteredStudents: number;
  activeRecyclingStudents: number;
  participationRate: number; // e.g. 45%
  awarenessRate: number; // 95%
  totalDivertedKg: number;
  totalPointsAwarded: number;
  totalActivitiesLogged: number;
  verifiedStationsCount: number;
}
