import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Shape, statusLabels } from "./constants";
import {
  avatarVariants,
  FallbackVariants,
  fallbackVariants,
  StatusVariants,
  statusVariants,
} from "./variants";

export type AvatarProps = Omit<
  React.ComponentProps<typeof AvatarPrimitive>,
  "className"
> & {
  /**
   * The source URL of the image.
   */
  src?: string;
  /**
   * The alt text for the image.
   */
  alt?: string;
  /**
   * The fallback text for the image (3 letters max if possible).
   */
  fallback: string;
  /**
   * The variant of the fallback box.
   * @type {string}
   */
  fallbackVariant?: FallbackVariants["fallbackVariant"];
  /**
   * The shape of the avatar.
   */
  shape?: Shape;
  /**
   * Use the `ring` prop to add a ring to the avatar.
   * @default false
   */
  ring?: boolean;
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
 * @see https://www.shadcnui-blocks.com/components/avatar
 */
export function Avatar({
  src,
  alt,
  fallback,
  fallbackVariant,
  shape,
  ring,
  status,
  position,
  className,
  ...props
}: AvatarProps) {
  return (
    <div className="relative">
      <AvatarPrimitive
        className={cn(
          "block",
          avatarVariants({ shape, ring }),
          className?.root
        )}
        {...props}
      >
        <AvatarImage src={src} alt={alt} className={className?.image} />
        <AvatarFallback
          className={cn(
            fallbackVariants({ fallbackVariant, shape }),
            className?.fallback
          )}
        >
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
