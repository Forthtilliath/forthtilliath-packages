import { ActivityIndicator, Pressable, Text } from "react-native";

import { type MergedStyles, PRIMARY_COLOR } from "./styles.js";

/**
 * Props of {@link ActionButton}.
 * @internal
 */
export interface ActionButtonProps {
  /** Text of the button, also its accessibility label. */
  label: string;
  /** Called on press (not while `disabled` or `busy`). */
  onPress: () => void;
  /**
   * `primary` (filled), `secondary` (outlined) or `ghost` (text only). Defaults
   * to `primary`.
   */
  variant?: "primary" | "secondary" | "ghost";
  /** Greys the button out and ignores presses. */
  disabled?: boolean;
  /** Shows a spinner instead of the label. */
  busy?: boolean;
  /** The screen's merged styles. */
  styles: MergedStyles;
}

/**
 * The buttons of the backup screen, styled from the screen's merged styles.
 * @param props - See {@link ActionButtonProps}.
 * @internal
 */
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
