import { describe, expect, it } from "vitest";

import { formatRecentDate } from "./formatRecentDate.js";

const now = new Date(2026, 9, 12, 10, 0);

describe("formatRecentDate", () => {
  it("gives the time for today and yesterday", () => {
    expect(formatRecentDate(new Date(2026, 9, 12, 8, 5), { now })).toBe(
      "aujourd'hui à 08:05",
    );
    expect(formatRecentDate(new Date(2026, 9, 11, 21, 42), { now })).toBe(
      "hier à 21:42",
    );
  });

  it("gives the day only from the day before yesterday", () => {
    expect(formatRecentDate(new Date(2026, 9, 10, 23, 59), { now })).toBe(
      "le 10 octobre 2026",
    );
  });

  it("reads a future date as today", () => {
    expect(formatRecentDate(new Date(2026, 9, 13, 9, 30), { now })).toBe(
      "aujourd'hui à 09:30",
    );
  });

  it("speaks English with locale en", () => {
    const opts = { now, locale: "en" } as const;
    expect(formatRecentDate(new Date(2026, 9, 12, 8, 5), opts)).toBe(
      "today at 08:05 AM",
    );
    expect(formatRecentDate(new Date(2026, 9, 11, 21, 42), opts)).toBe(
      "yesterday at 09:42 PM",
    );
    expect(formatRecentDate(new Date(2026, 8, 1), opts)).toBe(
      "on September 1, 2026",
    );
  });
});
