import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import type { DropdownProps, DropdownOption } from "./dropdown.types";

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  searchable = false,
  searchPlaceholder = "Search...",
  leftIcon,
  rightIcon,
  searchLeftIcon,
  searchRightIcon,
  error = false,
  disabled = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Reset focus when filtered list changes or overlay opens/closes
  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [filteredOptions, isOpen]);

  // Click outside detection
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "Space" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          selectOption(filteredOptions[focusedIndex]);
        }
        break;
      case "Space":
        // Only trigger Space select if not typing inside search input
        if (e.target !== containerRef.current?.querySelector("input")) {
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            selectOption(filteredOptions[focusedIndex]);
          }
        }
        break;
    }
  };

  const selectOption = (opt: DropdownOption) => {
    onChange?.(opt.value);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Scroll focused option into view
  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn("relative w-full", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500" : "border-slate-300",
          isOpen && "ring-2 ring-slate-400 border-transparent"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {leftIcon && <span className="flex shrink-0 text-slate-400">{leftIcon}</span>}
          {selectedOption ? (
            <span className="flex items-center gap-2 truncate font-medium">
              {selectedOption.leftIcon && (
                <span className="flex shrink-0">{selectedOption.leftIcon}</span>
              )}
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.rightIcon && (
                <span className="flex shrink-0">{selectedOption.rightIcon}</span>
              )}
            </span>
          ) : (
            <span className="truncate text-slate-400">{placeholder}</span>
          )}
        </div>

        <span className="flex shrink-0 text-slate-400">
          {rightIcon ?? <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-md border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in duration-100 slide-in-from-top-1">
          {/* Search Field */}
          {searchable && (
            <div className="relative border-b border-slate-100 px-2 py-1.5 flex items-center gap-2">
              <span className="flex shrink-0 text-slate-400">
                {searchLeftIcon ?? <Search className="h-3.5 w-3.5" />}
              </span>
              <input
                type="text"
                autoFocus
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none py-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded hover:bg-slate-100 p-0.5"
                >
                  {searchRightIcon ?? <X className="h-3 w-3 text-slate-400" />}
                </button>
              )}
            </div>
          )}

          {/* Options Scroll List */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto p-1 space-y-0.5"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = value === opt.value;
                const isFocused = idx === focusedIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectOption(opt)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded px-2.5 py-1.5 text-xs text-slate-800 transition-colors text-left",
                      isSelected && "bg-slate-100 text-slate-900 font-semibold",
                      isFocused && "bg-slate-50 text-slate-900",
                      "hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.leftIcon && <span className="flex shrink-0">{opt.leftIcon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {opt.rightIcon && <span className="flex shrink-0">{opt.rightIcon}</span>}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
