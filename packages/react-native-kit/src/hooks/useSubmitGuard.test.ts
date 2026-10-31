import { act, renderHook } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { useSubmitGuard } from "./useSubmitGuard.js";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("useSubmitGuard", () => {
  it("starts with isSaving false", async () => {
    const { result } = await renderHook(() => useSubmitGuard());
    expect(result.current.isSaving).toBe(false);
  });

  it("sets isSaving true while the action is pending, false once it resolves", async () => {
    const { result } = await renderHook(() => useSubmitGuard());
    const { promise, resolve } = deferred();
    const action = vi.fn(() => promise);

    let guardPromise!: Promise<void>;
    await act(() => {
      guardPromise = result.current.guard(action);
    });
    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      resolve();
      await guardPromise;
    });
    expect(result.current.isSaving).toBe(false);
  });

  it("ignores a second call while the first action is still pending", async () => {
    const { result } = await renderHook(() => useSubmitGuard());
    const { promise, resolve } = deferred();
    const action = vi.fn(() => promise);

    let firstCall!: Promise<void>;
    await act(() => {
      firstCall = result.current.guard(action);
    });
    // `guard` of the render that followed isSaving's change.
    await act(() => {
      void result.current.guard(action);
    });

    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve();
      await firstCall;
    });
  });

  it("ignores a second call made before any re-render (double tap)", async () => {
    const { result } = await renderHook(() => useSubmitGuard());
    const { promise, resolve } = deferred();
    const action = vi.fn(() => promise);

    let firstCall!: Promise<void>;
    await act(() => {
      // Both taps land on the same render, so they share the same `guard`.
      const { guard } = result.current;
      firstCall = guard(action);
      void guard(action);
    });

    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve();
      await firstCall;
    });
  });

  it("accepts a new call once the previous action has failed", async () => {
    const { result } = await renderHook(() => useSubmitGuard());
    const action = vi.fn(() => Promise.reject(new Error("boom")));

    await act(async () => {
      await result.current.guard(action).catch(() => undefined);
    });
    await act(async () => {
      await result.current.guard(action).catch(() => undefined);
    });

    expect(action).toHaveBeenCalledTimes(2);
    expect(result.current.isSaving).toBe(false);
  });
});
