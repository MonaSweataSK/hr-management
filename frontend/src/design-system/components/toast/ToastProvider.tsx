import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import {
  toastCloseClass,
  toastDescriptionClass,
  toastRootClass,
  toastTitleClass,
  toastViewportStyles,
} from "./toast.styles";
import type { ToastContextValue, ToastItem, ToastPosition } from "./toast.types";
import { randomToastId, ToastContext } from "./toast.context";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = randomToastId();
    setItems((prev) => [...prev, { id, variant: "default", position: "top-right", ...item }]);
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toast, dismiss }),
    [toast, dismiss],
  );

  const positions: ToastPosition[] = ["top-right", "top-center", "top-left"];

  return (
    <ToastContext.Provider value={value}>
      {children}
      {positions.map((pos) => {
        const positionItems = items.filter((t) => (t.position || "top-right") === pos);

        return (
          <RadixToast.Provider key={pos}>
            {positionItems.map((t) => (
              <RadixToast.Root
                key={t.id}
                duration={t.durationMs ?? 4000}
                className={cn(toastRootClass({ variant: t.variant }))}
                onOpenChange={(open) => {
                  if (!open) dismiss(t.id);
                }}
              >
                <div className="min-w-0">
                  {t.title ? (
                    <RadixToast.Title className={toastTitleClass}>
                      {t.title}
                    </RadixToast.Title>
                  ) : null}
                  {t.description ? (
                    <RadixToast.Description className={toastDescriptionClass}>
                      {t.description}
                    </RadixToast.Description>
                  ) : null}
                </div>
                <RadixToast.Close className={toastCloseClass} aria-label="Close">
                  <X className="h-4 w-4" />
                </RadixToast.Close>
              </RadixToast.Root>
            ))}
            <RadixToast.Viewport className={toastViewportStyles[pos]} />
          </RadixToast.Provider>
        );
      })}
    </ToastContext.Provider>
  );
}

