"use client";

import * as React from "react";

export interface CountAnimationProps {
  value: number;
  /** Animation duration, in ms. @default 1000 */
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
}

const DEFAULT_DURATION = 1000;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Animates a number counting up (or down) to `value` whenever it changes,
 * via `requestAnimationFrame` — no animation library.
 *
 * @see https://bundui.io/components/count-animation
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function CountAnimation({
  value,
  duration = DEFAULT_DURATION,
  formatOptions,
  className,
}: CountAnimationProps) {
  const [display, setDisplay] = React.useState(value);
  const fromRef = React.useRef(value);

  React.useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(from + (value - from) * easeOutCubic(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const formatted = React.useMemo(
    () => new Intl.NumberFormat(undefined, formatOptions).format(display),
    [display, formatOptions],
  );

  return <span className={className}>{formatted}</span>;
}
