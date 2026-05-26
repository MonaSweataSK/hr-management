import * as React from "react";
import type { ToastContextValue } from "./toast.types";

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function randomToastId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

