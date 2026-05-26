import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-slate-900 text-white hover:bg-slate-800",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
        danger: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

