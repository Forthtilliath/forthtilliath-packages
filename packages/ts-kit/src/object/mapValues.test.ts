import { describe, expect, it } from "vitest";

import { mapValues } from "./mapValues.js";

describe("mapValues", () => {
  it("maps every value through fn, keeping the same keys", () => {
    expect(mapValues({ a: 1, b: 2 }, (n) => n * 2)).toEqual({ a: 2, b: 4 });
  });

  it("passes the key alongside the value", () => {
    expect(mapValues({ a: 1, b: 2 }, (n, key) => `${key}:${n}`)).toEqual({
      a: "a:1",
      b: "b:2",
    });
  });

  it("returns an empty object for an empty input", () => {
    expect(mapValues({}, (n: number) => n)).toEqual({});
  });
});
