import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";
import { Button, type ButtonProps } from "../form/Button.js";

/** Per-slot style overrides for {@link EmptyState}, each merged after its default. */
export interface EmptyStateStyles {
  container?: StyleProp<ViewStyle>;
  /** The circle behind the icon. */
  iconWrap?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  message?: StyleProp<TextStyle>;
}

export interface EmptyStateProps {
  /** Why the list is empty, and what to do about it. */
  message: string;
  /** A short heading above the message. */
  title?: string;
  /** Shown in a circle above the text, hidden from screen readers. */
  icon?: ReactNode;
  /**
   * The button that fills the list ("Créer un joueur") — a kit
   * {@link Button}: `label`, `onPress`, and any other of its props
   * (`variant`, `colors`, `icon`…).
   */
  action?: ButtonProps;
  styles?: EmptyStateStyles;
}

const defaultStyles = {
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 32,
    paddingHorizontal: 16,
  } satisfies ViewStyle,
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  } satisfies TextStyle,
  message: {
    fontSize: 15,
    lineHeight: 21,
    color: "#6b7280",
    textAlign: "center",
  } satisfies TextStyle,
};

/**
 * What an empty list shows: an icon, an explanation, and when possible the
 * action that gets out of it.
 *
 * @example
 * ```tsx
 * import { EmptyState } from "@forthtilliath/react-native-kit/components/feedback/EmptyState";
 *
 * <FlatList
 *   data={players}
 *   ListEmptyComponent={
 *     <EmptyState
 *       icon={<Ionicons name="people-outline" size={36} color={c.muted} />}
 *       title="Aucun joueur"
 *       message="Ajoute les joueurs une fois, ils seront proposés à chaque partie."
 *       action={{ label: "Créer un joueur", onPress: () => router.push("/players/new"), fullWidth: true }}
 *     />
 *   }
 * />
 * ```
 */
export function EmptyState({
  message,
  title,
  icon,
  action,
  styles,
}: EmptyStateProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.container}>
      {icon !== undefined && (
        <View
          style={merged.iconWrap}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          {icon}
        </View>
      )}
      {title !== undefined && (
        <Text style={merged.title} accessibilityRole="header">
          {title}
        </Text>
      )}
      <Text style={merged.message}>{message}</Text>
      {action && <Button {...action} />}
    </View>
  );
}
