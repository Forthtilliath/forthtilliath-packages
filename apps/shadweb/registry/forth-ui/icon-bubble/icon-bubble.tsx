import type React from "react";

import { cn } from "@/lib/utils";

import type { IconBubbleVariants } from "./variants";
import { ICON_BUBBLE_ICON_SIZES, iconBubbleVariants } from "./variants";

export type IconBubbleProps = Omit<React.ComponentProps<"span">, "children"> &
  IconBubbleVariants & {
    /** Icon component, e.g. a `lucide-react` icon. Decorative (`aria-hidden`). */
    icon: React.ComponentType<{
      size?: number | string;
      "aria-hidden"?: boolean | "true" | "false";
    }>;
  };

/**
 * An icon inside a round, tinted bubble — e.g. to lead an information line
 * (date, place…). Tinted with `primary` by default; override both the
 * background and the icon color through `className`
 * (`bg-sky-500/15 text-sky-600`).
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function IconBubble({
  icon: Icon,
  size,
  className,
  ...props
}: IconBubbleProps) {
  return (
    <span
      data-slot="icon-bubble"
      className={cn(iconBubbleVariants({ size }), className)}
      {...props}
    >
      <Icon
        size={ICON_BUBBLE_ICON_SIZES[size ?? "default"]}
        aria-hidden="true"
      />
    </span>
  );
}
