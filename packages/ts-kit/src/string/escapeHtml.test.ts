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

  it("escapes single quotes, for attributes quoted with '", () => {
    expect(escapeHtml("' onerror='alert(1)")).toBe(
      "&#39; onerror=&#39;alert(1)",
    );
  });

  it("escapes & first, so entities aren't double-escaped", () => {
    expect(escapeHtml("<'&'>")).toBe("&lt;&#39;&amp;&#39;&gt;");
  });
});
