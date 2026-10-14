import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  ChevronDown, 
  Flame, 
  GraduationCap, 
  LayoutDashboard, 
  Leaf, 
  LineChart, 
  LogOut, 
  PlusCircle, 
  QrCode, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  UserCheck, 
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEED_USERS } from '../../constants/seedData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogModal: () => void;
  onOpenQRScanner: () => void;
  onOpenAuthModal: () => void;
  onOpenResearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenQRScanner,
  onOpenAuthModal,
  onOpenResearchModal,
}) => {
  const { user, role, demoLogin, logout, switchUser, resetDatabase } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const studentsList = SEED_USERS.filter(u => u.role === 'STUDENT');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Banner: Academic Research Context ticker */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-2xl">
          <span className="bg-emerald-700/80 text-emerald-100 uppercase tracking-wider text-[10px] font-bold px-1.5 py-0.5 rounded">
            Institutional Research
          </span>
          <span className="opacity-90 hidden sm:inline">
            Bridging the gap: 95% environmental awareness vs. 45% campus recycling participation.
          </span>
          <span className="opacity-90 sm:hidden">
            EcoTrack Campus Research Initiative
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenResearchModal}
            className="flex items-center gap-1 text-emerald-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>About Research</span>
          </button>

          <span className="text-emerald-700">|</span>

          {/* Quick Demo Switcher Pill */}
          {role === 'STUDENT' ? (
            <button
              onClick={() => demoLogin('ADMIN')}
              className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-emerald-600/50"
              title="Switch directly to College Admin View"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Demo Admin</span>
            </button>
          ) : (
            <button
              onClick={() => demoLogin('STUDENT')}
              className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-emerald-600/50"
              title="Switch directly to Student View (Aarav)"
            >
              <GraduationCap className="w-3 h-3 text-emerald-300" />
              <span>Demo Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-eco group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                    Eco<span className="text-emerald-600">Track</span>
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none hidden md:block">
                  Assessment & Action of Student Environmental Awareness
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{role === 'ADMIN' ? 'Admin Portal' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'education'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn Recycling</span>
            </button>

            <button
              onClick={() => setActiveTab('gamification')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'gamification'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard & Challenges</span>
            </button>

            {role === 'STUDENT' && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>My Impact</span>
              </button>
            )}

            {role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'audit'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Campus Audit Table</span>
              </button>
            )}
          </nav>

          {/* Action CTAs & Profile Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick QR Scanner & Log Action */}
            {role === 'STUDENT' && (
              <>
                <button
                  onClick={onOpenQRScanner}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/80"
                  title="Scan physical QR code on campus recycling bin"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Scan Station</span>
                </button>

                <button
                  onClick={onOpenLogModal}
                  className="eco-button-primary text-xs sm:text-sm py-2 px-3.5 gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Activity</span>
                </button>
              </>
            )}

            {/* User Profile / Status Capsule */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80 focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="relative">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20"
                    />
                    {user.streakCount > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full flex items-center shadow-xs">
                        {user.streakCount}
                      </span>
                    )}
                  </div>

                  <div className="text-left hidden sm:block pr-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </p>
                    {role === 'STUDENT' ? (
                      <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 leading-none">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                        <span>{user.totalPoints} pts</span>
                      </p>
                    ) : (
                      <p className="text-[10px] font-semibold text-amber-600 leading-none">
                        Admin Officer
                      </p>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {user.department && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          {user.department}
                        </p>
                      )}
                      {role === 'STUDENT' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500" /> Streak:
                          </span>
                          <span className="font-bold text-amber-600">{user.streakCount} days</span>
                        </div>
                      )}
                    </div>

                    {/* Quick switch between students to test multi-student states */}
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Switch Student Profile
                      </p>
                      <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                        {studentsList.slice(0, 6).map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              switchUser(s.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`text-left px-2 py-1 rounded text-xs truncate transition-colors ${
                              s.id === user.id
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : 'hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s.name.split(' ')[0]} ({s.totalPoints}p)
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          resetDatabase();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Seed Data</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="eco-button-primary text-xs sm:text-sm py-2 px-3"
              >
                <UserIcon className="w-4 h-4 mr-1.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/80 px-2 py-1.5 flex items-center justify-around overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 ${
            activeTab === 'dashboard' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>{role === 'ADMIN' ? 'Admin' : 'Dashboard'}</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 ${
            activeTab === 'education' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => setActiveTab('gamification')}
          className={`px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 ${
            activeTab === 'gamification' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Ranks</span>
        </button>

        {role === 'STUDENT' ? (
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Impact</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 ${
              activeTab === 'audit' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>
        )}
      </div>
    </header>
  );
};
