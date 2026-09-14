import { describe, expect, it } from "vitest";

import { getMostRecentIds, type RecentIdRow } from "./getMostRecentIds.js";

function row(id: number | null, occurredAt: string): RecentIdRow {
  return { id, occurredAt };
}

describe("getMostRecentIds", () => {
  it("returns an empty array for no rows", () => {
    expect(getMostRecentIds([])).toEqual([]);
  });

  it("sorts from most to least recent", () => {
    const rows = [
      row(1, "2026-01-01T00:00:00.000Z"),
      row(2, "2026-01-03T00:00:00.000Z"),
      row(3, "2026-01-02T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([2, 3, 1]);
  });

  it("deduplicates an id seen multiple times, keeping its most recent date for sorting", () => {
    const rows = [
      row(1, "2026-01-01T00:00:00.000Z"),
      row(2, "2026-01-02T00:00:00.000Z"),
      row(1, "2026-01-05T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([1, 2]);
  });

  it("ignores rows whose reference was deleted (null id)", () => {
    const rows = [
      row(null, "2026-01-05T00:00:00.000Z"),
      row(1, "2026-01-01T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([1]);
  });

  it("honors the given limit", () => {
    const rows = [1, 2, 3, 4, 5, 6].map((id) =>
      row(id, `2026-01-0${String(id)}T00:00:00.000Z`),
    );
    expect(getMostRecentIds(rows, 3)).toEqual([6, 5, 4]);
  });
});
