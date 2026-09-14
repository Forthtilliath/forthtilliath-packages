import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useControllableState } from "./useControllableState.js";

describe("useControllableState", () => {
  afterEach(() => {
    cleanup();
  });

  it("uncontrolled: starts at defaultValue and updates its own state", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "a" }),
    );

    expect(result.current[0]).toBe("a");

    act(() => {
      result.current[1]("b");
    });

    expect(result.current[0]).toBe("b");
  });

  it("uncontrolled: calls onChange on every update", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "a", onChange }),
    );

    act(() => {
      result.current[1]("b");
    });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("b");
  });

  it("controlled: always reflects the `value` prop, ignoring internal state", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value }),
      { initialProps: { value: "a" } },
    );

    act(() => {
      result.current[1]("ignored");
    });
    expect(result.current[0]).toBe("a");

    rerender({ value: "b" });
    expect(result.current[0]).toBe("b");
  });

  it("controlled: setValue calls onChange without mutating internal state", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: "a", onChange }),
    );

    act(() => {
      result.current[1]("b");
    });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("b");
    expect(result.current[0]).toBe("a");
  });
});
