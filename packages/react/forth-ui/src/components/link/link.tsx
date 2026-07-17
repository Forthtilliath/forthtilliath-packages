import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowUpRightIcon } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { LinkVariants } from "./variants";
import { linkVariants } from "./variants";

export type LinkProps = React.ComponentProps<"a"> &
  LinkVariants & {
    /**
     * Renders the passed child instead of an `<a>` (e.g. a framework's own
     * `Link`), keeping this component's styling and `isExternal` behavior.
     */
    asChild?: boolean;
    /**
     * Adds `target="_blank"` + `rel="noopener noreferrer"` and a trailing
     * arrow icon. Auto-detected from `href` when omitted.
     */
    isExternal?: boolean;
    disabled?: boolean;
  };

function isExternalHref(href: string | undefined) {
  return href !== undefined && /^https?:\/\//.test(href);
}

/**
 * A styled hyperlink, or a component that looks like one.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ktui.io/docs/link
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Link({
  className,
  variant,
  underline,
  size,
  asChild = false,
  isExternal,
  disabled = false,
  href,
  children,
  ...props
}: LinkProps) {
  const external = isExternal ?? isExternalHref(href);

  const sharedProps = {
    "data-slot": "link",
    "data-disabled": disabled,
    href,
    "aria-disabled": disabled,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
    className: cn(
      linkVariants({ variant, underline, size }),
      disabled && "pointer-events-none opacity-50",
      className,
    ),
    ...props,
  };

  // `Slot` requires a single child to clone props onto, so the
  // auto-appended external-link icon (which would make it two children)
  // is only added for the plain `<a>` case — `asChild` callers own their
  // entire subtree already.
  if (asChild) {
    return <Slot {...sharedProps}>{children}</Slot>;
  }

  return (
    <a {...sharedProps}>
      {children}
      {external && <ArrowUpRightIcon className="size-[0.9em]" />}
    </a>
  );
}
