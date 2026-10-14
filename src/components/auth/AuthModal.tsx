import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, ShieldCheck, Sparkles, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { loginSchema, registerSchema } from '../../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please verify form inputs');
      return;
    }

    try {
      setSubmitting(true);
      await login(validation.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = registerSchema.safeParse({
      name,
      email: regEmail,
      password: regPassword,
      department,
      studentId,
      role,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please verify form inputs');
      return;
    }

    try {
      setSubmitting(true);
      await register(validation.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (roleType: 'STUDENT' | 'ADMIN') => {
    setError(null);
    try {
      setSubmitting(true);
      await demoLogin(roleType);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'LOGIN' ? 'Sign in to EcoTrack' : 'Join EcoTrack Campus Movement'}
      subtitle="Track your verified recycling habits, earn eco-points, and compete on the campus leaderboard."
      maxWidth="md"
    >
      {/* 1-Click Demo Login Section */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border border-emerald-200">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Instant 1-Click Demo Profiles</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Explore the app instantly without entering passwords:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleDemo('STUDENT')}
            disabled={submitting}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 leading-tight">Student Demo</p>
              <p className="text-[10px] text-slate-500 truncate">Aarav (420 pts, 6d streak)</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('ADMIN')}
            disabled={submitting}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-amber-300 hover:border-amber-500 hover:shadow-sm text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 group-hover:bg-amber-600 group-hover:text-white text-amber-700 flex items-center justify-center shrink-0 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 leading-tight">Admin Demo</p>
              <p className="text-[10px] text-slate-500 truncate">Dean Evelyn (Audit & KPIs)</p>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          type="button"
          onClick={() => {
            setMode('LOGIN');
            setError(null);
          }}
          className={`pb-2.5 text-sm font-semibold flex-1 border-b-2 transition-colors ${
            mode === 'LOGIN'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('REGISTER');
            setError(null);
          }}
          className={`pb-2.5 text-sm font-semibold flex-1 border-b-2 transition-colors ${
            mode === 'REGISTER'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Create Student Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {mode === 'LOGIN' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="student@ecotrack.demo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hint: student123 or admin123</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full eco-button-primary mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Maya Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="eco-input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll No</label>
              <input
                type="text"
                placeholder="e.g. CS24-102"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="eco-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">College Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="maya@college.edu"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="eco-input"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Environmental Science">Environmental Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Civil Infrastructure">Civil Infrastructure</option>
              <option value="Business & Economics">Business & Economics</option>
              <option value="Liberal Arts & Design">Liberal Arts & Design</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="eco-input pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
            <div className="flex gap-4 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={() => setRole('ADMIN')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Campus Admin / Faculty</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full eco-button-primary mt-2"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>{submitting ? 'Registering...' : 'Create Account'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
};
