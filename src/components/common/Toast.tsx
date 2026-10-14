import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-slide-up ${
              isSuccess
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : isError
                ? 'bg-red-50/95 border-red-200 text-red-900'
                : isWarning
                ? 'bg-amber-50/95 border-amber-200 text-amber-900'
                : 'bg-slate-50/95 border-slate-200 text-slate-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <XCircle className="w-5 h-5 text-red-600" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              <p className="mt-0.5 opacity-90 text-xs leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
