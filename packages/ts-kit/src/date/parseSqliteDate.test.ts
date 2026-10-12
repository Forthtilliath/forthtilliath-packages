import { describe, expect, it } from "vitest";

import { parseSqliteDate } from "./parseSqliteDate.js";

describe("parseSqliteDate", () => {
  it("reads a SQLite current_timestamp value as UTC", () => {
    expect(parseSqliteDate("2026-10-09 19:46:00").toISOString()).toBe(
      "2026-10-09T19:46:00.000Z",
    );
  });

  it("keeps fractional seconds", () => {
    expect(parseSqliteDate("2026-10-09 19:46:00.250").toISOString()).toBe(
      "2026-10-09T19:46:00.250Z",
    );
  });

  it("reads a full ISO string as it is", () => {
    expect(parseSqliteDate("2026-01-15T12:30:00.000Z").toISOString()).toBe(
      "2026-01-15T12:30:00.000Z",
    );
  });

  it("honours an explicit offset", () => {
    expect(parseSqliteDate("2026-10-09T21:46:00+02:00").toISOString()).toBe(
      "2026-10-09T19:46:00.000Z",
    );
  });
});
