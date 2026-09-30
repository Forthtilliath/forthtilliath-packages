import { describe, expect, it } from "vitest";

import { dateInTimeZone } from "./dateInTimeZone.js";

describe("dateInTimeZone", () => {
  it("returns the date in the given time zone, not the machine's", () => {
    expect(dateInTimeZone("2026-03-14T23:30:00Z", "Europe/Paris")).toEqual({
      year: 2026,
      month: 3,
      day: 15,
      iso: "2026-03-15",
    });
    expect(dateInTimeZone("2026-03-14T23:30:00Z", "UTC").iso).toBe(
      "2026-03-14",
    );
    expect(dateInTimeZone("2026-03-15T03:00:00Z", "America/New_York").iso).toBe(
      "2026-03-14",
    );
  });

  it("accepts a Date or a timestamp", () => {
    const instant = Date.UTC(2026, 0, 5, 12);
    expect(dateInTimeZone(instant, "UTC").iso).toBe("2026-01-05");
    expect(dateInTimeZone(new Date(instant), "UTC").iso).toBe("2026-01-05");
  });

  it("throws on an invalid time zone", () => {
    expect(() => dateInTimeZone(0, "Mars/Olympus")).toThrow(RangeError);
  });
});
