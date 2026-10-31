import type { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

/**
 * The app's palette for {@link Button}: each variant reads the colors it
 * needs, so one object themes all five. Unset ones keep the neutral default.
 */
export interface ButtonColors {
  /** `primary` background; `outline` border and label; `ghost` label. */
  primary?: ColorValue;
  /** Label on `primary`. */
  onPrimary?: ColorValue;
  /** `secondary` background. */
  secondary?: ColorValue;
  /** Label on `secondary`. */
  onSecondary?: ColorValue;
  /** `secondary` border. */
  border?: ColorValue;
  /** `danger` background. */
  danger?: ColorValue;
  /** Label on `danger`. */
  onDanger?: ColorValue;
}

/** Per-slot style overrides for {@link Button}, each merged after its default. */
export interface ButtonStyles {
  /** The pressable itself: background, border, radius, padding, height. */
  button?: StyleProp<ViewStyle>;
  /** Added while pressed (default: lower opacity). */
  pressed?: StyleProp<ViewStyle>;
  /** Added while disabled (default: lower opacity). */
  disabled?: StyleProp<ViewStyle>;
  /** The row holding the icon and the label. */
  content?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
}

export const defaultButtonColors = {
  primary: "#2563eb",
  onPrimary: "#ffffff",
  secondary: "#f1f5f9",
  onSecondary: "#0f172a",
  border: "#cbd5e1",
  danger: "#dc2626",
  onDanger: "#ffffff",
} satisfies Required<ButtonColors>;

/** Background, border and label color of each variant. */
export function variantColors(
  variant: ButtonVariant,
  colors: Required<ButtonColors>,
): { background: ColorValue; border: ColorValue; label: ColorValue } {
  switch (variant) {
    case "primary":
      return {
        background: colors.primary,
        border: colors.primary,
        label: colors.onPrimary,
      };
    case "secondary":
      return {
        background: colors.secondary,
        border: colors.border,
        label: colors.onSecondary,
      };
    case "outline":
      return {
        background: "transparent",
        border: colors.primary,
        label: colors.primary,
      };
    case "ghost":
      return {
        background: "transparent",
        border: "transparent",
        label: colors.primary,
      };
    case "danger":
      return {
        background: colors.danger,
        border: colors.danger,
        label: colors.onDanger,
      };
  }
}

// 48 dp for "md": Android's minimum touch target. "sm" is for dense rows —
// give it a hitSlop if it stands alone.
export const sizeStyles = {
  sm: { minHeight: 36, paddingHorizontal: 12, gap: 6, fontSize: 14 },
  md: { minHeight: 48, paddingHorizontal: 16, gap: 8, fontSize: 16 },
  lg: { minHeight: 56, paddingHorizontal: 20, gap: 10, fontSize: 17 },
} as const;

export const defaultButtonStyles = {
  button: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    // Clips a `background` image to the rounded corners.
    overflow: "hidden",
  } satisfies ViewStyle,
  pressed: { opacity: 0.75 } satisfies ViewStyle,
  disabled: { opacity: 0.4 } satisfies ViewStyle,
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  label: {
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  } satisfies TextStyle,
};
