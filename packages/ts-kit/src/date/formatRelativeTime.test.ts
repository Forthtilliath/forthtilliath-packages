import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./formatRelativeTime.js";

describe("formatRelativeTime", () => {
  const base = new Date("2026-03-14T12:00:00.000Z");

  it("formats a past time in the largest fitting unit", () => {
    expect(formatRelativeTime(new Date(base.getTime() - 3_600_000), base)).toBe(
      "1 hour ago",
    );
  });

  it("formats a future time", () => {
    expect(
      formatRelativeTime(new Date(base.getTime() + 2 * 86_400_000), base),
    ).toBe("in 2 days");
  });

  it("falls back to seconds for sub-minute differences", () => {
    expect(formatRelativeTime(new Date(base.getTime() - 30_000), base)).toBe(
      "30 seconds ago",
    );
  });

  it("defaults baseDate to now when omitted", () => {
    expect(formatRelativeTime(new Date())).toMatch(/now|second/);
  });
});
