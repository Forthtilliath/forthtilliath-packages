import type React from "react";

import { cn } from "@/lib/utils";

export type SpacerProps = React.ComponentProps<"div"> & {
  /**
   * A fixed gap, in Tailwind's spacing scale (e.g. `4` = 1rem). Omit for a
   * flexible spacer that grows to fill the remaining space in a flex
   * container instead (the more common use in a flex row/column).
   */
  size?: number;
};

/**
 * Adds space between components — a flexible filler by default (`flex-1`),
 * or a fixed gap via `size`.
 *
 * The single reference source for this component (heroui.com/docs/
 * components/spacer) 404'd — this keeps to the minimal, well-established
 * shape of this pattern across UI kits rather than guessing at a richer
 * API that couldn't be verified.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Spacer({ size, className, ...props }: SpacerProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="spacer"
      className={cn(size === undefined ? "flex-1" : "shrink-0", className)}
      style={
        size === undefined
          ? undefined
          : {
              width: `calc(var(--spacing) * ${size.toString()})`,
              height: `calc(var(--spacing) * ${size.toString()})`,
            }
      }
      {...props}
    />
  );
}
