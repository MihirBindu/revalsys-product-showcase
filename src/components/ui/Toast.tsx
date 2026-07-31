"use client";

import { useEffect } from "react";
import Link from "next/link";

export interface ToastAction {
  href?: string;
  label: string;
  onSelect?: () => void;
}

export interface ToastProps {
  actions?: ToastAction[];
  duration?: number;
  message: string;
  onDismiss: () => void;
}

export default function Toast({
  actions = [],
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
      className="fixed left-4 right-4 top-20 z-50 flex items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg sm:left-auto sm:max-w-md"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700"
      >
        ✓
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{message}</p>
        {actions.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {actions.map((action) =>
              action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={onDismiss}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    onDismiss();
                    action.onSelect?.();
                  }}
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
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
