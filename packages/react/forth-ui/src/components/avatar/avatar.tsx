import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { statusLabels } from "./constants";
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
   * The alt text for the image.
   */
  alt?: string;
  /**
   * The fallback text for the image (2 letters if possible).
   */
  fallback: string;
  /**
   * The status of the user.
   */
  status?: StatusVariants["status"];
  /**
   * Position of the status indicator.
   */
  position?: StatusVariants["position"];

  /**
   * Custom classes for each part of the component.
   *
   * - `root` is the root element of the component.
   * - `image` is the image element.
   * - `fallback` is the fallback element.
   * - `status` is the status element.
   * - `tooltip` is the tooltip element.
   */
  className?: Partial<
    Record<"root" | "image" | "fallback" | "status" | "tooltip", string>
  >;
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
  fallback,
  status,
  position,
  className,
  ...props
}: AvatarProps) {
  return (
    <div className="relative">
      <AvatarPrimitive className={cn("block", className?.root)} {...props}>
        <AvatarImage src={src} alt={alt} className={className?.image} />
        <AvatarFallback className={className?.fallback}>
          {fallback}
        </AvatarFallback>
      </AvatarPrimitive>
      {status && (
        <div
          className={cn(
            statusVariants({ status, position }),
            className?.status
          )}
        >
          <span className="sr-only">{statusLabels[status]}</span>
        </div>
      )}
    </div>
  );
}
