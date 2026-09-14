import { describe, expect, it } from "vitest";

import { nextInCycle } from "./nextInCycle.js";

describe("nextInCycle", () => {
  it("returns null for an empty list", () => {
    expect(nextInCycle([], null)).toBeNull();
    expect(nextInCycle([], 5)).toBeNull();
  });

  it("returns the first element when nothing is selected", () => {
    expect(nextInCycle([1, 2, 3], null)).toBe(1);
  });

  it("returns the element following the current one", () => {
    expect(nextInCycle([1, 2, 3], 1)).toBe(2);
    expect(nextInCycle([1, 2, 3], 2)).toBe(3);
  });

  it("wraps to the first element after the last", () => {
    expect(nextInCycle([1, 2, 3], 3)).toBe(1);
  });

  it("restarts from the first element when the current one is no longer in the list", () => {
    expect(nextInCycle([1, 2, 3], 99)).toBe(1);
  });

  it("handles a single-element list (stays on itself)", () => {
    expect(nextInCycle([1], 1)).toBe(1);
    expect(nextInCycle([1], null)).toBe(1);
  });
});
