import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import type { ChangelogSegment } from "@forthtilliath/expo-release-updates/parseChangelogNotes";
import { parseChangelogNotes } from "@forthtilliath/expo-release-updates/parseChangelogNotes";

/** Style overrides of {@link ChangelogNotes}, each merged over its default. */
export interface ChangelogNotesStyles {
  /** A `#`–`######` heading line. */
  heading?: StyleProp<TextStyle>;
  /** The row of a `- ` list item (bullet + text side by side). */
  itemRow?: StyleProp<ViewStyle>;
  /** The `•` of a list item. */
  bullet?: StyleProp<TextStyle>;
  /** The text of a list item. */
  itemText?: StyleProp<TextStyle>;
  /** A plain paragraph line. */
  text?: StyleProp<TextStyle>;
  /** The box of a `> ` quote line (left border by default). */
  quote?: StyleProp<ViewStyle>;
  /** The text of a quote line. */
  quoteText?: StyleProp<TextStyle>;
  /** Applied on top of the surrounding text style to `**bold**` runs. */
  bold?: StyleProp<TextStyle>;
  /** Applied on top of the surrounding text style to `*italic*` runs. */
  italic?: StyleProp<TextStyle>;
  /** Applied on top of the surrounding text style to backtick `code` runs. */
  code?: StyleProp<TextStyle>;
}

/** Props of {@link ChangelogNotes}. */
export interface ChangelogNotesProps {
  /** Raw release notes, e.g. straight from a GitHub release body. */
  notes: string;
  /** Override any of the default styles to match your app's theme. */
  styles?: ChangelogNotesStyles;
}

// Reasonable, neutral defaults so the component works with zero
// configuration — most consumers will still want to pass `styles` to match
// their own theme (colors, dark mode, ...), which this package has no
// opinion on.
const defaultStyles: Required<ChangelogNotesStyles> = {
  heading: { fontSize: 13, fontWeight: "700", color: "#111827", marginTop: 8 },
  itemRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  bullet: { fontSize: 13, color: "#6b7280" },
  itemText: { flex: 1, fontSize: 13, color: "#6b7280" },
  text: { fontSize: 13, color: "#6b7280" },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: "#d1d5db",
    paddingLeft: 8,
    marginTop: 4,
  },
  quoteText: { fontSize: 13, color: "#6b7280", fontStyle: "italic" },
  bold: { fontWeight: "700", color: "#111827" },
  italic: { fontStyle: "italic" },
  code: {
    fontFamily: "monospace",
    backgroundColor: "#f3f4f6",
    color: "#111827",
  },
};

interface InlineStyles {
  bold: StyleProp<TextStyle>;
  italic: StyleProp<TextStyle>;
  code: StyleProp<TextStyle>;
}

function renderSegments(segments: ChangelogSegment[], inline: InlineStyles) {
  // Keyed by where each segment starts in the line: unique and stable (the
  // text alone is not, the same word can appear twice on a line).
  let offset = 0;
  return segments.map((segment) => {
    const start = offset;
    offset += segment.text.length;
    return (
      <Text
        key={String(start)}
        style={[
          segment.bold ? inline.bold : undefined,
          segment.italic ? inline.italic : undefined,
          segment.code ? inline.code : undefined,
        ]}
      >
        {segment.text}
      </Text>
    );
  });
}

/**
 * Renders GitHub-style release notes (parsed by `parseChangelogNotes`) as
 * headings, bulleted items, quotes and bold / italic / code-aware text,
 * instead of showing the raw Markdown syntax in a plain `<Text>`.
 */
export function ChangelogNotes({ notes, styles }: ChangelogNotesProps) {
  // Each field is merged as a style array (default, then override) rather
  // than the override replacing the whole default outright — so passing e.g.
  // `styles={{ heading: { color: "red" } }}` only changes the color instead
  // of silently dropping the default's fontSize/fontWeight/marginTop too.
  const merged = {
    heading: [defaultStyles.heading, styles?.heading],
    itemRow: [defaultStyles.itemRow, styles?.itemRow],
    bullet: [defaultStyles.bullet, styles?.bullet],
    itemText: [defaultStyles.itemText, styles?.itemText],
    text: [defaultStyles.text, styles?.text],
    quote: [defaultStyles.quote, styles?.quote],
    quoteText: [defaultStyles.quoteText, styles?.quoteText],
  };
  const inline: InlineStyles = {
    bold: [defaultStyles.bold, styles?.bold],
    italic: [defaultStyles.italic, styles?.italic],
    code: [defaultStyles.code, styles?.code],
  };
  const blocks = parseChangelogNotes(notes);

  return (
    <>
      {blocks.map((block, index) => {
        // Blocks have no stable identity of their own (plain parsed lines),
        // so the index is the only reasonable key — the list is never
        // reordered or filtered after the initial parse.
        const key = `${block.type}-${String(index)}`;
        if (block.type === "heading") {
          return (
            <Text key={key} style={merged.heading}>
              {block.text}
            </Text>
          );
        }
        if (block.type === "item") {
          return (
            <View key={key} style={merged.itemRow}>
              <Text style={merged.bullet}>•</Text>
              <Text style={merged.itemText}>
                {renderSegments(block.segments, inline)}
              </Text>
            </View>
          );
        }
        if (block.type === "quote") {
          return (
            <View key={key} style={merged.quote}>
              <Text style={merged.quoteText}>
                {renderSegments(block.segments, inline)}
              </Text>
            </View>
          );
        }
        return (
          <Text key={key} style={merged.text}>
            {renderSegments(block.segments, inline)}
          </Text>
        );
      })}
    </>
  );
}
