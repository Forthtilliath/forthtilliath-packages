import { describe, expect, it } from "vitest";

import { formatFileTimestamp } from "./formatFileTimestamp.js";

describe("formatFileTimestamp", () => {
  it("formats the local date and time as YYYYMMDD-HHMM", () => {
    expect(formatFileTimestamp(new Date(2026, 9, 8, 9, 2))).toBe(
      "20261008-0902",
    );
  });

  it("keeps the local day just after midnight", () => {
    expect(formatFileTimestamp(new Date(2026, 0, 1, 0, 30))).toBe(
      "20260101-0030",
    );
  });

  it("appends seconds and uses a custom separator", () => {
    const date = new Date(2026, 6, 22, 9, 38, 5);
    expect(formatFileTimestamp(date, { seconds: true, separator: "" })).toBe(
      "20260722093805",
    );
  });

  it("produces names that sort chronologically", () => {
    const names = [
      new Date(2026, 9, 10, 8, 0),
      new Date(2026, 8, 30, 23, 59),
    ].map((d) => formatFileTimestamp(d));
    expect([...names].sort()).toEqual([names[1], names[0]]);
  });
});
