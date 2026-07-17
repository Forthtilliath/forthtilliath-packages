import type React from "react";

import { Separator as SeparatorPrimitive } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive> & {
  /**
   * Centered text between two line segments (e.g. `"OR"`) — only applies
   * when `orientation` is `"horizontal"` (the default).
   */
  label?: React.ReactNode;
};

/**
 * Visually or semantically separates content.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/separator
 * @see https://ktui.io/docs/separator
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Separator({
  label,
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const hasLabel = label !== undefined && label !== null;

  if (hasLabel && orientation === "horizontal") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center gap-3", className)}
      >
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {label}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>
    );
  }

  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={className}
      {...props}
    />
  );
}
