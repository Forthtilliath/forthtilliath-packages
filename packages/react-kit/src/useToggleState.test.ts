import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useToggleState } from "./useToggleState.js";

describe("useToggleState", () => {
  afterEach(() => {
    cleanup();
  });

  it("defaults to false when no initial value is given", () => {
    const { result } = renderHook(() => useToggleState());

    expect(result.current[0]).toBe(false);
  });

  it("coerces a truthy default value to true", () => {
    const { result } = renderHook(() => useToggleState(true));

    expect(result.current[0]).toBe(true);
  });

  it("starts at false when the default value is explicitly false", () => {
    const { result } = renderHook(() => useToggleState(false));

    expect(result.current[0]).toBe(false);
  });

  it("toggle() flips the value on each call", () => {
    const { result } = renderHook(() => useToggleState(false));

    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(false);
  });

  it("exposes a setValue setter that sets the value directly", () => {
    const { result } = renderHook(() => useToggleState(false));

    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
  });

  it("setValue accepts an updater function like regular useState", () => {
    const { result } = renderHook(() => useToggleState(false));

    act(() => {
      result.current[1]((current) => !current);
    });
    expect(result.current[0]).toBe(true);
  });
});
