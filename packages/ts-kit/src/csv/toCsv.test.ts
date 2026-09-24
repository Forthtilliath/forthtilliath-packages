import { describe, expect, it } from "vitest";

import { toCsv } from "./toCsv.js";

describe("toCsv", () => {
  it("quotes every cell and joins rows with line breaks", () => {
    expect(
      toCsv([
        ["name", "age"],
        ["Ann", 32],
      ]),
    ).toBe('"name","age"\n"Ann","32"');
  });

  it("doubles internal double quotes", () => {
    expect(toCsv([['say "hi"']])).toBe('"say ""hi"""');
  });

  it("keeps delimiters and line breaks safe inside cells", () => {
    expect(toCsv([["a,b", "c\nd"]])).toBe('"a,b","c\nd"');
  });

  it("supports a custom delimiter", () => {
    expect(toCsv([["a", "b"]], ";")).toBe('"a";"b"');
  });

  it("returns an empty string for no rows", () => {
    expect(toCsv([])).toBe("");
  });
});
