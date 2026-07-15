import type React from "react";

import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@forthtilliath/shadcn-ui/components/tooltip";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { Shape, Size } from "./constants";
import { STATUS_LABEL } from "./constants";
import type { FallbackVariants, StatusVariants } from "./variants";
import {
  avatarVariants,
  fallbackVariants,
  statusVariants,
  tooltipTriggerVariants,
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
   *
   * You can also use ``className.fallback`` to change the color of the fallback box.
   *
   * @example
   * ```tsx
   * <Avatar fallback="CN" fallbackVariant="emerald" />
   * <Avatar fallback="CN" className={{ fallback: "bg-emerald-500" }} />
   * ```
   */
  fallbackVariant?: FallbackVariants["fallbackVariant"];
  /**
   * The size of the avatar.
   */
  size?: Size;
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
   * Render a tooltip for the avatar.
   */
  renderTooltip?: () => React.ReactNode;

  /**
   * Custom classes for each part of the component.
   *
   * - `root` is the root element of the component.
   * - `image` is the image element.
   * - `fallback` is the fallback element.
   * - `status` is the status element.
   * - `tooltipTrigger` is the tooltip trigger element.
   * - `tooltipContent` is the tooltip content element.
   */
  className?: Partial<
    Record<
      | "root"
      | "image"
      | "fallback"
      | "status"
      | "tooltipTrigger"
      | "tooltipContent",
      string
    >
  >;
};

/**
 * An image element with a fallback for representing the user.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/avatar
 * @see https://bundui.io/components/avatar
 * @see https://www.shadcnui-blocks.com/components/avatar
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2025 Forth
 */
export function Avatar({
  src,
  alt,
  fallback,
  fallbackVariant,
  shape,
  size,
  ring = false,
  status,
  position,
  className,
  renderTooltip,
  ...props
}: AvatarProps) {
  const avatar = (
    <div className="relative">
      <AvatarPrimitive
        className={cn(
          "block",
          avatarVariants({ shape, ring, size }),
          className?.root,
        )}
        {...props}
      >
        <AvatarImage src={src} alt={alt} className={className?.image} />
        <AvatarFallback
          className={cn(
            fallbackVariants({ fallbackVariant, shape }),
            className?.fallback,
          )}
        >
          {fallback}
        </AvatarFallback>
      </AvatarPrimitive>
      {status && (
        <div
          className={cn(
            statusVariants({ status, position }),
            className?.status,
          )}
        >
          <span className="sr-only">{STATUS_LABEL[status]}</span>
        </div>
      )}
    </div>
  );

  if (typeof renderTooltip === "function") {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            tooltipTriggerVariants({ shape }),
            className?.tooltipTrigger,
          )}
          asChild
        >
          {avatar}
        </TooltipTrigger>
        <TooltipContent className={cn(className?.tooltipContent)}>
          {renderTooltip()}
        </TooltipContent>
      </Tooltip>
    );
  }

  return avatar;
}
