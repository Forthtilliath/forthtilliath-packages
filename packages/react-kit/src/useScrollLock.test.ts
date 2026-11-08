// @vitest-environment jsdom
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useScrollLock } from "./useScrollLock.js";

describe("useScrollLock", () => {
  const root = document.documentElement;

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    root.removeAttribute("style");
  });

  it("hides the overflow while active and restores it afterwards", () => {
    root.style.overflow = "auto";
    const { rerender } = renderHook(
      ({ active }) => {
        useScrollLock(active);
      },
      {
        initialProps: { active: true },
      },
    );

    expect(root.style.overflow).toBe("hidden");

    rerender({ active: false });
    expect(root.style.overflow).toBe("auto");
  });

  it("replaces the scrollbar by an equal padding", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1015);
    vi.spyOn(root, "clientWidth", "get").mockReturnValue(1000);

    const { unmount } = renderHook(() => {
      useScrollLock(true);
    });
    expect(root.style.paddingRight).toBe("15px");

    unmount();
    expect(root.style.paddingRight).toBe("");
  });

  it("leaves the page alone while inactive", () => {
    renderHook(() => {
      useScrollLock(false);
    });

    expect(root.style.overflow).toBe("");
  });
});
