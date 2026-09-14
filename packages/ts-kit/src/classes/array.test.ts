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

  describe("indexOf", () => {
    it("returns the index of the first match", () => {
      const arr = new FArray<Fbb>("foo", "bar", "baz");

      expect(arr.indexOf("bar")).toBe(1);
    });

    it("returns -1 for a value outside of Fbb, without a compile error", () => {
      const arr = new FArray<Fbb>("foo", "bar", "baz");

      expect(arr.indexOf("qux")).toBe(-1);
    });

    it("respects the fromIndex argument like Array.indexOf", () => {
      const arr = new FArray<Fbb>("foo", "bar", "foo");

      expect(arr.indexOf("foo", 1)).toBe(2);
    });
  });

  describe("lastIndexOf", () => {
    it("returns the index of the last match", () => {
      const arr = new FArray<Fbb>("foo", "bar", "foo");

      expect(arr.lastIndexOf("foo")).toBe(2);
    });

    it("returns -1 for a value outside of Fbb, without a compile error", () => {
      const arr = new FArray<Fbb>("foo", "bar", "baz");

      expect(arr.lastIndexOf("qux")).toBe(-1);
    });

    it("respects the fromIndex argument like Array.lastIndexOf", () => {
      const arr = new FArray<Fbb>("foo", "bar", "foo");

      expect(arr.lastIndexOf("foo", 1)).toBe(0);
    });

    it("defaults to searching from the end, on an empty array too", () => {
      expect(new FArray<Fbb>().lastIndexOf("foo")).toBe(-1);
    });
  });

  describe("filter", () => {
    it("with Boolean, drops falsy values like the native method", () => {
      const arr = new FArray<number | null | undefined>(
        1,
        null,
        2,
        undefined,
        0,
      );

      const result = arr.filter(Boolean);

      expect(result).toEqual([1, 2]);
      expect(result).toBeInstanceOf(FArray);
    });

    it("with a regular predicate, behaves like Array.filter", () => {
      const arr = new FArray(1, 2, 3, 4);

      expect(arr.filter((n) => n % 2 === 0)).toEqual([2, 4]);
    });

    it("with a type-guard predicate, narrows the result's element type", () => {
      const arr = new FArray<number | string>(1, "a", 2, "b");

      const strings = arr.filter((v): v is string => typeof v === "string");

      expect(strings).toEqual(["a", "b"]);
    });
  });

  describe("static from / of", () => {
    it("from() builds an FArray instance from a plain array", () => {
      const result = FArray.from([1, 2, 3]);

      expect(result).toEqual([1, 2, 3]);
      expect(result).toBeInstanceOf(FArray);
    });

    it("from() supports a map function like Array.from", () => {
      const result = FArray.from([1, 2, 3], (n) => n * 2);

      expect(result).toEqual([2, 4, 6]);
      expect(result).toBeInstanceOf(FArray);
    });

    it("of() builds an FArray instance from its arguments", () => {
      const result = FArray.of(1, 2, 3);

      expect(result).toEqual([1, 2, 3]);
      expect(result).toBeInstanceOf(FArray);
    });
  });

  describe("toArray", () => {
    it("returns a plain Array with the same elements", () => {
      const arr = new FArray(1, 2, 3);

      const plain = arr.toArray();

      expect(plain).toEqual([1, 2, 3]);
      expect(plain).not.toBeInstanceOf(FArray);
      expect(plain).toBeInstanceOf(Array);
    });
  });
});
