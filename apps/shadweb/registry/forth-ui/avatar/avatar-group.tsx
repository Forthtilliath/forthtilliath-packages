import type { JSX } from "react";

import { cn } from "@/lib/utils";

import type { AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

export type AvatarGroupProps = React.ComponentProps<"div"> & {
  avatars: AvatarProps[];
  /**
   * Maximum number of avatars to display before collapsing the rest into a
   * "+N" indicator, matching the `avatars` array's order.
   */
  max?: number;
};

const RING_CLASS = "ring-2 ring-background hover:z-10";

/**
 * A component to group multiple avatars together.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/avatar
 * @see https://www.kibo-ui.com/components/avatar-stack
 * @see https://www.shadcnui-blocks.com/components/avatar
 *
 * @param {AvatarGroupProps} props The props for the component.
 * @param {AvatarProps[]} props.avatars The avatars to be grouped together.
 * @param {number} [props.max] Collapse avatars beyond this count into a "+N" bubble.
 * @param {React.ComponentProps<'div'>} props The props for the outer div element.
 * @returns {JSX.Element} The component.
 */
export function AvatarGroup({
  className,
  avatars,
  max,
  ...props
}: AvatarGroupProps): JSX.Element {
  const visibleAvatars = max ? avatars.slice(0, max) : avatars;
  const overflowCount = max ? Math.max(avatars.length - max, 0) : 0;

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={`avatar-${index.toString()}`}
          {...avatar}
          className={{
            ...avatar.className,
            root: cn(RING_CLASS, avatar.className?.root),
          }}
        />
      ))}
      {overflowCount > 0 && (
        <Avatar
          fallback={`+${overflowCount.toString()}`}
          size={visibleAvatars.at(-1)?.size}
          shape={visibleAvatars.at(-1)?.shape}
          className={{
            root: cn(RING_CLASS),
            fallback: "bg-muted text-muted-foreground",
          }}
        />
      )}
    </div>
  );
}
