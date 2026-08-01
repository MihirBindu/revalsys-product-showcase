"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toast, { type ToastAction } from "@/components/ui/Toast";

export interface ToastInput {
  actions?: ToastAction[];
  countdownTo?: number;
  duration?: number;
  message: string;
}

interface ToastNotice extends ToastInput {
  id: number;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<ToastNotice | null>(null);
  const nextId = useRef(0);

  const dismissToast = useCallback(() => setNotice(null), []);
  const showToast = useCallback((toast: ToastInput) => {
    nextId.current += 1;
    setNotice({ ...toast, id: nextId.current });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {notice && (
        <Toast
          key={notice.id}
          actions={notice.actions}
          countdownTo = {notice.countdownTo}
          duration={notice.duration}
          message={notice.message}
          onDismiss={dismissToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}
