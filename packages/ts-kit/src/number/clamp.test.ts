import { describe, expect, it } from "vitest";

import { clamp } from "./clamp.js";

describe("clamp", () => {
  it("returns the value unchanged when within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to the max when the value is too high", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("clamps to the min when the value is too low", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("handles min === max", () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});
