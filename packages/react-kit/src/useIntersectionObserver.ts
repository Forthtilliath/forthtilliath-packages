"use client";

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean;
}

/**
 * Reports whether the returned ref's element is currently intersecting the
 * viewport (or a given `root`) — the building block behind lazy-loading,
 * infinite scroll and scroll-triggered animations.
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver<HTMLImageElement>({ once: true });
 * return <img ref={ref} src={isVisible ? src : placeholder} />;
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const { once, root, rootMargin, threshold } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [once, root, rootMargin, threshold]);

  return [ref, isIntersecting] as const;
}
