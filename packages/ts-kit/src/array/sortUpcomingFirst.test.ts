import { describe, expect, it } from "vitest";

import { sortUpcomingFirst } from "./sortUpcomingFirst.js";

interface Event {
  id: string;
  dates: string[];
}

const NOW = "2026-06-01T12:00:00.000Z";

function ids(events: Event[]): string[] {
  return sortUpcomingFirst(events, (e) => e.dates, { now: NOW }).map(
    (e) => e.id,
  );
}

describe("sortUpcomingFirst", () => {
  it("returns an empty array for no items", () => {
    expect(sortUpcomingFirst([], (d: string) => d)).toEqual([]);
  });

  it("puts upcoming items first (nearest first), then past ones (most recent first)", () => {
    const dates = ["2026-01-01", "2026-12-01", "2026-03-01", "2026-10-01"];
    expect(sortUpcomingFirst(dates, (d) => d, { now: NOW })).toEqual([
      "2026-10-01",
      "2026-12-01",
      "2026-03-01",
      "2026-01-01",
    ]);
  });

  it("counts a date equal to now as upcoming", () => {
    const dates = ["2026-05-01", NOW];
    expect(sortUpcomingFirst(dates, (d) => d, { now: NOW })).toEqual([
      NOW,
      "2026-05-01",
    ]);
  });

  it("ranks a multi-date item by its next date while one is still ahead", () => {
    const events = [
      { id: "a", dates: ["2026-05-01", "2026-09-01"] },
      { id: "b", dates: ["2026-07-01"] },
    ];
    expect(ids(events)).toEqual(["b", "a"]);
  });

  it("ranks a fully past multi-date item by its latest date", () => {
    const events = [
      { id: "a", dates: ["2026-01-01", "2026-05-01"] },
      { id: "b", dates: ["2026-04-01"] },
    ];
    expect(ids(events)).toEqual(["a", "b"]);
  });

  it("puts items without a valid date last, in their original order", () => {
    const events = [
      { id: "none", dates: [] },
      { id: "invalid", dates: ["not a date"] },
      { id: "past", dates: ["2026-01-01"] },
      { id: "next", dates: ["2026-07-01"] },
    ];
    expect(ids(events)).toEqual(["next", "past", "none", "invalid"]);
  });

  it("accepts Date objects, timestamps and nullish selectors", () => {
    const items = [
      { id: "past", at: new Date("2026-01-01") },
      { id: "none", at: null },
      { id: "next", at: Date.parse("2026-07-01") },
    ];
    expect(
      sortUpcomingFirst(items, (i) => i.at, { now: NOW }).map((i) => i.id),
    ).toEqual(["next", "past", "none"]);
  });

  it("keeps the original order on ties and does not mutate the input", () => {
    const events = [
      { id: "a", dates: ["2026-07-01"] },
      { id: "b", dates: ["2026-07-01"] },
    ];
    const copy = [...events];
    expect(ids(events)).toEqual(["a", "b"]);
    expect(events).toEqual(copy);
  });
});
