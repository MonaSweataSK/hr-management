import { cva } from "class-variance-authority";

export const inputStyles = cva(
  "w-full rounded-md border bg-white px-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-11 text-base",
      },
      error: {
        true: "border-red-500 focus-visible:ring-red-300",
        false: "border-slate-300",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  },
);

