import { describe, expect, it } from "vitest";

import { daysUntil } from "./daysUntil.js";

describe("daysUntil", () => {
  // 2026-03-14 23:00 in Paris (UTC+1)
  const now = new Date("2026-03-14T22:00:00Z");

  it("counts calendar days, not 24-hour periods", () => {
    expect(daysUntil("2026-03-15T08:00:00+01:00", "Europe/Paris", now)).toBe(1);
    expect(daysUntil("2026-03-14T00:30:00+01:00", "Europe/Paris", now)).toBe(0);
    expect(daysUntil("2026-03-13T23:59:00+01:00", "Europe/Paris", now)).toBe(
      -1,
    );
  });

  it("depends on the time zone", () => {
    expect(daysUntil("2026-03-14T23:30:00Z", "UTC", now)).toBe(0);
    expect(daysUntil("2026-03-14T23:30:00Z", "Europe/Paris", now)).toBe(1);
  });

  it("is not thrown off by daylight saving time", () => {
    // Paris switches to summer time on 2026-03-29
    expect(daysUntil("2026-04-14T12:00:00+02:00", "Europe/Paris", now)).toBe(
      31,
    );
  });

  it("accepts a date-only string (UTC midnight)", () => {
    expect(daysUntil("2026-03-20", "UTC", now)).toBe(6);
  });

  it("defaults to now", () => {
    expect(daysUntil(new Date(), "Europe/Paris")).toBe(0);
  });
});
