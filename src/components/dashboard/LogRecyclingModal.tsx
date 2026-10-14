import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  AlertCircle, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  MapPin, 
  QrCode, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  Trash2 
} from 'lucide-react';
import { BASE_POINTS, QUANTITY_MULTIPLIERS } from '../../constants/gamification';
import { useAuth } from '../../context/AuthContext';
import { logService } from '../../services/api';
import { BinStation, QuantityBracket, WasteType } from '../../types';
import { calculatePoints } from '../../utils/calculations';
import { recyclingLogSchema } from '../../utils/validation';
import { Modal } from '../common/Modal';

interface LogRecyclingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStation?: BinStation | null;
  onOpenQRScanner: () => void;
  onSuccess: () => void;
}

export const LogRecyclingModal: React.FC<LogRecyclingModalProps> = ({
  isOpen,
  onClose,
  preselectedStation,
  onOpenQRScanner,
  onSuccess,
}) => {
  const { user, addToast, refreshUser } = useAuth();

  const [wasteType, setWasteType] = useState<WasteType>('PLASTIC');
  const [quantityBracket, setQuantityBracket] = useState<QuantityBracket>('100-500g');
  const [location, setLocation] = useState('Main Academic Quad Station');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [verifiedStation, setVerifiedStation] = useState<BinStation | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync preselected station if provided
  useEffect(() => {
    if (preselectedStation) {
      setVerifiedStation(preselectedStation);
      setLocation(preselectedStation.name);
    }
  }, [preselectedStation]);

  // Live calculation preview
  const preview = calculatePoints(wasteType, quantityBracket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to log recycling activities.');
      return;
    }
    setError(null);

    const validation = recyclingLogSchema.safeParse({
      wasteType,
      quantityBracket,
      location,
      binStationId: verifiedStation?.qrCode || null,
      date,
      notes: notes.trim() || undefined,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please verify form inputs');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await logService.createLog(validation.data, user.id);
      await refreshUser();

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#16a34a', '#10b981', '#34d399', '#f59e0b'],
      });

      // Show toast
      addToast({
        type: 'success',
        title: `+${result.log.pointsEarned} Eco Points Earned!`,
        message: `${result.streakInfo.message}`,
      });

      // Announce any new badges unlocked
      if (result.newBadges && result.newBadges.length > 0) {
        for (const badge of result.newBadges) {
          addToast({
            type: 'info',
            title: `🏆 Badge Unlocked: ${badge.title}!`,
            message: badge.description,
            duration: 6000,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit recycling log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Campus Recycling Activity"
      subtitle="Accurate reporting trains institutional waste management and drives your eco-streak."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Physical Station Verification Status Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            {verifiedStation ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-800">
                    Station Verified: {verifiedStation.qrCode}
                  </span>
                  <p className="text-[10px] text-slate-500">{verifiedStation.name}</p>
                </div>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Unverified Physical Location</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {verifiedStation ? (
              <button
                type="button"
                onClick={() => setVerifiedStation(null)}
                className="text-[11px] text-slate-500 hover:text-red-600 underline"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQRScanner();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Bin QR</span>
              </button>
            )}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Waste Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Waste Category
            </label>
            <select
              value={wasteType}
              onChange={e => setWasteType(e.target.value as WasteType)}
              className="eco-input font-medium"
            >
              <option value="PLASTIC">Plastic (Bottles, Containers, Film)</option>
              <option value="PAPER">Paper & Cardboard (Books, Boxes, Notes)</option>
              <option value="GLASS">Glass (Bottles, Jars)</option>
              <option value="METAL">Metal (Aluminum cans, Steel, Foil)</option>
              <option value="E_WASTE">E-Waste (Cables, Batteries, Boards)</option>
              <option value="OTHER">Other Sorted Inorganics</option>
            </select>
          </div>

          {/* Quantity Bracket */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity / Estimated Bracket
            </label>
            <select
              value={quantityBracket}
              onChange={e => setQuantityBracket(e.target.value as QuantityBracket)}
              className="eco-input font-medium"
            >
              <option value="<100g">&lt;100g (Est. 50g — 1.0x multiplier)</option>
              <option value="100-500g">100–500g (Est. 300g — 1.5x multiplier)</option>
              <option value="500g-1kg">500g–1kg (Est. 750g — 2.5x multiplier)</option>
              <option value="1-5kg">1–5kg (Est. 3000g — 4.0x multiplier)</option>
              <option value=">5kg">&gt;5kg (Est. 6000g — 5.0x multiplier)</option>
            </select>
          </div>

          {/* Location Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campus Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Science Complex Floor 2"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Activity
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Observations <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Emptied dorm room recycling bin into floor hopper"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="eco-input text-xs"
            maxLength={250}
          />
        </div>

        {/* LIVE CALCULATION PREVIEW BOX */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/5 border border-emerald-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Live Gamification Calculation Preview</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Deterministic Formula
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg border border-emerald-100">
              <p className="text-[10px] text-slate-500">Base Points</p>
              <p className="text-sm font-bold text-slate-800">{preview.basePoints} pts</p>
              <p className="text-[9px] text-slate-400">{wasteType}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg border border-emerald-100">
              <p className="text-[10px] text-slate-500">Weight Multiplier</p>
              <p className="text-sm font-bold text-slate-800">{preview.multiplier}x</p>
              <p className="text-[9px] text-slate-400">~{preview.estimatedWeightGrams}g</p>
            </div>

            <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm">
              <p className="text-[10px] text-emerald-100">You Will Earn</p>
              <p className="text-lg font-black leading-tight">+{preview.points} pts</p>
              <p className="text-[9px] text-emerald-200">Math.round({preview.basePoints} × {preview.multiplier})</p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 border-t border-emerald-200/50 pt-2">
            <span>Diverted Landfill Impact:</span>
            <span className="font-semibold text-emerald-800">
              {(preview.estimatedWeightGrams / 1000).toFixed(2)} kg waste diverted
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="eco-button-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="eco-button-primary text-xs px-5 py-2.5 gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording Activity...' : 'Submit & Earn Points'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
