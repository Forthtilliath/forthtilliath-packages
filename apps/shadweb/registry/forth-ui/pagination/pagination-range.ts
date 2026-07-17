export interface PaginationRangeOptions {
  page: number;
  totalPages: number;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages always shown at the start and end. @default 1 */
  boundaryCount?: number;
}

export type PaginationRangeItem = number | "ellipsis-start" | "ellipsis-end";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Computes which page numbers (and where ellipses go) to render for a
 * given current page / total page count — the piece every shadcn-ui
 * Pagination consumer ends up re-implementing by hand, since the
 * vendored primitives are unopinionated markup only.
 */
export function getPaginationRange({
  page,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationRangeOptions): PaginationRangeItem[] {
  const totalVisible = boundaryCount * 2 + siblingCount * 2 + 3;

  if (totalPages <= totalVisible) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(page - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(
    page + siblingCount,
    totalPages - boundaryCount - 1,
  );

  const items: PaginationRangeItem[] = range(1, boundaryCount);

  items.push(
    leftSibling > boundaryCount + 2 ? "ellipsis-start" : boundaryCount + 1,
  );
  items.push(...range(leftSibling, rightSibling));
  items.push(
    rightSibling < totalPages - boundaryCount - 1
      ? "ellipsis-end"
      : totalPages - boundaryCount,
  );
  items.push(...range(totalPages - boundaryCount + 1, totalPages));

  return [...new Set(items)].filter((item) => {
    if (item === "ellipsis-start" || item === "ellipsis-end") {
      return true;
    }
    return item >= 1 && item <= totalPages;
  });
}
