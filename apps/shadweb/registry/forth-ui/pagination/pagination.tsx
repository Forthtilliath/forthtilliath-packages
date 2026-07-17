import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import type { PaginationRangeOptions } from "./pagination-range";
import { getPaginationRange } from "./pagination-range";

export type PaginationProps = Omit<PaginationRangeOptions, "page"> & {
  /** The current page, 1-indexed. */
  page: number;
  onPageChange: (page: number) => void;
  /** Adds buttons that jump straight to the first/last page. @default false */
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;
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
}: PaginationProps) {
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
              aria-label="Go to first page"
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
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={cn(page <= 1 && "pointer-events-none opacity-50")}
            onClick={(e) => {
              e.preventDefault();
              goTo(page - 1);
            }}
          />
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
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages}
            className={cn(
              page >= totalPages && "pointer-events-none opacity-50",
            )}
            onClick={(e) => {
              e.preventDefault();
              goTo(page + 1);
            }}
          />
        </PaginationItem>
        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to last page"
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
