import { afterEach, describe, expect, it, vi } from "vitest";

import { secureRandom } from "./secureRandom.js";

describe("secureRandom", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stays within [0, 1) across many draws", () => {
    for (let i = 0; i < 500; i++) {
      const value = secureRandom();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("maps the extreme 32-bit values onto [0, 1)", () => {
    const fill = (max: boolean) => ({
      getRandomValues: (array: Uint32Array) =>
        array.fill(max ? 0xffff_ffff : 0),
    });

    vi.stubGlobal("crypto", fill(false));
    expect(secureRandom()).toBe(0);

    vi.stubGlobal("crypto", fill(true));
    expect(secureRandom()).toBeLessThan(1);
  });

  it("throws instead of falling back to Math.random", () => {
    vi.stubGlobal("crypto", undefined);

    expect(() => secureRandom()).toThrow(/getRandomValues/);
  });
});
