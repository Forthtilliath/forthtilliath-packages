import { describe, expect, it } from "vitest";

import { avg } from "./average.js";

describe("avg", () => {
  it("computes the average of an array of numbers", () => {
    expect(avg([1, 2, 3, 4, 5])).toBe(3);
  });

  it("returns the value itself for a single-element array", () => {
    expect(avg([42])).toBe(42);
  });

  it("handles negative numbers", () => {
    expect(avg([-2, 0, 2])).toBe(0);
  });

  it("returns NaN for an empty array", () => {
    expect(avg([])).toBeNaN();
  });

  it("handles floating point results", () => {
    expect(avg([1, 2])).toBeCloseTo(1.5);
  });
});
