import type React from "react";
import { Loader2Icon } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { SpinnerSizeVariants } from "./variants";
import { spinnerSizeVariants } from "./variants";

export type SpinnerVariant = "default" | "ring" | "bars" | "ellipsis";

export type SpinnerProps = React.ComponentProps<"span"> &
  SpinnerSizeVariants & {
    /**
     * @default "default"
     */
    variant?: SpinnerVariant;
  };

/**
 * An accessible loading indicator, in one of a few visual styles.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/spinner
 * @see https://www.shadcnui-blocks.com/components/spinner
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Spinner({
  variant = "default",
  size,
  className,
  ...props
}: SpinnerProps) {
  const sizeClass = spinnerSizeVariants({ size });

  return (
    <span role="status" aria-label="Loading" {...props}>
      {variant === "ring" && (
        <span
          className={cn(
            sizeClass,
            "block animate-spin rounded-full border-2 border-current border-t-transparent",
            className,
          )}
        />
      )}
      {variant === "bars" && (
        <span className={cn(sizeClass, "flex items-center gap-0.5", className)}>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="h-full w-1 animate-pulse rounded-full bg-current"
              style={{ animationDelay: `${delay.toString()}ms` }}
            />
          ))}
        </span>
      )}
      {variant === "ellipsis" && (
        <span className={cn(sizeClass, "flex items-center gap-1", className)}>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1/4 animate-bounce rounded-full bg-current"
              style={{ animationDelay: `${delay.toString()}ms` }}
            />
          ))}
        </span>
      )}
      {variant === "default" && (
        <Loader2Icon className={cn(sizeClass, "animate-spin", className)} />
      )}
    </span>
  );
}
