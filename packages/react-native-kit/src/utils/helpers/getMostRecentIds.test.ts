import { describe, expect, it } from "vitest";

import { getMostRecentIds, type RecentIdRow } from "./getMostRecentIds.js";

function row(id: number | null, occurredAt: string): RecentIdRow {
  return { id, occurredAt };
}

describe("getMostRecentIds", () => {
  it("retourne un tableau vide sans ligne", () => {
    expect(getMostRecentIds([])).toEqual([]);
  });

  it("trie du plus récent au plus ancien", () => {
    const rows = [
      row(1, "2026-01-01T00:00:00.000Z"),
      row(2, "2026-01-03T00:00:00.000Z"),
      row(3, "2026-01-02T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([2, 3, 1]);
  });

  it("dédoublonne un id vu plusieurs fois, en gardant sa date la plus récente pour le tri", () => {
    const rows = [
      row(1, "2026-01-01T00:00:00.000Z"),
      row(2, "2026-01-02T00:00:00.000Z"),
      row(1, "2026-01-05T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([1, 2]);
  });

  it("ignore les lignes dont la référence a été supprimée (id null)", () => {
    const rows = [
      row(null, "2026-01-05T00:00:00.000Z"),
      row(1, "2026-01-01T00:00:00.000Z"),
    ];
    expect(getMostRecentIds(rows)).toEqual([1]);
  });

  it("respecte la limite fournie", () => {
    const rows = [1, 2, 3, 4, 5, 6].map((id) =>
      row(id, `2026-01-0${String(id)}T00:00:00.000Z`),
    );
    expect(getMostRecentIds(rows, 3)).toEqual([6, 5, 4]);
  });
});
