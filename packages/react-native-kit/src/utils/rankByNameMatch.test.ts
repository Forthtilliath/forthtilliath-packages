import { describe, expect, it } from "vitest";

import { rankByNameMatch } from "./rankByNameMatch.js";

describe("rankByNameMatch", () => {
  interface Item {
    label: string;
  }
  const getName = (item: Item) => item.label;

  it("ne garde que les éléments dont le nom contient la recherche", () => {
    const items: Item[] = [
      { label: "Pomme" },
      { label: "Poire" },
      { label: "Banane" },
    ];
    const result = rankByNameMatch(items, "po", getName);
    expect(result.map(getName)).toEqual(["Pomme", "Poire"]);
  });

  it("classe par position du match dans le nom (plus tôt = plus pertinent)", () => {
    const items: Item[] = [
      { label: "Salade de pomme de terre" },
      { label: "Pomme de terre" },
    ];
    const result = rankByNameMatch(items, "pomme de terre", getName);
    expect(result.map(getName)).toEqual([
      "Pomme de terre",
      "Salade de pomme de terre",
    ]);
  });

  it("à position égale, classe par longueur de nom croissante", () => {
    const items: Item[] = [{ label: "Pomme golden bio" }, { label: "Pomme" }];
    const result = rankByNameMatch(items, "pomme", getName);
    expect(result.map(getName)).toEqual(["Pomme", "Pomme golden bio"]);
  });

  it("ignore les accents et la casse dans la recherche comme dans les noms", () => {
    const items: Item[] = [{ label: "Crème fraîche" }];
    expect(rankByNameMatch(items, "creme", getName)).toHaveLength(1);
    expect(rankByNameMatch(items, "CRÈME", getName)).toHaveLength(1);
  });

  it("retourne un tableau vide si rien ne correspond", () => {
    const items: Item[] = [{ label: "Pomme" }];
    expect(rankByNameMatch(items, "xyz", getName)).toEqual([]);
  });
});
