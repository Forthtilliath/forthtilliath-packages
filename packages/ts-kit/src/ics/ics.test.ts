import { describe, expect, it } from "vitest";

import { escapeIcsText } from "./escapeIcsText.js";
import { foldIcsLine } from "./foldIcsLine.js";
import { icsTimestamp } from "./icsTimestamp.js";
import { toIcsDate } from "./toIcsDate.js";
import { toIcsDateTime } from "./toIcsDateTime.js";

const encoder = new TextEncoder();
const octets = (s: string) => encoder.encode(s).length;

describe("escapeIcsText", () => {
  it("escapes backslashes, semicolons, commas and line breaks", () => {
    expect(escapeIcsText("a\\b;c,d\ne\r\nf")).toBe("a\\\\b\\;c\\,d\\ne\\nf");
  });
});

describe("foldIcsLine", () => {
  it("leaves a line of 75 octets or less untouched", () => {
    const line = "x".repeat(75);
    expect(foldIcsLine(line)).toBe(line);
  });

  it("folds on 75 octets, continuation lines starting with a space", () => {
    const folded = foldIcsLine("x".repeat(160));
    const lines = folded.split("\r\n");
    // 75 + (space + 74) + (space + 11) = the 160 characters.
    expect(lines.map((l) => l.length)).toEqual([75, 75, 12]);
    expect(lines[1]?.startsWith(" ")).toBe(true);
    expect(folded.replace(/\r\n /g, "")).toBe("x".repeat(160));
  });

  it("counts UTF-8 octets and never splits a character", () => {
    const line = `DESCRIPTION:${"é".repeat(40)}🙂${"à".repeat(10)}`;
    const lines = foldIcsLine(line).split("\r\n");
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every((l) => octets(l) <= 75)).toBe(true);
    // A split surrogate pair wouldn't survive a UTF-8 round trip.
    const decoder = new TextDecoder();
    expect(lines.every((l) => decoder.decode(encoder.encode(l)) === l)).toBe(
      true,
    );
    expect(foldIcsLine(line).replace(/\r\n /g, "")).toBe(line);
  });
});

describe("toIcsDate / toIcsDateTime / icsTimestamp", () => {
  it("formats calendar dates and wall-clock times", () => {
    expect(toIcsDate("2026-07-14")).toBe("20260714");
    expect(toIcsDateTime("2026-07-14", "6:30")).toBe("20260714T063000");
    expect(toIcsDateTime("2026-07-14", "20:05")).toBe("20260714T200500");
  });

  it("formats an instant in UTC", () => {
    expect(icsTimestamp(new Date("2026-07-14T08:05:09.123Z"))).toBe(
      "20260714T080509Z",
    );
    expect(icsTimestamp()).toMatch(/^\d{8}T\d{6}Z$/);
  });
});
