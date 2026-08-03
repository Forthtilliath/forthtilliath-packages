import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import type { ChangelogSegment } from "@forthtilliath/expo-release-updates/parseChangelogNotes";
import { parseChangelogNotes } from "@forthtilliath/expo-release-updates/parseChangelogNotes";

export interface ChangelogNotesStyles {
  heading?: StyleProp<TextStyle>;
  itemRow?: StyleProp<ViewStyle>;
  bullet?: StyleProp<TextStyle>;
  itemText?: StyleProp<TextStyle>;
  text?: StyleProp<TextStyle>;
  bold?: StyleProp<TextStyle>;
}

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
  bold: { fontWeight: "700", color: "#111827" },
};

function renderSegments(
  segments: ChangelogSegment[],
  boldStyle: StyleProp<TextStyle>,
) {
  return segments.map((segment) => (
    <Text key={segment.text} style={segment.bold ? boldStyle : undefined}>
      {segment.text}
    </Text>
  ));
}

/**
 * Renders GitHub-style release notes (parsed by `parseChangelogNotes`) as
 * headings, bulleted items and bold-aware text, instead of showing the raw
 * Markdown syntax in a plain `<Text>`.
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
    bold: [defaultStyles.bold, styles?.bold],
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
                {renderSegments(block.segments, merged.bold)}
              </Text>
            </View>
          );
        }
        return (
          <Text key={key} style={merged.text}>
            {renderSegments(block.segments, merged.bold)}
          </Text>
        );
      })}
    </>
  );
}
