// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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

  describe("when localStorage refuses writes", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("keeps the new value in memory so the state still changes", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("quota", "QuotaExceededError");
      });
      const { result } = renderHook(() => usePersistentState("key", "default"));

      act(() => {
        result.current.setValue("next");
      });
      expect(result.current.value).toBe("next");
      expect(window.localStorage.getItem("key")).toBeNull();

      act(() => {
        result.current.setValue((previous) => `${previous}!`);
      });
      expect(result.current.value).toBe("next!");

      act(() => {
        result.current.clear();
      });
      expect(result.current.value).toBe("default");
    });

    it("reads localStorage again once a write succeeds", () => {
      const setItem = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementationOnce(() => {
          throw new DOMException("quota", "QuotaExceededError");
        });
      const { result } = renderHook(() => usePersistentState("key", "default"));

      act(() => {
        result.current.setValue("in-memory");
      });
      setItem.mockRestore();
      act(() => {
        result.current.setValue("persisted");
      });
      expect(window.localStorage.getItem("key")).toBe(
        JSON.stringify("persisted"),
      );

      act(() => {
        window.localStorage.setItem("key", JSON.stringify("other-tab"));
        window.dispatchEvent(new StorageEvent("storage", { key: "key" }));
      });
      expect(result.current.value).toBe("other-tab");
    });
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
