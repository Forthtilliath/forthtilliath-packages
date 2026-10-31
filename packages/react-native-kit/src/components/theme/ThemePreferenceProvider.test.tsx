import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { mockColorScheme } from "../../__mocks__/react-native.js";
import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

import {
  useResolvedScheme,
  useThemePreference,
} from "./themePreferenceContext.js";
import { ThemePreferenceProvider } from "./ThemePreferenceProvider.js";

type ProviderProps = Omit<
  Parameters<typeof ThemePreferenceProvider>[0],
  "children"
>;

/** What a screen under the provider reads. */
function useTheme() {
  return { ctx: useThemePreference(), scheme: useResolvedScheme() };
}

function renderUnder(props: ProviderProps) {
  return renderHook(useTheme, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemePreferenceProvider {...props}>{children}</ThemePreferenceProvider>
    ),
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("ThemePreferenceProvider", () => {
  it("starts on the initial preference, then applies the loaded one", async () => {
    const stored = deferred<ThemePreference | null>();
    const { result } = await renderUnder({
      load: () => stored.promise,
      save: vi.fn(),
    });
    expect(result.current.ctx.preference).toBe("system");

    stored.resolve("dark");
    await flush();
    expect(result.current.ctx.preference).toBe("dark");
    expect(result.current.scheme).toBe("dark");
  });

  it("keeps the initial preference when nothing is saved", async () => {
    const { result } = await renderUnder({
      load: () => Promise.resolve(null),
      save: vi.fn(),
      initialPreference: "light",
    });
    await flush();
    expect(result.current.ctx.preference).toBe("light");
  });

  it("applies and saves a new choice", async () => {
    const save = vi.fn();
    const { result } = await renderUnder({
      load: () => Promise.resolve(null),
      save,
    });
    await flush();
    await act(() => {
      result.current.ctx.setPreference("dark");
    });
    expect(result.current.ctx.preference).toBe("dark");
    expect(save).toHaveBeenCalledWith("dark");
  });

  it("doesn't let a late load overwrite a choice made meanwhile", async () => {
    const stored = deferred<ThemePreference | null>();
    const { result } = await renderUnder({
      load: () => stored.promise,
      save: vi.fn(),
    });
    await act(() => {
      result.current.ctx.setPreference("light");
    });
    stored.resolve("dark");
    await flush();
    expect(result.current.ctx.preference).toBe("light");
  });

  it("follows the device scheme under 'system'", async () => {
    mockColorScheme.value = "dark";
    const { result } = await renderUnder({
      load: () => Promise.resolve(null),
      save: vi.fn(),
    });
    expect(result.current.scheme).toBe("dark");
    mockColorScheme.value = "light";
  });

  it("defaults to 'system' outside a provider", async () => {
    const { result } = await renderHook(useTheme);
    expect(result.current.ctx.preference).toBe("system");
  });
});
