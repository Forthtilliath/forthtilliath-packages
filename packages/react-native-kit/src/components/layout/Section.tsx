import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { SectionTitle, type SectionTitleProps } from "./SectionTitle.js";

export interface SectionProps extends Omit<SectionTitleProps, "styles"> {
  children: ReactNode;
  /** Space between the title and each child. @defaultValue 8 */
  gap?: number;
  /** The block holding the title and the content. */
  style?: StyleProp<ViewStyle>;
  /** Style overrides of the title — see `SectionTitleStyles`. */
  titleStyles?: SectionTitleProps["styles"];
}

/**
 * A titled block of a screen, sheet or settings page: a {@link SectionTitle}
 * (same props) followed by its content, evenly spaced.
 *
 * @example
 * ```tsx
 * import { Section } from "@forthtilliath/react-native-kit/components/layout/Section";
 *
 * <Section title="Durée" aside={durationLabel}>
 *   <SegmentedToggle options={DURATIONS} value={duration} onChange={setDuration} />
 * </Section>
 * ```
 */
export function Section({
  children,
  gap = 8,
  style,
  titleStyles,
  ...title
}: SectionProps) {
  return (
    <View style={[{ gap }, style]}>
      <SectionTitle {...title} styles={titleStyles} />
      {children}
    </View>
  );
}
