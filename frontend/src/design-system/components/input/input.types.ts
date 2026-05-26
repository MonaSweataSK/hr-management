import type * as React from "react";

export type InputSize = "sm" | "md" | "lg";

export interface BaseInputProps {
  size?: InputSize;
  error?: boolean;
  type?: "text" | "password" | "textarea" | string;
}

export type InputProps = BaseInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "type">;


