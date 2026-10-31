import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { KitLocaleProvider } from "./KitLocaleProvider.js";
import { type KitLocale, useKitLocale } from "./locale.js";

/** The locale a component resolves, with its own `own` prop, under English. */
async function resolveUnderEnglish(own?: KitLocale) {
  const { result } = await renderHook(() => useKitLocale(own), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <KitLocaleProvider locale="en">{children}</KitLocaleProvider>
    ),
  });
  return result.current;
}

describe("useKitLocale", () => {
  it("defaults to French", async () => {
    const { result } = await renderHook(() => useKitLocale());
    expect(result.current).toBe("fr");
  });

  it("uses the nearest KitLocaleProvider", async () => {
    expect(await resolveUnderEnglish()).toBe("en");
  });

  it("lets the component's own locale prop win over the provider", async () => {
    expect(await resolveUnderEnglish("fr")).toBe("fr");
  });
});
