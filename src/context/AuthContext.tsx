import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api';
import { db } from '../services/storage';
import { Role, User } from '../types';
import { LoginInput, RegisterInput } from '../utils/validation';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  toasts: ToastMessage[];
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  demoLogin: (role: 'STUDENT' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetDatabase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadCurrentUser = async () => {
    try {
      setIsLoading(true);
      const current = await authService.getCurrentUser();
      setUser(current);
    } catch (err) {
      console.error('Failed to load current user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();

    const handleAuthChange = () => {
      loadCurrentUser();
    };

    window.addEventListener('ecotrack_auth_changed', handleAuthChange);
    window.addEventListener('ecotrack_db_updated', handleAuthChange);

    return () => {
      window.removeEventListener('ecotrack_auth_changed', handleAuthChange);
      window.removeEventListener('ecotrack_db_updated', handleAuthChange);
    };
  }, []);

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await authService.login(input);
      setUser(res.user);
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Signed in as ${res.user.name} (${res.user.role}).`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await authService.register(input);
      setUser(res.user);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to EcoTrack, ${res.user.name}! Start logging your recycling actions.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: 'STUDENT' | 'ADMIN') => {
    setIsLoading(true);
    try {
      const res = await authService.demoLogin(role);
      setUser(res.user);
      addToast({
        type: 'info',
        title: `Switched to Demo ${role}`,
        message: `Logged in as ${res.user.name} (${role}).`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.',
    });
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const switched = await authService.switchUser(userId);
      setUser(switched);
      addToast({
        type: 'info',
        title: 'Profile Switched',
        message: `Now viewing as ${switched.name} (${switched.role}).`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      const fresh = db.getUserById(user.id);
      if (fresh) setUser({ ...fresh });
    }
  };

  const resetDatabase = () => {
    db.resetToDefaults();
    loadCurrentUser();
    addToast({
      type: 'warning',
      title: 'Database Reset',
      message: 'EcoTrack database has been restored to default research seed state.',
    });
  };

  const role: Role = user?.role || 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        toasts,
        login,
        register,
        demoLogin,
        logout,
        switchUser,
        refreshUser,
        addToast,
        removeToast,
        resetDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
