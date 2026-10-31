import { act, renderHook } from "@testing-library/react-native";
import { afterEach, describe, expect, it } from "vitest";

import {
  emitReduceMotionChange,
  mockReduceMotion,
} from "../__mocks__/react-native-extra.js";

import {
  type HydratableStore,
  usePersistHydrated,
} from "./usePersistHydrated.js";
import { useReducedMotion } from "./useReducedMotion.js";

describe("useReducedMotion", () => {
  afterEach(() => {
    mockReduceMotion.value = false;
  });

  it("is false by default", async () => {
    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reads the system setting, then follows its changes", async () => {
    mockReduceMotion.value = true;
    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    await act(() => {
      emitReduceMotionChange(false);
    });
    expect(result.current).toBe(false);
  });
});

function fakeStore(hydrated = false) {
  const listeners = new Set<() => void>();
  const state = { hydrated };
  const store: HydratableStore = {
    persist: {
      hasHydrated: () => state.hydrated,
      onFinishHydration: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    },
  };
  const finish = () => {
    state.hydrated = true;
    for (const listener of listeners) listener();
  };
  return { store, finish, listeners };
}

describe("usePersistHydrated", () => {
  it("is true at once when every store is already read back", async () => {
    const stores = [fakeStore(true).store];
    const { result } = await renderHook(() => usePersistHydrated(stores));
    expect(result.current).toBe(true);
  });

  it("waits for the last store", async () => {
    const first = fakeStore();
    const second = fakeStore();
    const stores = [first.store, second.store];
    const { result } = await renderHook(() => usePersistHydrated(stores));
    expect(result.current).toBe(false);

    await act(() => {
      first.finish();
    });
    expect(result.current).toBe(false);

    await act(() => {
      second.finish();
    });
    expect(result.current).toBe(true);
  });

  it("unsubscribes on unmount", async () => {
    const pending = fakeStore();
    const stores = [pending.store];
    const { unmount } = await renderHook(() => usePersistHydrated(stores));
    expect(pending.listeners.size).toBe(1);
    await unmount();
    expect(pending.listeners.size).toBe(0);
  });
});
