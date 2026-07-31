import { describe, expect, it } from "vitest";

import { escapeCsvField } from "./escapeCsvField.js";

describe("escapeCsvField", () => {
  it("laisse une valeur simple inchangée", () => {
    expect(escapeCsvField("Pomme")).toBe("Pomme");
  });

  it("entoure de guillemets une valeur contenant un point-virgule", () => {
    expect(escapeCsvField("a;b")).toBe('"a;b"');
  });

  it("entoure de guillemets une valeur contenant un saut de ligne", () => {
    expect(escapeCsvField("a\nb")).toBe('"a\nb"');
  });

  it("double les guillemets internes et entoure le résultat", () => {
    expect(escapeCsvField('Il a dit "salut"')).toBe('"Il a dit ""salut"""');
  });
});
