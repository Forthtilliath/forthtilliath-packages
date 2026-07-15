import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SPECIAL_KEYS, useKeyListener } from "./useKeyListener.js";

function dispatchKeyDown(init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent("keydown", init));
}

describe("useKeyListener", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("calls the callback when the configured key is pressed", () => {
    const onKeyDown = vi.fn();
    renderHook(() => {
      useKeyListener({ key: SPECIAL_KEYS.ENTER }, onKeyDown);
    });

    dispatchKeyDown({ key: "Enter" });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("does not call the callback for a different key", () => {
    const onKeyDown = vi.fn();
    renderHook(() => {
      useKeyListener({ key: SPECIAL_KEYS.ENTER }, onKeyDown);
    });

    dispatchKeyDown({ key: "Escape" });

    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it("calls the callback for any key when no key is configured", () => {
    const onKeyDown = vi.fn();
    renderHook(() => {
      useKeyListener({}, onKeyDown);
    });

    dispatchKeyDown({ key: "a" });
    dispatchKeyDown({ key: "b" });

    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });

  it("requires the configured modifiers to be held down", () => {
    const onKeyDown = vi.fn();
    renderHook(() => {
      useKeyListener({ key: "s", ctrl: true }, onKeyDown);
    });

    dispatchKeyDown({ key: "s", ctrlKey: false });
    expect(onKeyDown).not.toHaveBeenCalled();

    dispatchKeyDown({ key: "s", ctrlKey: true });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("matches shift, alt and meta modifiers independently", () => {
    const onKeyDown = vi.fn();
    renderHook(() => {
      useKeyListener(
        { key: "x", shift: true, alt: true, meta: true },
        onKeyDown,
      );
    });

    dispatchKeyDown({ key: "x", shiftKey: true, altKey: true, metaKey: false });
    expect(onKeyDown).not.toHaveBeenCalled();

    dispatchKeyDown({ key: "x", shiftKey: true, altKey: true, metaKey: true });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("removes the event listener on unmount", () => {
    const onKeyDown = vi.fn();
    const { unmount } = renderHook(() => {
      useKeyListener({ key: SPECIAL_KEYS.ENTER }, onKeyDown);
    });

    unmount();
    dispatchKeyDown({ key: "Enter" });

    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it("re-attaches the listener with the latest callback when it changes", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { rerender } = renderHook(
      ({ onKeyDown }) => {
        useKeyListener({ key: SPECIAL_KEYS.ENTER }, onKeyDown);
      },
      { initialProps: { onKeyDown: firstCallback } },
    );

    rerender({ onKeyDown: secondCallback });
    dispatchKeyDown({ key: "Enter" });

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });
});
