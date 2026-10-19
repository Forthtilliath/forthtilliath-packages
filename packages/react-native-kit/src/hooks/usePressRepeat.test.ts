import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderHook } from "../__mocks__/renderHook.js";

import { usePressRepeat } from "./usePressRepeat.js";

describe("usePressRepeat", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs at once, repeats after the delay, then speeds up", () => {
    const action = vi.fn();
    const { result } = renderHook(() => usePressRepeat());

    result.current.start(action);
    expect(action).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(450 + 180 * 3);
    expect(action).toHaveBeenCalledTimes(4);

    // 1200 ms after the first repeat: one call every 60 ms.
    vi.advanceTimersByTime(1200 - 180 * 3);
    const beforeFast = action.mock.calls.length;
    vi.advanceTimersByTime(60 * 10);
    expect(action.mock.calls.length - beforeFast).toBe(10);
  });

  it("stops on stop() and on unmount", () => {
    const action = vi.fn();
    const { result, unmount } = renderHook(() => usePressRepeat());

    result.current.start(action);
    result.current.stop();
    vi.advanceTimersByTime(5000);
    expect(action).toHaveBeenCalledTimes(1);

    result.current.start(action);
    unmount();
    vi.advanceTimersByTime(5000);
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("follows custom timings", () => {
    const action = vi.fn();
    const { result } = renderHook(() =>
      usePressRepeat({ initialDelay: 100, interval: 50 }),
    );

    result.current.start(action);
    vi.advanceTimersByTime(100 + 50 * 2);
    expect(action).toHaveBeenCalledTimes(3);
    result.current.stop();
  });
});
