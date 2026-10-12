import { describe, expect, it } from "vitest";

import { parseIsoDate } from "./parseIsoDate.js";

describe("parseIsoDate", () => {
  it("returns local midnight on that calendar day", () => {
    const date = parseIsoDate("2026-03-14");
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026, 2, 14,
    ]);
    expect([date.getHours(), date.getMinutes()]).toEqual([0, 0]);
  });
});
