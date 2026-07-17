import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { AvatarProps } from "../avatar";
import { Avatar } from "../avatar";
import type { BadgeProps } from "../badge";
import { Badge } from "../badge";

export type ChipProps = BadgeProps & {
  /**
   * Renders a small `Avatar` before the content — for "person/entity chip"
   * patterns (e.g. an assignee or a mentioned user).
   */
  avatar?: Pick<AvatarProps, "src" | "alt" | "fallback">;
  /**
   * Prevents interaction and dims the chip.
   * @default false
   */
  isDisabled?: boolean;
};

/**
 * A compact, interactive element for displaying status, categories, or
 * filters — `Badge` with an optional avatar slot for tagging people/entities.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://v2.heroui.com/docs/components/chip
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Chip({
  avatar,
  isDisabled = false,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <Badge
      className={cn(isDisabled && "pointer-events-none opacity-50", className)}
      aria-disabled={isDisabled}
      {...props}
    >
      {avatar && <Avatar size="xs" className={{ root: "-ml-1" }} {...avatar} />}
      {children}
    </Badge>
  );
}
