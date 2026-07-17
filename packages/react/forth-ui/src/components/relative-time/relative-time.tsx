"use client";

import * as React from "react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

const TICK_MS = 1000;

export interface RelativeTimeProps {
  /**
   * Controlled time. Omit for an auto-updating live clock (ticks every
   * second).
   */
  date?: Date;
  /**
   * IANA timezone (e.g. `"America/New_York"`). Defaults to the viewer's
   * local timezone.
   */
  timeZone?: string;
  /** A label shown above the time, e.g. `"EST"`. */
  label?: React.ReactNode;
  /** Passed through to `Intl.DateTimeFormat`. */
  formatOptions?: Intl.DateTimeFormatOptions;
  className?: string;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

/**
 * Displays a time — live-updating and defaulting to the local timezone
 * unless given a fixed `date`/`timeZone`, e.g. for showing several
 * teammates' local times side by side.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/relative-time
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function RelativeTime({
  date,
  timeZone,
  label,
  formatOptions,
  className,
}: RelativeTimeProps) {
  // `liveNow` starts `undefined` (not computed from `new Date()`) on
  // purpose: this component is server-rendered by Next.js like any "use
  // client" component, and the server's clock read would almost certainly
  // disagree with the client's first tick, causing a hydration mismatch.
  // `now` is derived from it rather than synced into its own state — the
  // effect below only ever subscribes to the external timer, it never
  // mirrors the `date` prop.
  const [liveNow, setLiveNow] = React.useState<Date | undefined>(undefined);
  const now = date ?? liveNow;
  const hasLabel = label !== undefined && label !== null;

  React.useEffect(() => {
    if (date) {
      return;
    }
    // The first tick has to happen synchronously here, not just future
    // ones — there's no way to read "now" during render without
    // reintroducing the hydration mismatch this state is starting
    // `undefined` to avoid.
    // eslint-disable-next-line @eslint-react/set-state-in-effect, react-hooks/set-state-in-effect
    setLiveNow(new Date());
    const interval = setInterval(() => {
      setLiveNow(new Date());
    }, TICK_MS);
    return () => {
      clearInterval(interval);
    };
  }, [date]);

  const formatted = React.useMemo(() => {
    if (!now) {
      return null;
    }
    return new Intl.DateTimeFormat(undefined, {
      ...DEFAULT_FORMAT,
      ...formatOptions,
      timeZone,
    }).format(now);
  }, [now, timeZone, formatOptions]);

  return (
    <div
      className={cn("flex flex-col items-center gap-0.5", className)}
      suppressHydrationWarning
    >
      {hasLabel && (
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
      )}
      <span className="font-mono text-sm tabular-nums">{formatted}</span>
    </div>
  );
}
