import { describe, expect, it } from "vitest";

import { diffCatalogs, serializeCatalog } from "./catalog.js";

const row = (kind: string, name: string, definition: string) => ({
  kind,
  name,
  definition,
});

describe("diffCatalogs", () => {
  it("finds nothing between identical fingerprints", () => {
    const rows = [row("table", "news", "rls=true force=false")];
    expect(diffCatalogs(rows, [...rows])).toEqual({
      missing: [],
      extra: [],
      changed: [],
    });
  });

  it("reports missing, extra and changed elements", () => {
    const expected = [
      row("table", "news", "rls=true force=false"),
      row("policy", "news.Members read", "SELECT …"),
    ];
    const actual = [
      row("table", "news", "rls=false force=false"),
      row("policy", "news.Anyone reads", "SELECT … using (true)"),
    ];
    expect(diffCatalogs(expected, actual)).toEqual({
      missing: ["policy news.Members read"],
      extra: [
        {
          key: "policy news.Anyone reads",
          definition: "SELECT … using (true)",
        },
      ],
      changed: [
        {
          key: "table news",
          expected: "rls=true force=false",
          actual: "rls=false force=false",
        },
      ],
    });
  });

  it("tells kinds apart for a same name", () => {
    const diff = diffCatalogs(
      [row("table", "news", "a")],
      [row("function", "news", "a")],
    );
    expect(diff.missing).toEqual(["table news"]);
    expect(diff.extra).toEqual([{ key: "function news", definition: "a" }]);
  });
});

describe("serializeCatalog", () => {
  it("indents with two spaces and ends with a newline", () => {
    expect(serializeCatalog([row("table", "news", "x")])).toBe(
      '[\n  {\n    "kind": "table",\n    "name": "news",\n    "definition": "x"\n  }\n]\n',
    );
  });
});
