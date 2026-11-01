import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createToastStore, useToasts } from "./createToastStore.js";

describe("createToastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("adds toasts in order with unique ids", () => {
    const store = createToastStore<"error" | "success">();

    const first = store.show("Saved", "success");
    const second = store.show("Failed", "error");

    expect(first).not.toBe(second);
    expect(store.getSnapshot()).toEqual([
      { id: first, message: "Saved", variant: "success" },
      { id: second, message: "Failed", variant: "error" },
    ]);
  });

  it("removes a toast after 5 s by default", () => {
    const store = createToastStore();
    store.show("Saved", "success");

    vi.advanceTimersByTime(4999);
    expect(store.getSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("uses the store's and the toast's duration", () => {
    const store = createToastStore({ durationMs: 1000 });
    store.show("Short", "info");
    store.show("Long", "info", { durationMs: 3000 });

    vi.advanceTimersByTime(1000);
    expect(store.getSnapshot().map((t) => t.message)).toEqual(["Long"]);

    vi.advanceTimersByTime(2000);
    expect(store.getSnapshot()).toHaveLength(0);
  });

  it("keeps a toast with a duration of 0 or Infinity", () => {
    const store = createToastStore();
    store.show("Sticky", "info", { durationMs: 0 });
    store.show("Sticky too", "info", { durationMs: Infinity });

    vi.advanceTimersByTime(60_000);
    expect(store.getSnapshot()).toHaveLength(2);
  });

  it("dismisses a toast and ignores an unknown id", () => {
    const store = createToastStore();
    const listener = vi.fn();
    const id = store.show("Saved", "success");
    store.subscribe(listener);

    store.dismiss(id);
    store.dismiss(id);

    expect(store.getSnapshot()).toHaveLength(0);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("clears every toast and their timers", () => {
    const store = createToastStore();
    store.show("A", "info");
    store.show("B", "info");
    const listener = vi.fn();
    store.subscribe(listener);

    store.clear();
    store.clear();
    vi.advanceTimersByTime(10_000);

    expect(store.getSnapshot()).toHaveLength(0);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps the same snapshot until something changes", () => {
    const store = createToastStore();
    store.show("A", "info");

    expect(store.getSnapshot()).toBe(store.getSnapshot());
  });

  it("stops notifying after unsubscribe", () => {
    const store = createToastStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.show("A", "info");

    expect(listener).not.toHaveBeenCalled();
  });
});

describe("useToasts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("re-renders when toasts are shown and removed", () => {
    const store = createToastStore();
    const { result } = renderHook(() => useToasts(store));
    expect(result.current).toEqual([]);

    act(() => {
      store.show("Saved", "success");
    });
    expect(result.current.map((t) => t.message)).toEqual(["Saved"]);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toEqual([]);
  });
});
