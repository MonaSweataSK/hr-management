import { cn } from "../../utils/cn";
import { loaderBaseClass, loaderSizeClass } from "./loader.styles";
import type { LoaderProps } from "./loader.types";

export function Loader({ className, size = "md", ...props }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(loaderBaseClass, loaderSizeClass[size], className)}
      {...props}
    />
  );
}

