"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@forthtilliath/shadcn-ui/components/pagination";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";

import type { PaginationRangeOptions } from "./pagination-range.js";
import { getPaginationRange } from "./pagination-range.js";

export type PaginationProps = Omit<PaginationRangeOptions, "page"> & {
  /** The current page, 1-indexed. */
  page: number;
  onPageChange: (page: number) => void;
  /** Adds buttons that jump straight to the first/last page. @default false */
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
};

/**
 * Navigates between pages of a paginated set, computing the visible page
 * numbers and ellipses itself from `page`/`totalPages` — shadcn-ui's own
 * Pagination is unopinionated markup only and leaves that range
 * computation to every consumer, so this wraps it with the missing piece.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/pagination
 * @see https://ktui.io/docs/pagination
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Pagination({
  page,
  totalPages,
  siblingCount,
  boundaryCount,
  onPageChange,
  showFirstLast = false,
  disabled = false,
  className,
  locale,
}: PaginationProps) {
  const messages = useUiMessages(locale);
  const items = getPaginationRange({
    page,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  function goTo(target: number) {
    if (!disabled && target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  }

  return (
    <PaginationPrimitive
      data-slot="pagination-root"
      className={cn(disabled && "pointer-events-none opacity-50", className)}
    >
      <PaginationContent>
        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={messages.pagination.first}
              size="icon"
              aria-disabled={page <= 1}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
              onClick={(e) => {
                e.preventDefault();
                goTo(1);
              }}
            >
              <ChevronsLeftIcon />
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={messages.pagination.previousLabel}
            size="default"
            aria-disabled={page <= 1}
            className={cn(
              "gap-1 px-2.5 sm:pl-2.5",
              page <= 1 && "pointer-events-none opacity-50",
            )}
            onClick={(e) => {
              e.preventDefault();
              goTo(page - 1);
            }}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">
              {messages.pagination.previous}
            </span>
          </PaginationLink>
        </PaginationItem>

        {items.map((item) =>
          item === "ellipsis-start" || item === "ellipsis-end" ? (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={messages.pagination.nextLabel}
            size="default"
            aria-disabled={page >= totalPages}
            className={cn(
              "gap-1 px-2.5 sm:pr-2.5",
              page >= totalPages && "pointer-events-none opacity-50",
            )}
            onClick={(e) => {
              e.preventDefault();
              goTo(page + 1);
            }}
          >
            <span className="hidden sm:block">{messages.pagination.next}</span>
            <ChevronRightIcon />
          </PaginationLink>
        </PaginationItem>
        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={messages.pagination.last}
              size="icon"
              aria-disabled={page >= totalPages}
              className={cn(
                page >= totalPages && "pointer-events-none opacity-50",
              )}
              onClick={(e) => {
                e.preventDefault();
                goTo(totalPages);
              }}
            >
              <ChevronsRightIcon />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationPrimitive>
  );
}
