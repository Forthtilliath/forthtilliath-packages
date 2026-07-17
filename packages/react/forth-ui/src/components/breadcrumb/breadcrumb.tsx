"use client";

import type React from "react";

import {
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@forthtilliath/shadcn-ui/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/dropdown-menu";

export interface BreadcrumbEntry {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbEntry[];
  /**
   * Collapses items between the first and last into a dropdown "…" once
   * there are more than this many — shadcn-ui's own `BreadcrumbEllipsis` is
   * purely decorative (no dropdown behavior), unlike ktui's.
   */
  maxItems?: number;
  className?: string;
}

function EntryLink({ item }: { item: BreadcrumbEntry }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {item.icon}
      {item.label}
    </span>
  );
}

/**
 * Displays the path to the current resource using a hierarchy of links.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/breadcrumb
 * @see https://ktui.io/docs/breadcrumb
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Breadcrumb({ items, maxItems, className }: BreadcrumbProps) {
  const shouldCollapse = maxItems !== undefined && items.length > maxItems;
  const firstItem = items[0];
  const lastItem = items.at(-1);
  const hiddenItems = shouldCollapse ? items.slice(1, -1) : [];
  const visibleMiddleItems = shouldCollapse ? [] : items.slice(1, -1);

  return (
    <BreadcrumbPrimitive className={className}>
      <BreadcrumbList>
        {firstItem && (
          <BreadcrumbItem>
            {firstItem.href ? (
              <BreadcrumbLink href={firstItem.href}>
                <EntryLink item={firstItem} />
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                <EntryLink item={firstItem} />
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        )}

        {items.length > 1 && <BreadcrumbSeparator />}

        {shouldCollapse && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hover:text-foreground flex items-center transition-colors"
                  aria-label="Show hidden breadcrumb items"
                >
                  &hellip;
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item, index) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key -- `label` is an arbitrary ReactNode and `href` is optional, so index is the only stable fallback
                    <DropdownMenuItem key={item.href ?? index} asChild>
                      {item.href ? (
                        <a href={item.href}>
                          <EntryLink item={item} />
                        </a>
                      ) : (
                        <span>
                          <EntryLink item={item} />
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {visibleMiddleItems.map((item, index) => (
          <span
            // eslint-disable-next-line @eslint-react/no-array-index-key -- `label` is an arbitrary ReactNode and `href` is optional, so index is the only stable fallback
            key={item.href ?? index}
            className="inline-flex items-center gap-1.5 sm:gap-2.5"
          >
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  <EntryLink item={item} />
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  <EntryLink item={item} />
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </span>
        ))}

        {lastItem && items.length > 1 && (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <EntryLink item={lastItem} />
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
}
