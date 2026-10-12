import { describe, expect, it } from "vitest";

import { mondayFirstWeekday } from "./mondayFirstWeekday.js";

describe("mondayFirstWeekday", () => {
  it("numbers Monday 0 through Sunday 6", () => {
    expect(mondayFirstWeekday("2026-10-12")).toBe(0); // Monday
    expect(mondayFirstWeekday("2026-10-15")).toBe(3); // Thursday
    expect(mondayFirstWeekday("2026-10-18")).toBe(6); // Sunday
  });

  it("accepts a Date as well as an ISO calendar date", () => {
    expect(mondayFirstWeekday(new Date(2026, 9, 18, 23, 30))).toBe(6);
  });
});
