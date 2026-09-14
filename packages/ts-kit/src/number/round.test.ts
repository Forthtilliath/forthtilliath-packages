import { describe, expect, it } from "vitest";

import { round } from "./round.js";

describe("round", () => {
  it("rounds to the nearest integer by default", () => {
    expect(round(1.5)).toBe(2);
    expect(round(1.4)).toBe(1);
  });

  it("rounds to the given number of decimal places", () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.005, 2)).toBe(1.01);
  });

  it("handles negative numbers", () => {
    expect(round(-1.5)).toBe(-1);
  });
});
