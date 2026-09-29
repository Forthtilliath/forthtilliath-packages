"use client";

import type * as React from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import {
  type UiLocale,
  useUiMessages,
} from "@/components/forth-ui/locale/locale";

export interface NavbarMobileMenuItem {
  label: React.ReactNode;
  href: string;
}

export interface NavbarMobileMenuProps {
  items: NavbarMobileMenuItem[];
  /** Extra content rendered below the links (e.g. auth buttons). */
  footer?: React.ReactNode;
  className?: string;
  /** Visible only below this breakpoint's prefix (Tailwind's `md` by default). @default "md" */
  hideFrom?: "sm" | "md" | "lg";
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
}

/**
 * A hamburger-triggered slide-down panel for a `Navbar`'s links on small
 * screens — pairs with `Navbar`, consolidating aceternity's
 * MobileNavToggle/MobileNavMenu pair into one component.
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function NavbarMobileMenu({
  items,
  footer,
  className,
  hideFrom = "md",
  locale,
}: NavbarMobileMenuProps) {
  const messages = useUiMessages(locale);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={messages.navbar.toggleMenu}
          className={cn(
            hideFrom === "sm" && "sm:hidden",
            hideFrom === "md" && "md:hidden",
            hideFrom === "lg" && "lg:hidden",
            className,
          )}
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetTitle className="sr-only">{messages.navbar.menu}</SheetTitle>
        <nav className="flex flex-col gap-1 pt-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {footer}
      </SheetContent>
    </Sheet>
  );
}
