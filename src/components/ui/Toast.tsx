'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { createId } from '@/lib/id';

type ToastKind = 'success' | 'error';

interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = createId();
      setToasts((prev) => [...prev, { id, kind, message }]);
      const timer = setTimeout(() => dismiss(id), DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
      pending.clear();
    };
  }, []);

  const value: ToastContextValue = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:pr-6"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }
  return ctx;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const Icon = toast.kind === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border bg-surface px-4 py-3 text-sm shadow-sm',
        toast.kind === 'success' && 'border-accent/30',
        toast.kind === 'error' && 'border-danger/30',
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          toast.kind === 'success' ? 'text-accent' : 'text-danger',
        )}
        strokeWidth={1.75}
      />
      <p className="flex-1 text-ink">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-ink-muted transition-colors duration-150 ease-out hover:text-ink"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
