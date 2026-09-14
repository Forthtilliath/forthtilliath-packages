import { describe, expect, it } from "vitest";

import { startOfDay } from "./startOfDay.js";

describe("startOfDay", () => {
  it("resets the time to local midnight", () => {
    const result = startOfDay(new Date(2026, 2, 14, 18, 30, 45, 500));
    expect(result).toEqual(new Date(2026, 2, 14, 0, 0, 0, 0));
  });

  it("does not mutate the input date", () => {
    const input = new Date(2026, 2, 14, 18, 30);
    startOfDay(input);
    expect(input).toEqual(new Date(2026, 2, 14, 18, 30));
  });

  it("defaults to today when called without arguments", () => {
    const result = startOfDay();
    const now = new Date();
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getMonth()).toBe(now.getMonth());
    expect(result.getDate()).toBe(now.getDate());
    expect(result.getHours()).toBe(0);
  });
});
