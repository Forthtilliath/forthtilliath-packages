import { renderHook } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { createPaletteMemo, createThemedStyles } from "./createThemedStyles.js";

const light = { text: "#111111" };
const dark = { text: "#eeeeee" };

describe("createThemedStyles", () => {
  it("builds the styles of the current palette", async () => {
    const current = { palette: light };
    const useStyles = createThemedStyles(
      () => current.palette,
      (c) => ({ title: { color: c.text } }),
    );
    const { result, rerender } = await renderHook(() => useStyles());
    expect(result.current.title).toEqual({ color: "#111111" });

    current.palette = dark;
    await rerender({});
    expect(result.current.title).toEqual({ color: "#eeeeee" });
  });

  it("calls the factory once per palette, shared between instances", async () => {
    const factory = vi.fn((c: typeof light) => ({ title: { color: c.text } }));
    const useStyles = createThemedStyles(() => light, factory);
    const first = await renderHook(() => useStyles());
    const second = await renderHook(() => useStyles());
    await first.rerender({});
    expect(factory).toHaveBeenCalledTimes(1);
    expect(first.result.current).toBe(second.result.current);
  });
});

describe("createPaletteMemo", () => {
  it("memoizes any value, falsy ones included", async () => {
    const factory = vi.fn(() => 0);
    const useValue = createPaletteMemo(() => light, factory);
    const { result, rerender } = await renderHook(() => useValue());
    await rerender({});
    expect(result.current).toBe(0);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
