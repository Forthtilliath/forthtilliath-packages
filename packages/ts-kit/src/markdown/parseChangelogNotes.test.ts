import { describe, expect, it } from "vitest";

import { parseChangelogNotes } from "./parseChangelogNotes.js";

describe("parseChangelogNotes", () => {
  it("recognizes a section heading (###)", () => {
    expect(parseChangelogNotes("### Added")).toEqual([
      { type: "heading", text: "Added" },
    ]);
  });

  it("recognizes a list item (-)", () => {
    expect(parseChangelogNotes("- Export history to CSV.")).toEqual([
      {
        type: "item",
        segments: [{ text: "Export history to CSV.", bold: false }],
      },
    ]);
  });

  it("splits bold (**...**) inside an item, preserving surrounding text", () => {
    expect(parseChangelogNotes("- **Broken widget**: fixed.")).toEqual([
      {
        type: "item",
        segments: [
          { text: "Broken widget", bold: true },
          { text: ": fixed.", bold: false },
        ],
      },
    ]);
  });

  it("ignores empty lines", () => {
    const blocks = parseChangelogNotes(
      "### Added\n\n- Item\n\n### Fixed\n- Other item",
    );
    expect(blocks).toHaveLength(4);
    expect(blocks[0]).toEqual({ type: "heading", text: "Added" });
    expect(blocks[2]).toEqual({ type: "heading", text: "Fixed" });
  });

  it("treats a line without any marker as plain text", () => {
    expect(parseChangelogNotes("Just a sentence.")).toEqual([
      { type: "text", segments: [{ text: "Just a sentence.", bold: false }] },
    ]);
  });

  it("parses complete real-world notes with several sections", () => {
    const notes = [
      "### Added",
      "- Export history to CSV.",
      "",
      "### Fixed",
      "- **Broken widget** fixed.",
    ].join("\n");
    const blocks = parseChangelogNotes(notes);
    expect(blocks.map((b) => b.type)).toEqual([
      "heading",
      "item",
      "heading",
      "item",
    ]);
  });
});
