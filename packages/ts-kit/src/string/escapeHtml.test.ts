import { describe, expect, it } from "vitest";

import { escapeHtml } from "./escapeHtml.js";

describe("escapeHtml", () => {
  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Apple")).toBe("Apple");
  });

  it("escapes the ampersand", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hi"')).toBe("He said &quot;hi&quot;");
  });
});
