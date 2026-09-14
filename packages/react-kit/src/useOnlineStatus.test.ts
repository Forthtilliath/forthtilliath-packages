import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useOnlineStatus } from "./useOnlineStatus.js";

function stubOnLine(onLine: boolean) {
  vi.stubGlobal("navigator", { onLine });
}

describe("useOnlineStatus", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("returns the current navigator.onLine value", () => {
    stubOnLine(true);

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it("updates to false when an offline event fires", () => {
    stubOnLine(true);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      stubOnLine(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("updates to true when an online event fires", () => {
    stubOnLine(false);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      stubOnLine(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
