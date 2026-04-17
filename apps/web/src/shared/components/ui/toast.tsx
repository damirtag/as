import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  type: ToastType;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-yellow-400 shrink-0" />,
  error: <XCircle size={16} className="text-red-400 shrink-0" />,
  warning: <AlertCircle size={16} className="text-amber-400 shrink-0" />,
  info: <Info size={16} className="text-zinc-400 shrink-0" />,
};

interface ToastProps extends ToastItem {
  onClose: () => void;
}

function Toast({
  type,
  title,
  description,
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (duration > 0) timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 shadow-xl shadow-black/40 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {ICONS[type]}
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium text-zinc-100">{title}</p>}
        {description && (
          <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-zinc-600 hover:text-zinc-300 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

const toastStore = {
  _toasts: [] as ToastItem[],
  _listeners: [] as ((t: ToastItem[]) => void)[],

  subscribe(fn: (t: ToastItem[]) => void) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== fn);
    };
  },

  _emit() {
    this._listeners.forEach((fn) => fn([...this._toasts]));
  },

  add(toast: Omit<ToastItem, "id">) {
    const id = Date.now() + Math.random();
    this._toasts.push({ ...toast, id });
    this._emit();
  },

  remove(id: number) {
    this._toasts = this._toasts.filter((t) => t.id !== id);
    this._emit();
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => toastStore.remove(t.id)} />
      ))}
    </div>
  );
}

export function useToast() {
  return {
    toast: {
      success: (opts: ToastOptions) =>
        toastStore.add({ type: "success", ...opts }),
      error: (opts: ToastOptions) => toastStore.add({ type: "error", ...opts }),
      warning: (opts: ToastOptions) =>
        toastStore.add({ type: "warning", ...opts }),
      info: (opts: ToastOptions) => toastStore.add({ type: "info", ...opts }),
    },
  };
}

export default Toast;
