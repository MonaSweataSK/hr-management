import type * as React from "react";

export interface DropdownOption {
  value: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  leftIcon?: React.ReactNode; // Left icon in the select trigger button
  rightIcon?: React.ReactNode; // Right icon in the select trigger button (defaults to chevron-down)
  searchLeftIcon?: React.ReactNode; // Left icon inside the search input
  searchRightIcon?: React.ReactNode; // Right icon inside the search input
  error?: boolean;
  disabled?: boolean;
  className?: string;
}
