import { useEffect, useRef } from "react";

/** Timings of {@link usePressRepeat}, in milliseconds. */
export interface PressRepeatTimings {
  /** Hold time before the first repeat. @defaultValue 450 */
  initialDelay?: number;
  /** Interval between repeats at first. @defaultValue 180 */
  interval?: number;
  /** Repeat time after which repeats speed up. @defaultValue 1200 */
  accelerateAfter?: number;
  /** Interval between repeats once sped up. @defaultValue 60 */
  fastInterval?: number;
}

interface Timers {
  delay?: ReturnType<typeof setTimeout>;
  repeat?: ReturnType<typeof setInterval>;
  accelerate?: ReturnType<typeof setTimeout>;
}

function clearTimers(timers: Timers) {
  clearTimeout(timers.delay);
  clearInterval(timers.repeat);
  clearTimeout(timers.accelerate);
}

/**
 * Repeats an action while a button is held, faster and faster — the way a
 * counter's −/+ reach large values quickly. `start` runs the action at once,
 * then again every `interval` after `initialDelay`, every `fastInterval`
 * after `accelerateAfter`; `stop` ends it (also done on unmount).
 *
 * @example
 * ```tsx
 * const repeat = usePressRepeat();
 * <Pressable
 *   onPressIn={() => repeat.start(() => setCount((n) => n + 1))}
 *   onPressOut={repeat.stop}
 * />
 * ```
 */
export function usePressRepeat({
  initialDelay = 450,
  interval = 180,
  accelerateAfter = 1200,
  fastInterval = 60,
}: PressRepeatTimings = {}) {
  const timersRef = useRef<Timers>({});

  useEffect(() => {
    const timers = timersRef;
    return () => {
      clearTimers(timers.current);
    };
  }, []);

  function stop() {
    clearTimers(timersRef.current);
    timersRef.current = {};
  }

  function start(action: () => void) {
    stop();
    action();
    const timers = timersRef.current;
    timers.delay = setTimeout(() => {
      timers.repeat = setInterval(action, interval);
      timers.accelerate = setTimeout(() => {
        clearInterval(timers.repeat);
        timers.repeat = setInterval(action, fastInterval);
      }, accelerateAfter);
    }, initialDelay);
  }

  return { start, stop };
}
