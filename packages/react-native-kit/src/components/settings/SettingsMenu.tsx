import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Well-known settings sections this package itself ships a screen for
 * (`BackupSettingsScreen`, `ThemeSettingsScreen`, etc.) — matching `key`
 * against one of these gets an item a default icon for free. Any other
 * `key` (e.g. an app-specific "profile"/"notifications" section) needs its
 * own `emoji`/`icon`, since there's no sensible universal default for it.
 */
export type SettingsMenuSection =
  "backup" | "theme" | "update" | "about" | "contact" | "privacy";

const defaultSectionIcons: Record<
  SettingsMenuSection,
  { emoji: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  backup: { emoji: "💾", icon: "save-outline" },
  theme: { emoji: "🎨", icon: "contrast-outline" },
  update: { emoji: "⬇️", icon: "download-outline" },
  about: { emoji: "ℹ️", icon: "information-circle-outline" },
  contact: { emoji: "✉️", icon: "chatbubble-ellipses-outline" },
  privacy: { emoji: "🔒", icon: "lock-closed-outline" },
};

export interface SettingsMenuItem {
  /**
   * Stable React key. Doubles as the lookup into the default icon table
   * above — use `"backup"`/`"theme"`/`"update"`/`"about"`/`"contact"`/
   * `"privacy"` to get a sensible icon for free, any other string for a
   * custom (app-specific) section, which then needs its own `emoji`/`icon`.
   */
  key: string;
  /**
   * Overrides the default icon for this item (whether that default came
   * from `key` or there simply isn't one). At most one of the two —
   * `emoji` renders as-is (naturally multicolor, varies per item); `icon`
   * renders as an `Ionicons` glyph in one shared color (`styles.iconColor`),
   * for a flatter, more uniform look.
   */
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  hint?: string;
  onPress: () => void;
}

export interface SettingsMenuGroup {
  /** Omit for a group with no visible header (e.g. the first one). */
  title?: string;
  items: SettingsMenuItem[];
}

export interface SettingsMenuStyles {
  container?: StyleProp<ViewStyle>;
  groupTitle?: StyleProp<TextStyle>;
  row?: StyleProp<ViewStyle>;
  titleColumn?: StyleProp<ViewStyle>;
  emoji?: StyleProp<TextStyle>;
  iconColor?: string;
  title?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
  chevronColor?: string;
}

export interface SettingsMenuProps {
  /** A flat list of rows. Mutually exclusive with `groups`. */
  items?: SettingsMenuItem[];
  /** Rows grouped under optional section headers. Mutually exclusive with `items`. */
  groups?: SettingsMenuGroup[];
  /**
   * Which flavor of the default icon table to use for items that don't set
   * their own `emoji`/`icon`. Doesn't affect items that do. Defaults to
   * `"emoji"`.
   */
  defaultIconKind?: "emoji" | "icon";
  /** Set to `false` to never render any item's `hint`, for a denser, icon-only-style menu. Defaults to `true`. */
  showHints?: boolean;
  styles?: SettingsMenuStyles;
}

const defaultStyles = {
  container: { gap: 10 } satisfies ViewStyle,
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
  } satisfies TextStyle,
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
  iconColor: "#111827",
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  } satisfies TextStyle,
  hint: { fontSize: 12, color: "#6b7280", marginTop: 2 } satisfies TextStyle,
  chevronColor: "#9ca3af",
};

function resolveIcon(
  item: SettingsMenuItem,
  defaultIconKind: "emoji" | "icon",
) {
  if (item.icon) return { icon: item.icon, emoji: undefined };
  if (item.emoji) return { icon: undefined, emoji: item.emoji };
  const fallback = defaultSectionIcons[item.key as SettingsMenuSection] as
    (typeof defaultSectionIcons)[SettingsMenuSection] | undefined;
  if (!fallback) return { icon: undefined, emoji: undefined };
  return defaultIconKind === "icon"
    ? { icon: fallback.icon, emoji: undefined }
    : { icon: undefined, emoji: fallback.emoji };
}

// Menu screen for a settings tab: one row per section (icon + title +
// optional hint), navigating to it on press, optionally grouped under
// section headers (`groups` instead of `items`). Has no opinion on how
// navigation works — each item carries its own `onPress` (e.g.
// `() => router.push("/settings/xxx")`), so this doesn't depend on
// expo-router or any other specific navigator.
export function SettingsMenu({
  items,
  groups,
  defaultIconKind = "emoji",
  showHints = true,
  styles,
}: SettingsMenuProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    groupTitle: [defaultStyles.groupTitle, styles?.groupTitle],
    row: [defaultStyles.row, styles?.row],
    titleColumn: [defaultStyles.titleColumn, styles?.titleColumn],
    emoji: [defaultStyles.emoji, styles?.emoji],
    title: [defaultStyles.title, styles?.title],
    hint: [defaultStyles.hint, styles?.hint],
  };
  const chevronColor = styles?.chevronColor ?? defaultStyles.chevronColor;
  const iconColor = styles?.iconColor ?? defaultStyles.iconColor;

  function renderItem(item: SettingsMenuItem) {
    const { icon, emoji } = resolveIcon(item, defaultIconKind);
    return (
      <Pressable
        key={item.key}
        style={merged.row}
        onPress={item.onPress}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {icon ? (
          <Ionicons name={icon} size={24} color={iconColor} />
        ) : (
          <Text style={merged.emoji}>{emoji}</Text>
        )}
        <View style={merged.titleColumn}>
          <Text style={merged.title}>{item.title}</Text>
          {showHints && item.hint ? (
            <Text style={merged.hint}>{item.hint}</Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
      </Pressable>
    );
  }

  return (
    <View style={merged.container}>
      {groups
        ? groups.map((group, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key -- groups have no other stable identifier, and are a static, author-defined list (not reordered/filtered at runtime)
            <View key={group.title ?? index} style={merged.container}>
              {group.title ? (
                <Text style={merged.groupTitle}>{group.title}</Text>
              ) : null}
              {group.items.map(renderItem)}
            </View>
          ))
        : items?.map(renderItem)}
    </View>
  );
}
