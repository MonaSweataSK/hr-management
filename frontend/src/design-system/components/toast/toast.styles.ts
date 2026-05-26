import { cva } from "class-variance-authority";

export const toastRootClass = cva(
  "group pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-md border bg-white p-4 shadow-lg",
  {
    variants: {
      variant: {
        default: "border-slate-200",
        success: "border-emerald-200",
        error: "border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const toastTitleClass = "text-sm font-semibold text-slate-900";
export const toastDescriptionClass = "mt-1 text-sm text-slate-600";

export const toastCloseClass =
  "ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";

export const toastViewportStyles = {
  "top-right":
    "fixed top-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 outline-none",
  "top-center":
    "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 outline-none",
  "top-left":
    "fixed top-4 left-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 outline-none",
};

