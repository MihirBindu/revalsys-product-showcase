"use client";

import { useId, type ReactNode } from "react";

interface FieldShellProps {
  children: ReactNode;
  error?: string;
  errorId: string;
  fieldId: string;
  label?: string;
}

export function useFieldIds(id: string | undefined) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return { fieldId, errorId: `${fieldId}-error` };
}

export function fieldControlClass(error?: string, className = "") {
  const stateClass = error
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100";

  return `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${stateClass} ${className}`;
}

export function FieldShell({
  children,
  error,
  errorId,
  fieldId,
  label,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
