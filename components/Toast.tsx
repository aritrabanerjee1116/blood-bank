'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { ToastMessage } from '@/lib/types';

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />,
  error: <AlertCircle className="w-5 h-5 text-[var(--color-danger)]" />,
  warning: <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />,
  info: <Info className="w-5 h-5 text-[var(--color-info)]" />,
};

const borderColors = {
  success: 'border-l-[var(--color-success)]',
  error: 'border-l-[var(--color-danger)]',
  warning: 'border-l-[var(--color-warning)]',
  info: 'border-l-[var(--color-info)]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[200] space-y-2 w-[360px] max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass-card p-4 border-l-4 ${borderColors[toast.type]} animate-slide-right flex items-start gap-3`}
          >
            <span className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 text-[var(--color-muted)] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
