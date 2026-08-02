import { afterEach, describe, expect, it } from "vitest";

import { mockColorScheme } from "./__mocks__/react-native.js";
import { renderHook } from "./__mocks__/renderHook.js";
import { useEffectiveColorScheme } from "./useEffectiveColorScheme.js";

describe("useEffectiveColorScheme", () => {
  afterEach(() => {
    mockColorScheme.value = "light";
  });

  it('returns the preference as-is when it is not "system"', () => {
    mockColorScheme.value = "dark";
    const { result } = renderHook(() => useEffectiveColorScheme("light"));
    expect(result.current).toBe("light");
  });

  it('follows the device scheme when preference is "system"', () => {
    mockColorScheme.value = "dark";
    const { result } = renderHook(() => useEffectiveColorScheme("system"));
    expect(result.current).toBe("dark");
  });

  it('falls back to "light" when the device scheme is unknown', () => {
    mockColorScheme.value = null;
    const { result } = renderHook(() => useEffectiveColorScheme("system"));
    expect(result.current).toBe("light");
  });
});
