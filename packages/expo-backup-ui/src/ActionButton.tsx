import { ActivityIndicator, Pressable, Text } from "react-native";

import { type MergedStyles, PRIMARY_COLOR } from "./styles.js";

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  /** Shows a spinner instead of the label. */
  busy?: boolean;
  styles: MergedStyles;
}

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  busy = false,
  styles,
}: ActionButtonProps) {
  const variantStyle =
    variant === "secondary"
      ? styles.secondaryButton
      : variant === "ghost"
        ? styles.ghostButton
        : undefined;
  const variantTextStyle =
    variant === "secondary"
      ? styles.secondaryButtonText
      : variant === "ghost"
        ? styles.ghostButtonText
        : undefined;
  const spinnerColor =
    styles.activityIndicatorColor ??
    (variant === "primary" ? "#ffffff" : PRIMARY_COLOR);

  return (
    <Pressable
      style={[
        styles.button,
        variantStyle,
        (disabled || busy) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy, busy }}
    >
      {busy ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={[styles.buttonText, variantTextStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}
