import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useThrottle } from "./useThrottle.js";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("first", 200));

    expect(result.current).toBe("first");
  });

  it("applies a change immediately when the limit has already elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: "second" });

    expect(result.current).toBe("second");
  });

  it("delays a change until the limit elapses on the trailing edge", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("second");
  });

  it("never drops the final value across rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: "third" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("third");
  });
});
