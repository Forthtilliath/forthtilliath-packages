import { describe, expect, it } from "vitest";

import { omit } from "./omit.js";

describe("omit", () => {
  it("removes the specified keys", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
  });

  it("returns a shallow copy when given no keys", () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, [])).toEqual(obj);
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    omit(obj, ["a"]);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
