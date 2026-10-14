import { INITIAL_BIN_STATIONS, INITIAL_CHALLENGES, SYSTEM_BADGES } from '../constants/gamification';
import { SEED_LOGS, SEED_USER_BADGES, SEED_USER_CHALLENGES, SEED_USERS } from '../constants/seedData';
import { Badge, BinStation, Challenge, RecyclingLog, User, UserBadge, UserChallenge } from '../types';

const STORAGE_KEYS = {
  USERS: 'ecotrack_users_v1',
  LOGS: 'ecotrack_logs_v1',
  BADGES: 'ecotrack_badges_v1',
  USER_BADGES: 'ecotrack_user_badges_v1',
  CHALLENGES: 'ecotrack_challenges_v1',
  USER_CHALLENGES: 'ecotrack_user_challenges_v1',
  BIN_STATIONS: 'ecotrack_bin_stations_v1',
  CURRENT_USER_ID: 'ecotrack_current_user_id_v1',
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Initialize storage with rich demo seeds if empty
  public init(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS));
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(SYSTEM_BADGES));
    localStorage.setItem(STORAGE_KEYS.USER_BADGES, JSON.stringify(SEED_USER_BADGES));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.USER_CHALLENGES, JSON.stringify(SEED_USER_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.BIN_STATIONS, JSON.stringify(INITIAL_BIN_STATIONS));
    // Default to Aarav (Student demo)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-aarav');

    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }

  // USERS
  public getUsers(): User[] {
    if (!this.isBrowser()) return SEED_USERS;
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : SEED_USERS;
  }

  public saveUsers(users: User[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updated = { ...users[index], ...updates };
    users[index] = updated;
    this.saveUsers(users);
    return updated;
  }

  // CURRENT AUTH USER
  public getCurrentUserId(): string {
    if (!this.isBrowser()) return 'user-aarav';
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-aarav';
  }

  public setCurrentUserId(userId: string | null): void {
    if (!this.isBrowser()) return;
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    window.dispatchEvent(new Event('ecotrack_auth_changed'));
  }

  // RECYCLING LOGS
  public getLogs(): RecyclingLog[] {
    if (!this.isBrowser()) return SEED_LOGS;
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : SEED_LOGS;
  }

  public saveLogs(logs: RecyclingLog[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }

  public addLog(log: RecyclingLog): RecyclingLog {
    const logs = this.getLogs();
    logs.unshift(log);
    this.saveLogs(logs);
    return log;
  }

  public deleteLog(id: string): void {
    const logs = this.getLogs().filter(l => l.id !== id);
    this.saveLogs(logs);
  }

  // BIN STATIONS
  public getBinStations(): BinStation[] {
    if (!this.isBrowser()) return INITIAL_BIN_STATIONS;
    const data = localStorage.getItem(STORAGE_KEYS.BIN_STATIONS);
    return data ? JSON.parse(data) : INITIAL_BIN_STATIONS;
  }

  public saveBinStations(stations: BinStation[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.BIN_STATIONS, JSON.stringify(stations));
    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }

  public findBinByQRCode(qrCode: string): BinStation | undefined {
    const clean = qrCode.trim().toUpperCase();
    return this.getBinStations().find(b => b.qrCode.toUpperCase() === clean || b.id.toUpperCase() === clean);
  }

  // BADGES & USER BADGES
  public getBadges(): Badge[] {
    if (!this.isBrowser()) return SYSTEM_BADGES;
    const data = localStorage.getItem(STORAGE_KEYS.BADGES);
    return data ? JSON.parse(data) : SYSTEM_BADGES;
  }

  public getUserBadges(userId?: string): UserBadge[] {
    if (!this.isBrowser()) return SEED_USER_BADGES;
    const data = localStorage.getItem(STORAGE_KEYS.USER_BADGES);
    const badges: UserBadge[] = data ? JSON.parse(data) : SEED_USER_BADGES;
    return userId ? badges.filter(b => b.userId === userId) : badges;
  }

  public addUserBadge(userBadge: UserBadge): void {
    if (!this.isBrowser()) return;
    const badges = this.getUserBadges();
    badges.push(userBadge);
    localStorage.setItem(STORAGE_KEYS.USER_BADGES, JSON.stringify(badges));
    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }

  // CHALLENGES
  public getChallenges(): Challenge[] {
    if (!this.isBrowser()) return INITIAL_CHALLENGES;
    const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    return data ? JSON.parse(data) : INITIAL_CHALLENGES;
  }

  public addChallenge(challenge: Challenge): Challenge {
    const list = this.getChallenges();
    list.unshift(challenge);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(list));
      window.dispatchEvent(new Event('ecotrack_db_updated'));
    }
    return challenge;
  }

  public getUserChallenges(userId?: string): UserChallenge[] {
    if (!this.isBrowser()) return SEED_USER_CHALLENGES;
    const data = localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES);
    const list: UserChallenge[] = data ? JSON.parse(data) : SEED_USER_CHALLENGES;
    return userId ? list.filter(c => c.userId === userId) : list;
  }

  public saveUserChallenges(userChallenges: UserChallenge[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USER_CHALLENGES, JSON.stringify(userChallenges));
    window.dispatchEvent(new Event('ecotrack_db_updated'));
  }
}

export const db = new StorageService();
db.init();
