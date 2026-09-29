/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { KitLocaleProvider } from "./KitLocaleProvider.js";
import { type KitLocale, useKitLocale } from "./locale.js";

// Renders `node` and returns the locale the probe resolved.
function resolveLocale(
  render: (probe: React.ReactNode) => React.ReactNode,
  own?: KitLocale,
) {
  let resolved: KitLocale | undefined;
  function Probe() {
    resolved = useKitLocale(own);
    return null;
  }
  act(() => {
    create(<>{render(<Probe />)}</>);
  });
  return resolved;
}

describe("useKitLocale", () => {
  it("defaults to French", () => {
    expect(resolveLocale((probe) => probe)).toBe("fr");
  });

  it("uses the nearest KitLocaleProvider", () => {
    expect(
      resolveLocale((probe) => (
        <KitLocaleProvider locale="en">{probe}</KitLocaleProvider>
      )),
    ).toBe("en");
  });

  it("lets the component's own locale prop win over the provider", () => {
    expect(
      resolveLocale(
        (probe) => <KitLocaleProvider locale="en">{probe}</KitLocaleProvider>,
        "fr",
      ),
    ).toBe("fr");
  });
});
