import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";
import { tooltipContentClass } from "./tooltip.styles";
import type { TooltipProps } from "./tooltip.types";

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  variation,
  delayDuration = 300,
  className,
}: TooltipProps) {
  let finalSide = side;
  let finalAlign = align;

  if (variation) {
    switch (variation) {
      case "above-center":
        finalSide = "top";
        finalAlign = "center";
        break;
      case "below-center":
        finalSide = "bottom";
        finalAlign = "center";
        break;
      case "top-right":
        finalSide = "top";
        finalAlign = "end";
        break;
      case "bottom-right":
        finalSide = "bottom";
        finalAlign = "end";
        break;
      case "top-left":
        finalSide = "top";
        finalAlign = "start";
        break;
      case "bottom-left":
        finalSide = "bottom";
        finalAlign = "start";
        break;
    }
  }

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <span className="inline-flex">{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={finalSide}
            align={finalAlign}
            className={cn(tooltipContentClass, className)}
          >
            {content}
            <RadixTooltip.Arrow className="fill-white" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

