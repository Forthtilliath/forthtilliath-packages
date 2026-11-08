// GitHub release notes (and changelogs in general) are usually written in a
// small subset of Markdown ("### Heading", "- item", "**bold**", "> note",
// "`code`"). Rendered as-is in a plain UI text node, the raw syntax shows up
// unstyled — this parser turns it into a small set of typed blocks a UI layer
// can render (heading / bullet item / quote / plain text), without pulling in
// a full Markdown dependency for this narrow use case.

/**
 * A run of text inside a line, with its inline formatting. `italic` and `code`
 * are only present when set, so a plain or bold run stays `{ text, bold }`.
 */
export interface ChangelogSegment {
  /** The text, without the Markdown markers. */
  text: string;
  /** Whether the run was wrapped in `**…**`. */
  bold: boolean;
  /** Present (`true`) when the run was wrapped in `*…*` or `_…_`. */
  italic?: true;
  /** Present (`true`) when the run was wrapped in backticks (`` `…` ``). */
  code?: true;
}

/**
 * One line of release notes, as parsed by {@link parseChangelogNotes}: a
 * `###`-style heading, a `- ` (or `* `) list item, a `> ` quote, or a plain
 * paragraph.
 */
export type ChangelogBlock =
  | { type: "heading"; text: string }
  | { type: "item"; segments: ChangelogSegment[] }
  | { type: "quote"; segments: ChangelogSegment[] }
  | { type: "text"; segments: ChangelogSegment[] };

// In order: `code` (nothing parsed inside), **bold**, *italic*, _italic_.
// Italic needs a non-space right after the opening and right before the
// closing marker, so "a * b * c" stays plain text.
// Kept without the "g" flag: parseInline recurses, so each call builds its own
// global copy (a shared `lastIndex` would be clobbered by the inner call).
const INLINE_PATTERN =
  /`([^`]+)`|\*\*(.+?)\*\*|\*(\S(?:.*?\S)?)\*|_(\S(?:.*?\S)?)_/;

// Letters (accented ones included), digits and "_": an "_" touching one of
// them is part of a word (snake_case), not an italic marker. No `\p{L}` or
// lookbehind, to stay safe on every JavaScript engine (Hermes included).
const WORD_CHAR = /[0-9A-Za-z_À-ɏ]/;

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && WORD_CHAR.test(char);
}

interface Emphasis {
  bold: boolean;
  italic: boolean;
}

function pushSegment(
  out: ChangelogSegment[],
  text: string,
  emphasis: Emphasis,
  code = false,
) {
  const segment: ChangelogSegment = { text, bold: emphasis.bold };
  if (emphasis.italic) segment.italic = true;
  if (code) segment.code = true;
  out.push(segment);
}

function parseInline(
  text: string,
  emphasis: Emphasis,
  out: ChangelogSegment[],
) {
  const pattern = new RegExp(INLINE_PATTERN.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const [whole, code, bold, starItalic, underscoreItalic] = match;
    const end = match.index + whole.length;
    if (
      underscoreItalic !== undefined &&
      (isWordChar(text[match.index - 1]) || isWordChar(text[end]))
    ) {
      // Inside a word (snake_case_name): retry from the next character.
      pattern.lastIndex = match.index + 1;
      continue;
    }
    if (match.index > lastIndex) {
      pushSegment(out, text.slice(lastIndex, match.index), emphasis);
    }
    if (code !== undefined) {
      pushSegment(out, code, emphasis, true);
    } else if (bold !== undefined) {
      parseInline(bold, { ...emphasis, bold: true }, out);
    } else {
      parseInline(
        starItalic ?? underscoreItalic ?? "",
        {
          ...emphasis,
          italic: true,
        },
        out,
      );
    }
    lastIndex = end;
  }
  if (lastIndex < text.length) {
    pushSegment(out, text.slice(lastIndex), emphasis);
  }
}

function parseInlineSegments(text: string): ChangelogSegment[] {
  const segments: ChangelogSegment[] = [];
  parseInline(text, { bold: false, italic: false }, segments);
  return segments;
}

// Any ATX heading level ("# " to "###### ") — release notes are not always
// written with "###" (e.g. "## What's new" on a hand-written GitHub release).
const headingPattern = /^#{1,6}\s+/;
const itemPattern = /^[-*]\s+/;
const quotePattern = /^>\s?/;

function parseLine(line: string): ChangelogBlock | null {
  const heading = headingPattern.exec(line);
  if (heading) {
    return { type: "heading", text: line.slice(heading[0].length).trim() };
  }
  const item = itemPattern.exec(line);
  if (item) {
    return {
      type: "item",
      segments: parseInlineSegments(line.slice(item[0].length).trim()),
    };
  }
  const quote = quotePattern.exec(line);
  if (quote) {
    const content = line.slice(quote[0].length).trim();
    // A bare ">" only separates quoted paragraphs: nothing to show.
    if (content.length === 0) return null;
    return { type: "quote", segments: parseInlineSegments(content) };
  }
  return { type: "text", segments: parseInlineSegments(line) };
}

/**
 * Parses release notes written in a small Markdown subset (headings
 * `#`…`######`, `- ` / `* ` items, `> ` quotes, `**bold**`, `*italic*` /
 * `_italic_` and `` `code` ``) into blocks a native screen can render without
 * a Markdown engine. Blank lines (and bare `>` lines) are dropped; any other
 * syntax is kept as plain text.
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
    .map(parseLine)
    .filter((block): block is ChangelogBlock => block !== null);
}
