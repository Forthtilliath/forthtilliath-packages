import { renderHook } from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedChange } from "./useDebouncedChange.js";

const DELAY_MS = 5 * 60 * 1000;

/** Watches the `values` handed as props, so `rerender(next)` changes them. */
function renderDebounced(values: unknown[], callback: () => void) {
  return renderHook(
    (current: unknown[]) => {
      useDebouncedChange(current, DELAY_MS, callback);
    },
    { initialProps: values },
  );
}

describe("useDebouncedChange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("doesn't fire while a value is undefined", async () => {
    const callback = vi.fn();
    await renderDebounced([undefined, undefined], callback);

    vi.advanceTimersByTime(DELAY_MS);
    expect(callback).not.toHaveBeenCalled();
  });

  it("doesn't fire on the first render once all values are defined", async () => {
    const callback = vi.fn();
    await renderDebounced([1, 2], callback);

    vi.advanceTimersByTime(DELAY_MS);
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires callback delayMs after a change", async () => {
    const callback = vi.fn();
    const { rerender } = await renderDebounced([1, 2], callback);

    await rerender([3, 2]);

    vi.advanceTimersByTime(DELAY_MS - 1);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("restarts the delay when a new change comes in before delayMs", async () => {
    const callback = vi.fn();
    const { rerender } = await renderDebounced([1, 2], callback);

    await rerender([3, 2]);
    vi.advanceTimersByTime(DELAY_MS - 60_000);

    await rerender([3, 4]);
    vi.advanceTimersByTime(DELAY_MS - 60_000);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
