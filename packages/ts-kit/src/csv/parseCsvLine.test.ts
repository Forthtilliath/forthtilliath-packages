import { describe, expect, it } from "vitest";

import { parseCsvLine } from "./parseCsvLine.js";

describe("parseCsvLine", () => {
  it("splits on commas and trims every cell", () => {
    expect(parseCsvLine("a, b ,c")).toEqual(["a", "b", "c"]);
  });

  it("keeps delimiters inside quoted cells", () => {
    expect(parseCsvLine('a,"b, c",d')).toEqual(["a", "b, c", "d"]);
  });

  it("unescapes doubled double quotes inside quoted cells", () => {
    expect(parseCsvLine('"He said ""hi""",x')).toEqual(['He said "hi"', "x"]);
  });

  it("keeps empty cells", () => {
    expect(parseCsvLine("a,,c,")).toEqual(["a", "", "c", ""]);
    expect(parseCsvLine("")).toEqual([""]);
  });

  it("supports a custom delimiter", () => {
    expect(parseCsvLine('a;"b;c";d', ";")).toEqual(["a", "b;c", "d"]);
  });

  it("round-trips the output of a quoted row", () => {
    expect(parseCsvLine('"name","say ""hi""","a,b"')).toEqual([
      "name",
      'say "hi"',
      "a,b",
    ]);
  });
});
