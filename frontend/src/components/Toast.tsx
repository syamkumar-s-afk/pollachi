import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Types ─── */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  exiting?: boolean;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

/* ─── Context ─── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

/* ─── Toast Config ─── */

const DURATION_MS = 4000;
const EXIT_MS = 250;

let nextId = 0;

const ICON_MAP: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-600',
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-600',
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    bar: 'bg-blue-500',
  },
};

/* ─── Provider ─── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeToast(id), DURATION_MS);
    },
    [removeToast]
  );

  const value: ToastContextValue = {
    success: (title, message) => addToast('success', title, message),
    error: (title, message) => addToast('error', title, message),
    warning: (title, message) => addToast('warning', title, message),
    info: (title, message) => addToast('info', title, message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-[380px] max-w-[calc(100vw-32px)] pointer-events-none"
        aria-live="polite"
        role="status"
      >
        {toasts.map((toast) => {
          const Icon = ICON_MAP[toast.type];
          const colors = COLOR_MAP[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto ${
                toast.exiting ? 'toast-exit' : 'toast-enter'
              } ${colors.bg} border rounded-xl shadow-lg overflow-hidden`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className={`flex-shrink-0 mt-0.5 ${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-black/5">
                <div
                  className={`h-full ${colors.bar} rounded-full`}
                  style={{
                    animation: `shrinkBar ${DURATION_MS}ms linear forwards`,
                  }}
                />
              </div>
              <style>{`
                @keyframes shrinkBar {
                  from { width: 100%; }
                  to   { width: 0%; }
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
