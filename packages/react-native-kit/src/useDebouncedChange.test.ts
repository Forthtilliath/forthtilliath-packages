import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderHook } from "./__mocks__/renderHook.js";
import { useDebouncedChange } from "./useDebouncedChange.js";

const DELAY_MS = 5 * 60 * 1000;

describe("useDebouncedChange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("ne déclenche rien tant qu'une valeur vaut undefined", () => {
    const callback = vi.fn();
    const values: unknown[] = [undefined, undefined];
    renderHook(() => {
      useDebouncedChange(values, DELAY_MS, callback);
    });

    vi.advanceTimersByTime(DELAY_MS);
    expect(callback).not.toHaveBeenCalled();
  });

  it("ne déclenche rien au premier rendu une fois les valeurs définies", () => {
    const callback = vi.fn();
    const values: unknown[] = [1, 2];
    renderHook(() => {
      useDebouncedChange(values, DELAY_MS, callback);
    });

    vi.advanceTimersByTime(DELAY_MS);
    expect(callback).not.toHaveBeenCalled();
  });

  it("déclenche callback delayMs après un changement", () => {
    const callback = vi.fn();
    let values: unknown[] = [1, 2];
    const { rerender } = renderHook(() => {
      useDebouncedChange(values, DELAY_MS, callback);
    });

    values = [3, 2];
    rerender();

    vi.advanceTimersByTime(DELAY_MS - 1);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("repousse le déclenchement si un nouveau changement survient avant delayMs", () => {
    const callback = vi.fn();
    let values: unknown[] = [1, 2];
    const { rerender } = renderHook(() => {
      useDebouncedChange(values, DELAY_MS, callback);
    });

    values = [3, 2];
    rerender();
    vi.advanceTimersByTime(DELAY_MS - 60_000);

    values = [3, 4];
    rerender();
    vi.advanceTimersByTime(DELAY_MS - 60_000);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
