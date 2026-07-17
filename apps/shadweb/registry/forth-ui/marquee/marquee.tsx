import type React from "react";

import { cn } from "@/lib/utils";

export type MarqueeProps = React.ComponentProps<"div"> & {
  /** Duration for one full loop, in seconds. @default 20 */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
};

/**
 * Infinitely scrolls its children (a logo wall, a ticker) — two duplicated
 * tracks looped via a pure CSS keyframe, no animation library.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.hextaui.com/docs/ui/components/marquee
 * @see https://www.kibo-ui.com/components/marquee
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Marquee({
  duration = 20,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  className,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    >
      {[0, 1].map((track) => (
        <div
          key={track}
          aria-hidden={track === 1}
          style={{ animationDuration: `${duration.toString()}s` }}
          className={cn(
            "flex shrink-0 justify-around gap-4",
            vertical
              ? "animate-marquee-vertical flex-col"
              : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
