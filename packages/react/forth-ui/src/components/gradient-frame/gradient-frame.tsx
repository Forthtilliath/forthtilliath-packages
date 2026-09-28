import type React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface GradientFrameProps {
  /** Side the gradient frame sticks out on (default: `"right"`). */
  side?: "left" | "right";
  children: React.ReactNode;
  /**
   * Custom classes for each part of the component.
   *
   * - `root` wraps the frame and the content.
   * - `frame` is the offset gradient panel — set its colors here with
   *   gradient stops (`from-* via-* to-*`), the direction (`bg-linear-135`)
   *   is already set.
   * - `content` is the rounded, clipped container around `children`.
   */
  className?: Partial<Record<"root" | "frame" | "content", string>>;
}

/**
 * A visual (image, video, card…) laid on a rounded frame offset diagonally
 * behind it, filled with a gradient — a decorative "photo on a colored card"
 * effect. The offset grows from `md` screens on.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function GradientFrame({
  side = "right",
  children,
  className,
}: GradientFrameProps) {
  return (
    <div data-slot="gradient-frame" className={cn("relative", className?.root)}>
      <div
        aria-hidden="true"
        className={cn(
          "from-primary to-primary/40 absolute inset-0 rounded-3xl bg-linear-135",
          side === "right"
            ? "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"
            : "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5",
          className?.frame,
        )}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl shadow-xl",
          className?.content,
        )}
      >
        {children}
      </div>
    </div>
  );
}
