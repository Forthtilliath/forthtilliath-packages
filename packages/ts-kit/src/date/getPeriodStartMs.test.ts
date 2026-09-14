import { describe, expect, it } from "vitest";

import { getPeriodStartMs } from "./getPeriodStartMs.js";

// Wednesday, January 15, 2026, 14:30.
const NOW = new Date(2026, 0, 15, 14, 30, 0);

describe("getPeriodStartMs", () => {
  it("returns null for 'all' (no date filter)", () => {
    expect(getPeriodStartMs("all", NOW)).toBeNull();
  });

  it("returns the start of the current calendar day for 'today'", () => {
    const startOfDay = new Date(2026, 0, 15, 0, 0, 0, 0).getTime();
    expect(getPeriodStartMs("today", NOW)).toBe(startOfDay);
  });

  it("returns 7 days back for '7d'", () => {
    const expected = NOW.getTime() - 7 * 24 * 60 * 60 * 1000;
    expect(getPeriodStartMs("7d", NOW)).toBe(expected);
  });

  it("returns 30 days back for '30d'", () => {
    const expected = NOW.getTime() - 30 * 24 * 60 * 60 * 1000;
    expect(getPeriodStartMs("30d", NOW)).toBe(expected);
  });
});
