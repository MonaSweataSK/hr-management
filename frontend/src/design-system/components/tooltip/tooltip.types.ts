import type * as React from "react";

export type TooltipVariation =
  | "above-center"
  | "below-center"
  | "top-right"
  | "bottom-right"
  | "top-left"
  | "bottom-left";

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  variation?: TooltipVariation;
  delayDuration?: number;
  className?: string;
};

