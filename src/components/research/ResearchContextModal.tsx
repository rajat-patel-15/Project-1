import React from 'react';
import { 
  BarChart, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Compass, 
  Cpu, 
  ExternalLink, 
  Globe, 
  GraduationCap, 
  Leaf, 
  LineChart, 
  PieChart, 
  Sparkles, 
  Target, 
  Users 
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface ResearchContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchContextModal: React.FC<ResearchContextModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EcoTrack Academic Research & Methodology"
      subtitle="Transdisciplinary Framework: Assessment & Action of Environmental Awareness Among Students"
      maxWidth="3xl"
    >
      <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        {/* Core Empirical Problem Statement */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-forest text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300">
              <Target className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              The "Awareness–Action Paradox" on University Campuses
            </h4>
          </div>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Baseline campus survey data demonstrates that while <strong>95% of undergraduate students express high self-reported environmental concern</strong>, actual physical recycling participation across residence halls and dining complexes stagnates at only <strong>45%</strong>.
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span>Stated Awareness: <strong>95%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Observed Participation: <strong>45%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <span>Behavioral Gap: <strong>50% Disconnect</strong></span>
            </div>
          </div>
        </div>

        {/* 4 TRANSDISCIPLINARY PILLARS */}
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>The Four Academic Pillars of EcoTrack</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Pillar 1: Environmental Science */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>1. Environmental Science</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporates strict Material Recovery Facility (MRF) segregation rules. Distinguishes wishcycling contaminants (e.g. grease-soaked pizza boxes, poly-lined coffee cups) from circular feedstocks. Utilizes EPA Waste Reduction Models (WARM) to convert grams diverted into real avoided CO₂e emissions.
              </p>
            </div>

            {/* Pillar 2: Behavioral Psychology */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide mb-1.5">
                <Brain className="w-4 h-4 text-amber-600" />
                <span>2. Behavioral Psychology</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies Thaler & Sunstein’s Nudge Theory, habit-loop conditioning, and loss-aversion mechanics (maintaining consecutive active streaks). Public, peer-visible leaderboards utilize constructive social comparison to transform solitary eco-intentions into normalized campus culture.
              </p>
            </div>

            {/* Pillar 3: Computer Science */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wide mb-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>3. Computer Science</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Architected with modern componentized React, TypeScript type safety, Zod payload schema validation, deterministic point/streak state machines, and optical camera-based physical QR station verification preventing false claims and bad data telemetry.
              </p>
            </div>

            {/* Pillar 4: Data Science */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wide mb-1.5">
                <LineChart className="w-4 h-4 text-purple-600" />
                <span>4. Data Science</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Constructs longitudinal diversion time-series and institutional audit logs. Enables university sustainability officers to export structured CSV telemetry for collegiate ESG ratings, waste hauling contracts, and municipal compliance reporting.
              </p>
            </div>
          </div>
        </div>

        {/* Deterministic Gamification Rules Table */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h5 className="font-bold text-slate-900 text-xs mb-2">
            Mathematical Engine Specification (Transparent & Deterministic)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Plastic (PET/HDPE)</span>
              <strong className="text-slate-900">10 Base Pts</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Paper & Boxboard</span>
              <strong className="text-slate-900">8 Base Pts</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Metal & Aluminum</span>
              <strong className="text-slate-900">15 Base Pts</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">E-Waste & Batteries</span>
              <strong className="text-slate-900">25 Base Pts</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Multipliers scale progressively from 1.0x (&lt;100g) up to 5.0x (&gt;5kg) to incentivize bulk dormitory move-out diversion.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="eco-button-primary text-xs py-2 px-5"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </Modal>
  );
};
