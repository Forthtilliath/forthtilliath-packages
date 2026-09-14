import { describe, expect, it } from "vitest";

import { rankByNameMatch } from "./rankByNameMatch.js";

describe("rankByNameMatch", () => {
  interface Item {
    label: string;
  }
  const getName = (item: Item) => item.label;

  it("keeps only items whose name contains the search", () => {
    const items: Item[] = [
      { label: "Apple" },
      { label: "Apricot" },
      { label: "Banana" },
    ];
    const result = rankByNameMatch(items, "ap", getName);
    expect(result.map(getName)).toEqual(["Apple", "Apricot"]);
  });

  it("ranks by match position in the name (earlier is more relevant)", () => {
    const items: Item[] = [
      { label: "Salad with potato" },
      { label: "Potato salad" },
    ];
    const result = rankByNameMatch(items, "potato", getName);
    expect(result.map(getName)).toEqual(["Potato salad", "Salad with potato"]);
  });

  it("at equal position, ranks by ascending name length", () => {
    const items: Item[] = [
      { label: "Organic golden apple" },
      { label: "Apple" },
    ];
    const result = rankByNameMatch(items, "apple", getName);
    expect(result.map(getName)).toEqual(["Apple", "Organic golden apple"]);
  });

  it("ignores accents and case in both the search and the names", () => {
    const items: Item[] = [{ label: "Crème fraîche" }];
    expect(rankByNameMatch(items, "creme", getName)).toHaveLength(1);
    expect(rankByNameMatch(items, "CRÈME", getName)).toHaveLength(1);
  });

  it("returns an empty array when nothing matches", () => {
    const items: Item[] = [{ label: "Apple" }];
    expect(rankByNameMatch(items, "xyz", getName)).toEqual([]);
  });
});
