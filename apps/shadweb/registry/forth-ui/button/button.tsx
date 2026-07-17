import type * as React from "react";
import { Loader2Icon } from "lucide-react";

import { Button as ButtonPrimitive } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ButtonSizeVariants } from "./variants";
import { buttonSizeVariants } from "./variants";

export type ButtonProps = Omit<
  React.ComponentProps<typeof ButtonPrimitive>,
  "size"
> &
  ButtonSizeVariants & {
    /**
     * Shows a spinner before the content and disables the button.
     *
     * Controlled by the caller (pairs with your own mutation/submit state)
     * rather than an internal idle/loading/success animation — the more
     * flexible pattern when the loading source is already a promise your
     * app is tracking (React Query, a form library, etc).
     */
    loading?: boolean;
  };

/**
 * Displays a button or a component that looks like a button.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/button
 * @see https://ktui.io/docs/button
 * @see https://ui.aceternity.com/components/stateful-button
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Button({
  className,
  size,
  shape,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonSizeVariants({ size, shape }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2Icon className="animate-spin" />}
      {children}
    </ButtonPrimitive>
  );
}
