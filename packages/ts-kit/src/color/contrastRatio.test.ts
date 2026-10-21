import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  readableTextOn,
  relativeLuminance,
  TEXT_CONTRAST,
} from "./contrastRatio.js";

describe("relativeLuminance", () => {
  it("goes from 0 for black to 1 for white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBe(1);
  });

  it("accepts 3-digit, uppercase and #-less colours", () => {
    expect(relativeLuminance("#FFF")).toBe(1);
    expect(relativeLuminance("ffffff")).toBe(1);
  });

  it("rejects anything else", () => {
    expect(() => relativeLuminance("red")).toThrow(TypeError);
    expect(() => relativeLuminance("#12345")).toThrow(TypeError);
  });
});

describe("contrastRatio", () => {
  it("is 21 between black and white, in any order", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21);
  });

  it("is 1 between identical colours", () => {
    expect(contrastRatio("#3b82f6", "#3b82f6")).toBe(1);
  });

  it("matches the WCAG reference grey", () => {
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    expect(contrastRatio("#767676", "#ffffff")).toBeGreaterThan(TEXT_CONTRAST);
  });
});

describe("readableTextOn", () => {
  it("picks white on dark, black on light", () => {
    expect(readableTextOn("#16283d")).toBe("#ffffff");
    expect(readableTextOn("#84cc16")).toBe("#000000");
  });

  it("always reaches body text contrast", () => {
    for (const bg of ["#777777", "#3b82f6", "#ef4444", "#22c55e", "#a855f7"]) {
      expect(contrastRatio(readableTextOn(bg), bg)).toBeGreaterThanOrEqual(
        TEXT_CONTRAST,
      );
    }
  });
});
