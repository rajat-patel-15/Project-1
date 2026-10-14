import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  GraduationCap, 
  HelpCircle, 
  LayoutDashboard, 
  Leaf, 
  LineChart, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PersonalAnalytics } from './components/analytics/PersonalAnalytics';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
import { LogRecyclingModal } from './components/dashboard/LogRecyclingModal';
import { QRScannerModal } from './components/dashboard/QRScannerModal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { EducationEngine } from './components/education/EducationEngine';
import { GamificationPortal } from './components/gamification/GamificationPortal';
import { ResearchContextModal } from './components/research/ResearchContextModal';
import { useAuth } from './context/AuthContext';
import { BinStation } from './types';

export const App: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [preselectedStation, setPreselectedStation] = useState<BinStation | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStationVerified = (station: BinStation) => {
    setPreselectedStation(station);
    setIsLogModalOpen(true);
  };

  const handleLogSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => {
          setPreselectedStation(null);
          setIsLogModalOpen(true);
        }}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenResearchModal={() => setIsResearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Render Tab based on activeTab and User Role */}
        {role === 'ADMIN' ? (
          <>
            {activeTab === 'dashboard' || activeTab === 'audit' ? (
              <AdminDashboard />
            ) : activeTab === 'education' ? (
              <EducationEngine />
            ) : activeTab === 'gamification' ? (
              <GamificationPortal />
            ) : (
              <AdminDashboard />
            )}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                onOpenLogModal={() => {
                  setPreselectedStation(null);
                  setIsLogModalOpen(true);
                }}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
                onNavigateToEducation={() => setActiveTab('education')}
                onNavigateToGamification={() => setActiveTab('gamification')}
                refreshTrigger={refreshTrigger}
              />
            )}

            {activeTab === 'education' && <EducationEngine />}

            {activeTab === 'gamification' && <GamificationPortal />}

            {activeTab === 'analytics' && <PersonalAnalytics />}
          </>
        )}
      </main>

      {/* Modals */}
      <LogRecyclingModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        preselectedStation={preselectedStation}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onSuccess={handleLogSuccess}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onSelectStation={handleStationVerified}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ResearchContextModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">
              EcoTrack — Campus Environmental Action System
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsResearchModalOpen(true)}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Research Framework</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('education')}
              className="hover:text-emerald-700 transition-colors"
            >
              Sorting Glossary
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('gamification')}
              className="hover:text-emerald-700 transition-colors"
            >
              Leaderboard
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Bridging 95% awareness to 45% participation. Open Academic Demo.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default App;
