import type * as React from "react";

export type ToastVariant = "default" | "success" | "error";
export type ToastPosition = "top-center" | "top-right" | "top-left";

export type ToastItem = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  position?: ToastPosition;
  durationMs?: number;
};

export type ToastContextValue = {
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

