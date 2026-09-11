// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { usePersistentState } from "./usePersistentState.js";

describe("usePersistentState", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("returns the initial value when nothing is stored yet", () => {
    const { result } = renderHook(() => usePersistentState("key", "default"));

    expect(result.current.value).toBe("default");
    expect(result.current.hydrated).toBe(true);
  });

  it("reads an existing value from localStorage", () => {
    window.localStorage.setItem("key", JSON.stringify("stored"));

    const { result } = renderHook(() => usePersistentState("key", "default"));

    expect(result.current.value).toBe("stored");
  });

  it("persists the value set via setValue and updates state", () => {
    const { result } = renderHook(() => usePersistentState("key", "default"));

    act(() => {
      result.current.setValue("next");
    });

    expect(result.current.value).toBe("next");
    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("next"));
  });

  it("setValue accepts an updater function receiving the previous value", () => {
    window.localStorage.setItem("count", JSON.stringify(1));
    const { result } = renderHook(() => usePersistentState("count", 0));

    act(() => {
      result.current.setValue((previous) => previous + 1);
    });

    expect(result.current.value).toBe(2);
  });

  it("clear removes the stored value and falls back to the initial value", () => {
    const { result } = renderHook(() => usePersistentState("key", "default"));

    act(() => {
      result.current.setValue("next");
    });
    act(() => {
      result.current.clear();
    });

    expect(result.current.value).toBe("default");
    expect(window.localStorage.getItem("key")).toBeNull();
  });

  it("falls back to the initial value when the stored JSON is corrupted", () => {
    window.localStorage.setItem("key", "not-json");

    const { result } = renderHook(() => usePersistentState("key", "default"));

    expect(result.current.value).toBe("default");
  });
});
