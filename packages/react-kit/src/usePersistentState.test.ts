// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  type PersistentStateSchema,
  usePersistentState,
} from "./usePersistentState.js";

const positiveInt: PersistentStateSchema<number> = {
  safeParse: (input) =>
    Number.isInteger(input) && (input as number) > 0
      ? { success: true, data: input as number }
      : { success: false },
};

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

  it("setValue still works when the stored JSON is corrupted", () => {
    window.localStorage.setItem("count", "not-json");
    const { result } = renderHook(() => usePersistentState("count", 0));

    act(() => {
      result.current.setValue((previous) => previous + 1);
    });

    expect(result.current.value).toBe(1);
  });

  describe("with a schema", () => {
    it("returns a stored value accepted by the schema", () => {
      window.localStorage.setItem("count", JSON.stringify(3));

      const { result } = renderHook(() =>
        usePersistentState("count", 1, { schema: positiveInt }),
      );

      expect(result.current.value).toBe(3);
    });

    it("falls back to the initial value when the schema rejects it", () => {
      window.localStorage.setItem("count", JSON.stringify("3"));

      const { result } = renderHook(() =>
        usePersistentState("count", 1, { schema: positiveInt }),
      );

      expect(result.current.value).toBe(1);
    });

    it("gives the initial value to the updater instead of a rejected one", () => {
      window.localStorage.setItem("count", JSON.stringify(-5));
      const { result } = renderHook(() =>
        usePersistentState("count", 1, { schema: positiveInt }),
      );

      act(() => {
        result.current.setValue((previous) => previous + 1);
      });

      expect(result.current.value).toBe(2);
    });
  });
});
