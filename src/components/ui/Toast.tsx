"use client";

import { useEffect } from "react";

interface ToastProps {
  duration?: number;
  message: string;
  onDismiss: () => void;
}

export default function Toast({
  duration = 4000,
  message,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-atomic="true"
      className="fixed left-4 right-4 top-20 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg sm:left-auto sm:max-w-sm"
    >
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700"
      >
        ✓
      </span>
      <p className="flex-1 font-medium">{message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <span aria-hidden className="select-none">
          ×
        </span>
      </button>
    </div>
  );
}
