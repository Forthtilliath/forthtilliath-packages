"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";

export interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Calls `onLoadMore` once a sentinel at the bottom of `children` scrolls
 * into view, via `IntersectionObserver` — no scroll-event polling.
 *
 * @see https://www.rigidui.com/docs/components/infinite-scroll
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  children,
  className,
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel === null || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting === true) {
        onLoadMore();
      }
    });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore]);

  return (
    <div data-slot="infinite-scroll" className={className}>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loading && (
            <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
