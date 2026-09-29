import { describe, expect, it } from "vitest";

import { escapeCsvField } from "./escapeCsvField.js";

describe("escapeCsvField", () => {
  it("leaves a simple value unchanged", () => {
    expect(escapeCsvField("Apple")).toBe("Apple");
  });

  it("quotes a value containing a semicolon", () => {
    expect(escapeCsvField("a;b")).toBe('"a;b"');
  });

  it("quotes a value containing a newline", () => {
    expect(escapeCsvField("a\nb")).toBe('"a\nb"');
  });

  it("doubles internal quotes and wraps the result", () => {
    expect(escapeCsvField('He said "hi"')).toBe('"He said ""hi"""');
  });

  it("quotes a value containing a carriage return", () => {
    expect(escapeCsvField("a\r\nb")).toBe('"a\r\nb"');
  });

  it("quotes for a custom delimiter only", () => {
    expect(escapeCsvField("a,b", ",")).toBe('"a,b"');
    expect(escapeCsvField("a;b", ",")).toBe("a;b");
  });

  it("is still importable from its former string/ location", async () => {
    const legacy = await import("../string/escapeCsvField.js");
    expect(legacy.escapeCsvField).toBe(escapeCsvField);
  });
});
