/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { mockColorScheme } from "../../__mocks__/react-native.js";
import { renderTree } from "../../__mocks__/renderTree.js";
import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

import {
  type ThemePreferenceContextValue,
  useResolvedScheme,
  useThemePreference,
} from "./themePreferenceContext.js";
import { ThemePreferenceProvider } from "./ThemePreferenceProvider.js";

interface Seen {
  ctx?: ThemePreferenceContextValue;
  scheme?: "light" | "dark";
}

// Reports what it reads through a callback (props themselves are immutable).
function Probe({ report }: { report: (seen: Required<Seen>) => void }) {
  const ctx = useThemePreference();
  const scheme = useResolvedScheme();
  report({ ctx, scheme });
  return null;
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
    const seen: Seen = {};
    const stored = deferred<ThemePreference | null>();
    renderTree(
      <ThemePreferenceProvider load={() => stored.promise} save={vi.fn()}>
        <Probe report={(s) => Object.assign(seen, s)} />
      </ThemePreferenceProvider>,
    );
    expect(seen.ctx?.preference).toBe("system");

    stored.resolve("dark");
    await flush();
    expect(seen.ctx?.preference).toBe("dark");
    expect(seen.scheme).toBe("dark");
  });

  it("keeps the initial preference when nothing is saved", async () => {
    const seen: Seen = {};
    renderTree(
      <ThemePreferenceProvider
        load={() => Promise.resolve(null)}
        save={vi.fn()}
        initialPreference="light"
      >
        <Probe report={(s) => Object.assign(seen, s)} />
      </ThemePreferenceProvider>,
    );
    await flush();
    expect(seen.ctx?.preference).toBe("light");
  });

  it("applies and saves a new choice", async () => {
    const seen: Seen = {};
    const save = vi.fn();
    renderTree(
      <ThemePreferenceProvider load={() => Promise.resolve(null)} save={save}>
        <Probe report={(s) => Object.assign(seen, s)} />
      </ThemePreferenceProvider>,
    );
    await flush();
    act(() => {
      seen.ctx?.setPreference("dark");
    });
    expect(seen.ctx?.preference).toBe("dark");
    expect(save).toHaveBeenCalledWith("dark");
  });

  it("doesn't let a late load overwrite a choice made meanwhile", async () => {
    const seen: Seen = {};
    const stored = deferred<ThemePreference | null>();
    renderTree(
      <ThemePreferenceProvider load={() => stored.promise} save={vi.fn()}>
        <Probe report={(s) => Object.assign(seen, s)} />
      </ThemePreferenceProvider>,
    );
    act(() => {
      seen.ctx?.setPreference("light");
    });
    stored.resolve("dark");
    await flush();
    expect(seen.ctx?.preference).toBe("light");
  });

  it("follows the device scheme under 'system'", () => {
    mockColorScheme.value = "dark";
    const seen: Seen = {};
    renderTree(
      <ThemePreferenceProvider
        load={() => Promise.resolve(null)}
        save={vi.fn()}
      >
        <Probe report={(s) => Object.assign(seen, s)} />
      </ThemePreferenceProvider>,
    );
    expect(seen.scheme).toBe("dark");
    mockColorScheme.value = "light";
  });

  it("defaults to 'system' outside a provider", () => {
    const seen: Seen = {};
    renderTree(<Probe report={(s) => Object.assign(seen, s)} />);
    expect(seen.ctx?.preference).toBe("system");
  });
});
