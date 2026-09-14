import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useClickOutside } from "./useClickOutside.js";

function dispatchPointerDown(target: Node) {
  const event = new Event("pointerdown", { bubbles: true }) as PointerEvent;
  target.dispatchEvent(event);
}

describe("useClickOutside", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls the callback when the pointer event target is outside the element", () => {
    const onClickOutside = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(onClickOutside),
    );

    const el = document.createElement("div");
    result.current.current = el;
    document.body.append(el);

    dispatchPointerDown(document.body);

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it("does not call the callback when the pointer event target is inside the element", () => {
    const onClickOutside = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(onClickOutside),
    );

    const el = document.createElement("div");
    const child = document.createElement("span");
    el.append(child);
    result.current.current = el;
    document.body.append(el);

    dispatchPointerDown(child);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it("always calls the latest callback without re-attaching the listener", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { result, rerender } = renderHook(
      ({ onClickOutside }) => useClickOutside<HTMLDivElement>(onClickOutside),
      { initialProps: { onClickOutside: firstCallback } },
    );

    const el = document.createElement("div");
    result.current.current = el;
    document.body.append(el);

    rerender({ onClickOutside: secondCallback });
    dispatchPointerDown(document.body);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const onClickOutside = vi.fn();
    const { result, unmount } = renderHook(() =>
      useClickOutside<HTMLDivElement>(onClickOutside),
    );

    const el = document.createElement("div");
    result.current.current = el;
    document.body.append(el);

    unmount();
    dispatchPointerDown(document.body);

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
