import { renderHook } from "@testing-library/react-native";
import { afterEach, describe, expect, it } from "vitest";

import { mockColorScheme } from "../__mocks__/react-native.js";

import { useEffectiveColorScheme } from "./useEffectiveColorScheme.js";

describe("useEffectiveColorScheme", () => {
  afterEach(() => {
    mockColorScheme.value = "light";
  });

  it('returns the preference as-is when it is not "system"', async () => {
    mockColorScheme.value = "dark";
    const { result } = await renderHook(() => useEffectiveColorScheme("light"));
    expect(result.current).toBe("light");
  });

  it('follows the device scheme when preference is "system"', async () => {
    mockColorScheme.value = "dark";
    const { result } = await renderHook(() =>
      useEffectiveColorScheme("system"),
    );
    expect(result.current).toBe("dark");
  });

  it('falls back to "light" when the device scheme is unknown', async () => {
    mockColorScheme.value = null;
    const { result } = await renderHook(() =>
      useEffectiveColorScheme("system"),
    );
    expect(result.current).toBe("light");
  });
});
