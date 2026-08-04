import { describe, expect, it } from "vitest";

import { escapeHtml } from "./escapeHtml.js";

describe("escapeHtml", () => {
  it("laisse un texte simple inchangé", () => {
    expect(escapeHtml("Pomme")).toBe("Pomme");
  });

  it("échappe l'esperluette", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("échappe les chevrons", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("échappe les guillemets doubles", () => {
    expect(escapeHtml('Il a dit "salut"')).toBe("Il a dit &quot;salut&quot;");
  });
});
