import type { ReactNode } from "react";
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Per-slot style overrides for {@link SettingsCard}, each merged after its
 * default.
 */
export interface SettingsCardStyles {
  /** The card itself (border, background, padding). */
  card?: StyleProp<ViewStyle>;
  /** The row holding the icon and title. */
  header?: StyleProp<ViewStyle>;
  /** The title. */
  title?: StyleProp<TextStyle>;
}

/** Props of {@link SettingsCard}. */
export interface SettingsCardProps {
  /** Title of the card. */
  title: string;
  /** `Ionicons` glyph before the title. */
  icon?: IconName;
  /** @defaultValue "#2563eb" */
  iconColor?: ColorValue;
  /** Free content: `SettingsCardStatus` lines, `SettingsCardHint`, buttons… */
  children?: ReactNode;
  /** Style overrides, merged over the defaults. */
  styles?: SettingsCardStyles;
}

const cardStyles = {
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  } satisfies ViewStyle,
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } satisfies ViewStyle,
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  } satisfies TextStyle,
};

/**
 * A settings card: a header (icon + title), then free content — typically
 * status lines, a hint and action buttons (backup, sync, account…).
 *
 * @example
 * ```tsx
 * import {
 *   SettingsCard,
 *   SettingsCardHint,
 *   SettingsCardStatus,
 * } from "@forthtilliath/react-native-kit/components/settings/SettingsCard";
 *
 * <SettingsCard icon="cloud-outline" title="Google Drive">
 *   <SettingsCardStatus
 * icon="person-circle-outline">{email}</SettingsCardStatus>
 *   <SettingsCardStatus icon="time-outline">Dernier envoi : hier à
 * 21:42</SettingsCardStatus>
 *   <SettingsCardHint>Copie privée, invisible dans ton
 * Drive.</SettingsCardHint>
 * </SettingsCard>
 * ```
 */
export function SettingsCard({
  title,
  icon,
  iconColor = "#2563eb",
  children,
  styles,
}: SettingsCardProps) {
  const merged = mergeSlotStyles(cardStyles, styles);

  return (
    <View style={merged.card}>
      <View style={merged.header}>
        {icon !== undefined && (
          <Ionicons name={icon} size={20} color={iconColor} />
        )}
        <Text style={merged.title} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

/** Per-slot style overrides for {@link SettingsCardStatus}. */
export interface SettingsCardStatusStyles {
  /** The line (icon + text). */
  row?: StyleProp<ViewStyle>;
  /** Its text. */
  text?: StyleProp<TextStyle>;
}

/** Props of {@link SettingsCardStatus}. */
export interface SettingsCardStatusProps {
  /** `Ionicons` glyph before the text. */
  icon: IconName;
  /** E.g. green for "connected", red for an error. @defaultValue "#6b7280" */
  iconColor?: ColorValue;
  /** The status text. */
  children: ReactNode;
  /** Style overrides, merged over the defaults. */
  styles?: SettingsCardStatusStyles;
}

const statusStyles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } satisfies ViewStyle,
  text: { flex: 1, fontSize: 14, color: "#111111" } satisfies TextStyle,
};

/**
 * A status line of a card: small icon, then text (linked account, last
 * backup…).
 */
export function SettingsCardStatus({
  icon,
  iconColor = "#6b7280",
  children,
  styles,
}: SettingsCardStatusProps) {
  const merged = mergeSlotStyles(statusStyles, styles);

  return (
    <View style={merged.row}>
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text style={merged.text}>{children}</Text>
    </View>
  );
}

/** Props of {@link SettingsCardHint}. */
export interface SettingsCardHintProps {
  /** The explanatory text. */
  children: ReactNode;
  /** Style merged over the default (small grey text). */
  style?: StyleProp<TextStyle>;
}

const hintStyle = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 4,
} satisfies TextStyle;

/** Explanatory text of a card, quieter than its status lines. */
export function SettingsCardHint({ children, style }: SettingsCardHintProps) {
  return <Text style={[hintStyle, style]}>{children}</Text>;
}
