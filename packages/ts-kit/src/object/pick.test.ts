import { describe, expect, it } from "vitest";

import { pick } from "./pick.js";

describe("pick", () => {
  it("keeps only the specified keys", () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("returns an empty object when given no keys", () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });

  it("ignores keys the source object does not own", () => {
    const obj = { a: 1 } as { a: number; b?: number };
    expect(pick(obj, ["a", "b"])).toEqual({ a: 1 });
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    pick(obj, ["a"]);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
