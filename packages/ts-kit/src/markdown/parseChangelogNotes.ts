// GitHub release notes (and changelogs in general) are usually written in a
// small subset of Markdown ("### Heading", "- item", "**bold**"). Rendered
// as-is in a plain UI text node, the raw syntax shows up unstyled — this
// parser turns it into a small set of typed blocks a UI layer can render
// (heading / bullet item / plain text), without pulling in a full Markdown
// dependency for this narrow use case.

/** A run of text inside a line, bold or not (from `**…**`). */
export interface ChangelogSegment {
  /** The text, without the `**` markers. */
  text: string;
  /** Whether the run was wrapped in `**…**`. */
  bold: boolean;
}

/**
 * One line of release notes, as parsed by {@link parseChangelogNotes}: a
 * `###`-style heading, a `- ` list item, or a plain paragraph.
 */
export type ChangelogBlock =
  | { type: "heading"; text: string }
  | { type: "item"; segments: ChangelogSegment[] }
  | { type: "text"; segments: ChangelogSegment[] };

function parseInlineSegments(text: string): ChangelogSegment[] {
  const segments: ChangelogSegment[] = [];
  const boldPattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    // The capture group is mandatory in the pattern, so it always matches —
    // the `?? ""` fallback is only here to satisfy `noUncheckedIndexedAccess`.
    segments.push({ text: match[1] ?? "", bold: true });
    lastIndex = boldPattern.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false });
  }
  return segments;
}

// Any ATX heading level ("# " to "###### ") — release notes are not always
// written with "###" (e.g. "## What's new" on a hand-written GitHub release).
const headingPattern = /^#{1,6}\s+/;

/**
 * Parses release notes written in a small Markdown subset (headings
 * `#`…`######`, `- ` items and `**bold**`) into blocks a native screen can
 * render without a Markdown engine. Blank lines are dropped; any other syntax
 * is kept as plain text.
 * @param notes - The raw notes, e.g. a GitHub release body or a CHANGELOG
 *   section.
 * @returns One block per non-empty line, in order.
 * @example
 * parseChangelogNotes("### Added\n- **Dark** theme");
 * // => [{ type: "heading", text: "Added" },
 * //     { type: "item", segments: [{ text: "Dark", bold: true }, { text: " theme", bold: false }] }]
 */
export function parseChangelogNotes(notes: string): ChangelogBlock[] {
  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const heading = headingPattern.exec(line);
      if (heading) {
        return {
          type: "heading" as const,
          text: line.slice(heading[0].length).trim(),
        };
      }
      if (line.startsWith("- ")) {
        return {
          type: "item" as const,
          segments: parseInlineSegments(line.slice(2).trim()),
        };
      }
      return { type: "text" as const, segments: parseInlineSegments(line) };
    });
}
