import { describe, expect, it } from "vitest";

import { indexById } from "./indexById.js";

describe("indexById", () => {
  it("maps each id to its item", () => {
    const ann = { id: "a", name: "Ann" };
    const bob = { id: "b", name: "Bob" };
    const byId = indexById([ann, bob]);
    expect(byId.get("a")).toBe(ann);
    expect(byId.get("b")).toBe(bob);
    expect(byId.get("c")).toBeUndefined();
    expect(byId.size).toBe(2);
  });

  it("keeps the last item for a duplicate id", () => {
    const byId = indexById([
      { id: 1, v: "first" },
      { id: 1, v: "last" },
    ]);
    expect(byId.get(1)?.v).toBe("last");
    expect(byId.size).toBe(1);
  });

  it("returns an empty map for no items", () => {
    expect(indexById([]).size).toBe(0);
  });
});
