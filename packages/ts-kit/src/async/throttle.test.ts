import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { throttle } from "./throttle.js";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes fn immediately on the leading edge", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("a");
    expect(fn).toHaveBeenCalledExactlyOnceWith("a");
  });

  it("ignores calls within the window, then fires once on the trailing edge", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("a");
    vi.advanceTimersByTime(30);
    throttled("b");
    vi.advanceTimersByTime(30);
    throttled("c");

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(40);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("c");
  });

  it("allows a new leading call once the window has fully elapsed", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("a");
    vi.advanceTimersByTime(100);
    throttled("b");

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("b");
  });

  it("cancel() prevents a pending trailing call from firing", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("a");
    throttled("b");
    throttled.cancel();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
