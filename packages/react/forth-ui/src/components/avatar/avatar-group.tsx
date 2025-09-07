import type { JSX } from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

type Props = React.ComponentProps<"div"> & {
  avatars: AvatarProps[];
};

/**
 * A component to group multiple avatars together.
 *
 * @param {AvatarGroupProps} props The props for the component.
 * @param {AvatarProps[]} props.avatars The avatars to be grouped together.
 * @param {React.ComponentProps<'div'>} props The props for the outer div element.
 * @returns {JSX.Element} The component.
 */
export function AvatarGroup({
  className,
  avatars,
  ...props
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        "flex -space-x-2",
        className
      )}
      {...props}
    >
      {avatars.map((avatar, index) => (
        <Avatar
          key={`avatar-${index.toString()}`}
          className={{ root: cn("ring-2 ring-background hover:z-10") }}
          {...avatar}
        />
      ))}
    </div>
  );
}
