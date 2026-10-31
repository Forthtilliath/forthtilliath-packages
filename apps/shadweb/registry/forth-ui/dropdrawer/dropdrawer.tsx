"use client";

import type React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/** One entry of a {@link Dropdrawer}, the same on desktop and mobile. */
export interface DropdrawerItem {
  /** Text of the entry. */
  label: React.ReactNode;
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  /** Called when the entry is chosen. */
  onSelect?: () => void;
  /**
   * `destructive` colors the entry for a dangerous action (delete…). Defaults
   * to `default`.
   */
  variant?: "default" | "destructive";
}

/** Props of {@link Dropdrawer}. */
export interface DropdrawerProps {
  /** The entries, in display order. */
  items: DropdrawerItem[];
  /** The element opening the menu (a button), rendered as the trigger. */
  trigger: React.ReactElement;
  /** Title of the bottom drawer (mobile only; the desktop menu has none). */
  title?: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * A menu that renders as a `DropdownMenu` on desktop and a bottom `Drawer`
 * on mobile (via the existing `useIsMobile` hook) — the same items, the
 * interaction pattern each platform's users actually expect.
 *
 * @see https://dropdrawer.jiawei.dev/
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Dropdrawer({
  items,
  trigger,
  title,
  open,
  onOpenChange,
}: DropdrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          {title !== undefined && (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
          )}
          <div className="grid gap-1 p-4 pt-0">
            {items.map((item, index) => (
              <button
                // eslint-disable-next-line @eslint-react/no-array-index-key -- `label` is an arbitrary ReactNode with no guaranteed unique field
                key={index}
                type="button"
                onClick={item.onSelect}
                className={cn(
                  "hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm",
                  item.variant === "destructive" && "text-destructive",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <DropdownMenuItem
            // eslint-disable-next-line @eslint-react/no-array-index-key -- see above
            key={index}
            onSelect={item.onSelect}
            variant={item.variant}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
