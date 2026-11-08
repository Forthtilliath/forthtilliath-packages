import { describe, expect, it } from "vitest";

import { parseChangelogNotes } from "./parseChangelogNotes.js";

describe("parseChangelogNotes", () => {
  it("recognizes a section heading (###)", () => {
    expect(parseChangelogNotes("### Added")).toEqual([
      { type: "heading", text: "Added" },
    ]);
  });

  it("recognizes every heading level (# to ######)", () => {
    expect(
      parseChangelogNotes("# One\n## Nouveautés\n#### Four\n###### Six"),
    ).toEqual([
      { type: "heading", text: "One" },
      { type: "heading", text: "Nouveautés" },
      { type: "heading", text: "Four" },
      { type: "heading", text: "Six" },
    ]);
  });

  it("does not treat a hashtag or 7+ hashes as a heading", () => {
    expect(parseChangelogNotes("#123 fixed").map((b) => b.type)).toEqual([
      "text",
    ]);
    expect(parseChangelogNotes("####### Seven").map((b) => b.type)).toEqual([
      "text",
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

  it("recognizes a list item written with *", () => {
    expect(parseChangelogNotes("* Dark theme")).toEqual([
      { type: "item", segments: [{ text: "Dark theme", bold: false }] },
    ]);
  });

  it("recognizes a quote (>) and drops bare > separators", () => {
    expect(
      parseChangelogNotes("> **Note:** back up first\n>\n>Then update"),
    ).toEqual([
      {
        type: "quote",
        segments: [
          { text: "Note:", bold: true },
          { text: " back up first", bold: false },
        ],
      },
      { type: "quote", segments: [{ text: "Then update", bold: false }] },
    ]);
  });

  it("splits italic (*...* and _..._) into italic segments", () => {
    expect(parseChangelogNotes("An *important* and _urgent_ fix")).toEqual([
      {
        type: "text",
        segments: [
          { text: "An ", bold: false },
          { text: "important", bold: false, italic: true },
          { text: " and ", bold: false },
          { text: "urgent", bold: false, italic: true },
          { text: " fix", bold: false },
        ],
      },
    ]);
  });

  it("keeps italic inside bold", () => {
    expect(parseChangelogNotes("**Fixed *crash* on start**")).toEqual([
      {
        type: "text",
        segments: [
          { text: "Fixed ", bold: true },
          { text: "crash", bold: true, italic: true },
          { text: " on start", bold: true },
        ],
      },
    ]);
  });

  it("splits `code` into code segments, without parsing inside", () => {
    expect(parseChangelogNotes("- Set `max_*_size` to 2")).toEqual([
      {
        type: "item",
        segments: [
          { text: "Set ", bold: false },
          { text: "max_*_size", bold: false, code: true },
          { text: " to 2", bold: false },
        ],
      },
    ]);
  });

  it("leaves snake_case words and lone asterisks as plain text", () => {
    expect(parseChangelogNotes("Rename my_var_name, 2 * 3 * 4")).toEqual([
      {
        type: "text",
        segments: [{ text: "Rename my_var_name, 2 * 3 * 4", bold: false }],
      },
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
