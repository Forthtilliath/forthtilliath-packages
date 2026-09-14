import { act, cleanup, renderHook } from "@testing-library/react";
import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCopyToClipboard } from "./useCopyToClipboard.js";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  vi.stubGlobal("navigator", {
    clipboard: { writeText },
  });
}

describe("useCopyToClipboard", () => {
  let writeText: Mock<(text: string) => Promise<void>>;

  beforeEach(() => {
    vi.useFakeTimers();
    writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockResolvedValue(undefined);
    stubClipboard(writeText);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("starts with no copied text", () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current[0]).toBeNull();
  });

  it("copy() writes to the clipboard and stores the copied text", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]("hello");
    });

    expect(writeText).toHaveBeenCalledExactlyOnceWith("hello");
    expect(result.current[0]).toBe("hello");
  });

  it("resets the copied text after resetDelayMs", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current[1]("hello");
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBeNull();
  });

  it("returns false and does not update state when the clipboard write rejects", async () => {
    stubClipboard(
      vi
        .fn<(text: string) => Promise<void>>()
        .mockRejectedValue(new Error("denied")),
    );
    const { result } = renderHook(() => useCopyToClipboard());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current[1]("hello");
    });

    expect(success).toBe(false);
    expect(result.current[0]).toBeNull();
  });

  it("returns false when the Clipboard API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    const { result } = renderHook(() => useCopyToClipboard());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current[1]("hello");
    });

    expect(success).toBe(false);
  });
});
