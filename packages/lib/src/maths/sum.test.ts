import { describe, expect, it } from "vitest";

import { sum } from "./sum.js";

describe("sum", () => {
  it("adds up all numbers in the array", () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
  });

  it("handles negative numbers", () => {
    expect(sum([-1, -2, 3])).toBe(0);
  });

  it("returns the single value for a one-element array", () => {
    expect(sum([42])).toBe(42);
  });

  it("returns 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });

  it("handles floating point numbers", () => {
    expect(sum([0.1, 0.2])).toBeCloseTo(0.3);
  });
});
