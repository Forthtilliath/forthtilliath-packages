import { describe, expect, it } from "vitest";

import { todayInTimeZone } from "./todayInTimeZone.js";

describe("todayInTimeZone", () => {
  it("returns the reference date in the time zone", () => {
    const now = new Date("2026-09-29T22:30:00Z");
    expect(todayInTimeZone("Europe/Paris", now).iso).toBe("2026-09-30");
    expect(todayInTimeZone("UTC", now).iso).toBe("2026-09-29");
  });

  it("defaults to now", () => {
    expect(todayInTimeZone("UTC").iso).toBe(
      new Date().toISOString().slice(0, 10),
    );
  });
});
