import { describe, expect, it } from "vitest";

import { loadJsonFixture } from "./loadJsonFixture.js";

interface SampleFixture {
  id: number;
  name: string;
  tags: string[];
}

describe("loadJsonFixture", () => {
  it("reads and parses a JSON fixture relative to the given module", () => {
    const fixture = loadJsonFixture<SampleFixture>(
      import.meta.url,
      "./test-fixtures/sample.json",
    );
    expect(fixture).toEqual({ id: 1, name: "Widget", tags: ["a", "b"] });
  });

  it("throws when the fixture doesn't exist", () => {
    expect(() =>
      loadJsonFixture(import.meta.url, "./test-fixtures/missing.json"),
    ).toThrow();
  });
});
