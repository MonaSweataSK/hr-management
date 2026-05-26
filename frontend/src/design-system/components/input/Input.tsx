import * as React from "react";
import { cn } from "../../utils/cn";
import { inputStyles } from "./input.styles";
import type { InputProps } from "./input.types";

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ className, size = "md", error = false, type = "text", ...props }, ref) => {
  if (type === "textarea") {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={cn(
          inputStyles({ size, error }),
          "min-h-[100px] py-2 resize-y h-auto",
          className
        )}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      className={cn(inputStyles({ size, error }), className)}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
});

Input.displayName = "Input";

