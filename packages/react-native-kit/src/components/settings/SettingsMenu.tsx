import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SettingsMenuItem {
  /** Stable React key — also what distinguishes otherwise-identical items. */
  key: string;
  emoji: string;
  title: string;
  hint?: string;
  onPress: () => void;
}

export interface SettingsMenuStyles {
  container?: StyleProp<ViewStyle>;
  row?: StyleProp<ViewStyle>;
  titleColumn?: StyleProp<ViewStyle>;
  emoji?: StyleProp<TextStyle>;
  title?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
  chevronColor?: string;
}

export interface SettingsMenuProps {
  items: SettingsMenuItem[];
  styles?: SettingsMenuStyles;
}

const defaultStyles = {
  container: { gap: 10 } satisfies ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
  } satisfies ViewStyle,
  titleColumn: { flex: 1 } satisfies ViewStyle,
  emoji: { fontSize: 24 } satisfies TextStyle,
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  } satisfies TextStyle,
  hint: { fontSize: 12, color: "#6b7280", marginTop: 2 } satisfies TextStyle,
  chevronColor: "#9ca3af",
};

// Menu screen for a settings tab: one row per section (emoji + title + hint),
// navigating to it on press. Has no opinion on how navigation works — each
// item carries its own `onPress` (e.g. `() => router.push("/settings/xxx")`),
// so this doesn't depend on expo-router or any other specific navigator.
export function SettingsMenu({ items, styles }: SettingsMenuProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    row: [defaultStyles.row, styles?.row],
    titleColumn: [defaultStyles.titleColumn, styles?.titleColumn],
    emoji: [defaultStyles.emoji, styles?.emoji],
    title: [defaultStyles.title, styles?.title],
    hint: [defaultStyles.hint, styles?.hint],
  };
  const chevronColor = styles?.chevronColor ?? defaultStyles.chevronColor;

  return (
    <View style={merged.container}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          style={merged.row}
          onPress={item.onPress}
          accessibilityRole="button"
          accessibilityLabel={item.title}
        >
          <Text style={merged.emoji}>{item.emoji}</Text>
          <View style={merged.titleColumn}>
            <Text style={merged.title}>{item.title}</Text>
            {item.hint ? <Text style={merged.hint}>{item.hint}</Text> : null}
          </View>
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        </Pressable>
      ))}
    </View>
  );
}
