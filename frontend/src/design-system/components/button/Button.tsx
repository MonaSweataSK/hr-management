import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonStyles } from "./button.styles";
import type { ButtonProps } from "./button.types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonStyles({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";


