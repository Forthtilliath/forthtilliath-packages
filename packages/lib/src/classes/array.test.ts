import { describe, expect, it } from "vitest";

import { FArray } from "./array.js";

type Fbb = "foo" | "bar" | "baz";

describe("FArray", () => {
  it("behaves like a regular array (length, index access, iteration)", () => {
    const arr = new FArray<Fbb>("foo", "bar", "baz");

    expect(arr.length).toBe(3);
    expect(arr[0]).toBe("foo");
    expect([...arr]).toEqual(["foo", "bar", "baz"]);
    expect(arr).toBeInstanceOf(Array);
  });

  it("includes() returns true when the element is present", () => {
    const arr = new FArray<Fbb>("foo", "bar", "baz");

    expect(arr.includes("bar")).toBe(true);
  });

  it("includes() returns false when the element is absent", () => {
    const arr = new FArray<Fbb>("foo", "bar", "baz");

    expect(arr.includes("qux")).toBe(false);
  });

  it("includes() respects the fromIndex argument like Array.includes", () => {
    const arr = new FArray<Fbb>("foo", "bar", "baz");

    expect(arr.includes("foo", 1)).toBe(false);
    expect(arr.includes("bar", 1)).toBe(true);
  });

  it("includes() on an empty array always returns false", () => {
    const arr = new FArray<Fbb>();

    expect(arr.includes("foo")).toBe(false);
  });

  it("supports standard array methods such as map", () => {
    const arr = new FArray<Fbb>("foo", "bar", "baz");

    expect(arr.map((value) => value.toUpperCase())).toEqual([
      "FOO",
      "BAR",
      "BAZ",
    ]);
  });
});
