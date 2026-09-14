import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMediaQuery } from "./useMediaQuery.js";

interface FakeMediaQueryList {
  matches: boolean;
  listeners: Set<(event: MediaQueryListEvent) => void>;
  addEventListener: (
    type: "change",
    listener: (event: MediaQueryListEvent) => void,
  ) => void;
  removeEventListener: (
    type: "change",
    listener: (event: MediaQueryListEvent) => void,
  ) => void;
  setMatches: (matches: boolean) => void;
}

function createFakeMatchMedia(initialMatches: boolean) {
  const list: FakeMediaQueryList = {
    matches: initialMatches,
    listeners: new Set(),
    addEventListener(_type, listener) {
      list.listeners.add(listener);
    },
    removeEventListener(_type, listener) {
      list.listeners.delete(listener);
    },
    setMatches(matches) {
      list.matches = matches;
      for (const listener of list.listeners) {
        listener({ matches } as MediaQueryListEvent);
      }
    },
  };
  return list;
}

describe("useMediaQuery", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("returns the current match state", () => {
    const list = createFakeMatchMedia(true);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(list));

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(true);
  });

  it("updates when the media query match changes", () => {
    const list = createFakeMatchMedia(false);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(list));

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(result.current).toBe(false);

    act(() => {
      list.setMatches(true);
    });

    expect(result.current).toBe(true);
  });
});
