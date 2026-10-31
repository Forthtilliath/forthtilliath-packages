import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link BottomSheetHeader}, each merged after its default. */
export interface BottomSheetHeaderStyles {
  /** The grab bar above the title. */
  handle?: StyleProp<ViewStyle>;
  /** The row: titles, action, close button. */
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  subtitle?: StyleProp<TextStyle>;
  /** The text of `action`. */
  action?: StyleProp<TextStyle>;
  /** The round close button. */
  close?: StyleProp<ViewStyle>;
  /** The × inside it. */
  closeIcon?: StyleProp<TextStyle>;
}

export interface BottomSheetHeaderProps {
  title?: string;
  /** A quieter line under the title. */
  subtitle?: string;
  /** A text button right of the title ("Réinitialiser", "Tout cocher"). */
  action?: { label: string; onPress: () => void };
  /** Shows the grab bar. @defaultValue true */
  showHandle?: boolean;
  /** Shows a × button calling it. */
  onClose?: () => void;
  /** Spoken name of the × button. @defaultValue "Fermer" ("Close" in English) */
  closeLabel?: string;
  locale?: KitLocale;
  styles?: BottomSheetHeaderStyles;
}

const closeLabels: Record<KitLocale, string> = { fr: "Fermer", en: "Close" };

const defaultStyles = {
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    marginBottom: 4,
  } satisfies ViewStyle,
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  } satisfies ViewStyle,
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  } satisfies TextStyle,
  subtitle: { fontSize: 13, color: "#6b7280" } satisfies TextStyle,
  action: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  } satisfies TextStyle,
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  closeIcon: {
    fontSize: 22,
    lineHeight: 24,
    color: "#111111",
  } satisfies TextStyle,
};

/**
 * The top of a bottom sheet — grab bar, title and subtitle, an optional text
 * action and a close button. Rendered by `BottomSheet` from its own props,
 * outside the scrolling content so it stays visible; exported for sheets
 * built by hand.
 */
export function BottomSheetHeader({
  title,
  subtitle,
  action,
  showHandle = true,
  onClose,
  closeLabel,
  locale,
  styles,
}: BottomSheetHeaderProps) {
  const resolvedLocale = useKitLocale(locale);
  const merged = mergeSlotStyles(defaultStyles, styles);
  const hasRow =
    title !== undefined ||
    subtitle !== undefined ||
    action !== undefined ||
    onClose !== undefined;

  return (
    <>
      {showHandle && (
        <View
          style={merged.handle}
          importantForAccessibility="no"
          accessibilityElementsHidden
        />
      )}
      {hasRow && (
        <View style={merged.header}>
          <View style={{ flex: 1, gap: 2 }}>
            {title !== undefined && (
              <Text style={merged.title} accessibilityRole="header">
                {title}
              </Text>
            )}
            {subtitle !== undefined && (
              <Text style={merged.subtitle}>{subtitle}</Text>
            )}
          </View>
          {action && (
            <Pressable
              onPress={action.onPress}
              hitSlop={8}
              accessibilityRole="button"
              style={{ minHeight: 32, justifyContent: "center" }}
            >
              <Text style={merged.action}>{action.label}</Text>
            </Pressable>
          )}
          {onClose && (
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={merged.close}
              accessibilityRole="button"
              accessibilityLabel={closeLabel ?? closeLabels[resolvedLocale]}
            >
              <Text style={merged.closeIcon}>×</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
}
