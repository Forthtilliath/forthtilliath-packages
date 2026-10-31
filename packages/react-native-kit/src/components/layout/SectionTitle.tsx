import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link SectionTitle}, each merged after its default. */
export interface SectionTitleStyles {
  /** The row: leading mark, title, rule, aside. */
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  /** The text of a string `aside`. */
  aside?: StyleProp<TextStyle>;
  /** The line drawn after the title with `rule`. */
  rule?: StyleProp<ViewStyle>;
}

export interface SectionTitleProps {
  title: string;
  /**
   * Shown at the right end: a summary of the current choice ("4 joueurs"), a
   * counter, a small action… A string is styled with `styles.aside`.
   */
  aside?: ReactNode;
  /** Decorative mark before the title (a diamond, a dot, an icon), hidden from screen readers. */
  leading?: ReactNode;
  /** Draws a line from the title to the right end (before `aside`). @defaultValue false */
  rule?: boolean;
  /** Small capitals look. @defaultValue true */
  uppercase?: boolean;
  styles?: SectionTitleStyles;
}

const defaultStyles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } satisfies ViewStyle,
  title: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#6b7280",
  } satisfies TextStyle,
  aside: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  } satisfies TextStyle,
  rule: { flex: 1, height: 1, backgroundColor: "#e5e7eb" } satisfies ViewStyle,
};

/**
 * A section heading in small grey capitals, announced as a header — with an
 * optional leading mark, a line running to the edge, and a summary on the
 * right.
 *
 * @example
 * ```tsx
 * import { SectionTitle } from "@forthtilliath/react-native-kit/components/layout/SectionTitle";
 *
 * <SectionTitle title="Joueurs" aside="4 sélectionnés" />
 * <SectionTitle title="Merveilles" rule leading={<View style={diamond} />} />
 * ```
 */
export function SectionTitle({
  title,
  aside,
  leading,
  rule = false,
  uppercase = true,
  styles,
}: SectionTitleProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.container}>
      {leading !== undefined && (
        <View
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          {leading}
        </View>
      )}
      <Text
        style={[merged.title, uppercase && { textTransform: "uppercase" }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {rule && <View style={merged.rule} />}
      {typeof aside === "string" || typeof aside === "number" ? (
        <Text style={[merged.aside, rule && { marginLeft: 0 }]}>{aside}</Text>
      ) : (
        aside
      )}
    </View>
  );
}
