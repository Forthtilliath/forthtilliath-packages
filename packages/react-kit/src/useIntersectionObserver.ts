"use client";

import { useEffect, useState } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean;
}

/**
 * Reports whether the returned ref's element is currently intersecting the
 * viewport (or a given `root`) — the building block behind lazy-loading,
 * infinite scroll and scroll-triggered animations.
 *
 * The ref is a callback ref: the element is observed whenever it mounts,
 * including one rendered conditionally after the first render, and a new
 * element swapped in is observed in its place.
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver<HTMLImageElement>({ once: true });
 * return <img ref={ref} src={isVisible ? src : placeholder} />;
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const { once, root, rootMargin, threshold } = options;
  const [element, setElement] = useState<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  // An inline `threshold: [0, 1]` is a new array on every render: compare it
  // by value so the observer isn't recreated each time.
  const thresholdKey = JSON.stringify(threshold ?? 0);

  useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold: JSON.parse(thresholdKey) as number | number[],
      },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element, once, root, rootMargin, thresholdKey]);

  return [setElement, isIntersecting] as const;
}
