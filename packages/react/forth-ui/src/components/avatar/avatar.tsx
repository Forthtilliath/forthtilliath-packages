import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { StatusVariants, statusVariants } from "./variants";

export type AvatarProps = Omit<
  React.ComponentProps<typeof AvatarPrimitive>,
  "className"
> & {
  /**
   * The source URL of the image.
   */
  src: string;
  /**
   * The alt text for the image (2 letters if possible).
   */
  alt: string;
  /**
   * The status of the user.
   */
  status?: StatusVariants["status"];
  /**
   * Position of the status indicator.
   */
  position?: StatusVariants["position"];

  className?: {
    root?: string;
    image?: string;
    fallback?: string;
    status?: string;
    tooltip?: string;
  };
};

/**
 * An image element with a fallback for representing the user.
 *
 * @description Inspired from multiple sources, to make a consistent and reusable component.
 * @version 0.0.1
 * @author Forth
 *
 * @see https://ui.shadcn.com/docs/components/avatar
 * @see https://bundui.io/components/avatar
 */
export function Avatar({
  src,
  alt,
  status,
  position,
  className,
  ...props
}: AvatarProps) {
  return (
    <div className="relative">
      <AvatarPrimitive className={cn("block", className?.root)} {...props}>
        <AvatarImage src={src} className={className?.image} />
        <AvatarFallback className={className?.fallback}>{alt}</AvatarFallback>
      </AvatarPrimitive>
      {status !== undefined && (
        <div
          className={cn(
            statusVariants({ status, position }),
            className?.status
          )}
        >
          <span className="sr-only">Online</span>
        </div>
      )}
    </div>
  );
}
