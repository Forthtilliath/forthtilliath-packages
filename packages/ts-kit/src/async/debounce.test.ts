import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { debounce } from "./debounce.js";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("only invokes fn once after calls stop for `wait` ms", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes the arguments of the last call", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("first");
    debounced("second");
    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledExactlyOnceWith("second");
  });

  it("cancel() prevents the pending call from firing", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();
  });

  it("flush() invokes the pending call immediately", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("value");
    debounced.flush();

    expect(fn).toHaveBeenCalledExactlyOnceWith("value");
  });

  it("flush() is a no-op when there is no pending call", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced.flush();

    expect(fn).not.toHaveBeenCalled();
  });
});
