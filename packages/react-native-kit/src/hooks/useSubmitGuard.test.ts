/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { renderHook } from "../__mocks__/renderHook.js";

import { useSubmitGuard } from "./useSubmitGuard.js";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("useSubmitGuard", () => {
  it("starts with isSaving false", () => {
    const { result } = renderHook(() => useSubmitGuard());
    expect(result.current.isSaving).toBe(false);
  });

  it("sets isSaving true while the action is pending, false once it resolves", async () => {
    const { result, rerender } = renderHook(() => useSubmitGuard());
    const { promise, resolve } = deferred();
    const action = vi.fn(() => promise);

    let guardPromise!: Promise<void>;
    act(() => {
      guardPromise = result.current.guard(action);
    });
    rerender();
    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      resolve();
      await guardPromise;
    });
    rerender();
    expect(result.current.isSaving).toBe(false);
  });

  it("ignores a second call while the first action is still pending", async () => {
    const { result, rerender } = renderHook(() => useSubmitGuard());
    const { promise, resolve } = deferred();
    const action = vi.fn(() => promise);

    let firstCall!: Promise<void>;
    act(() => {
      firstCall = result.current.guard(action);
    });
    rerender();
    act(() => {
      void result.current.guard(action);
    });

    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve();
      await firstCall;
    });
  });
});
