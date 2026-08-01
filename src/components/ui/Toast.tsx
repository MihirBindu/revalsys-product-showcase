"use client";

import { useEffect, useState } from "react";  
import Link from "next/link";

export interface ToastAction {
  href?: string;
  label: string;
  onSelect?: () => void;
}

export interface ToastProps {
  actions?: ToastAction[];
  /** Epoch ms; when set, the toast renders a live countdown to this instant. */
  countdownTo?: number;
  duration?: number;
  message: string;
  onDismiss: () => void;
}

export default function Toast({
  actions = [],
  countdownTo,
  duration = 4000,
  message,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  const [remaining, setRemaining] = useState(() =>
    countdownTo === undefined
      ? 0
      : Math.max(0, Math.ceil((countdownTo - Date.now()) / 1000))
  );
  // Captured once so the progress bar has a denominator that can't shift.
  const [totalSeconds] = useState(() => Math.max(1, remaining));   

  useEffect(() => {
    if (countdownTo === undefined) return;
    // Sub-second polling so the displayed number never skips or lags a tick.
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((countdownTo - Date.now()) / 1000)));
    }, 250);
    return () => window.clearInterval(id);
  }, [countdownTo]);

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
        {countdownTo !== undefined && (
          // aria-hidden: the parent is role="status" + aria-atomic, so a
          // ticking number would re-announce the whole toast every second.
          // The message text carries the duration for screen readers.
          <div aria-hidden className="mt-2">
            <p className="text-xs font-semibold tabular-nums text-emerald-700">
              Adding in {remaining}s
            </p>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width] duration-200 ease-linear"
                style={{ width: `${(remaining / totalSeconds) * 100}%` }}   
              />
            </div>
          </div>
        )}
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