import { describe, expect, it } from "vitest";

import { isSameDay } from "./isSameDay.js";

describe("isSameDay", () => {
  it("returns true for two times on the same day", () => {
    expect(
      isSameDay(new Date(2026, 2, 14, 8, 0), new Date(2026, 2, 14, 22, 0)),
    ).toBe(true);
  });

  it("returns false for different days", () => {
    expect(
      isSameDay(new Date(2026, 2, 14, 23, 59), new Date(2026, 2, 15, 0, 0)),
    ).toBe(false);
  });

  it("returns false for the same day/month in different years", () => {
    expect(isSameDay(new Date(2025, 2, 14), new Date(2026, 2, 14))).toBe(false);
  });
});
