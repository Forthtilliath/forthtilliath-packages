import { type ReactNode, useEffect, useRef, useState } from "react";
import type { ColorValue, Insets } from "react-native";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  type ButtonColors,
  type ButtonSize,
  type ButtonStyles,
  type ButtonVariant,
  defaultButtonColors,
  defaultButtonStyles,
  sizeStyles,
  variantColors,
} from "./Button.styles.js";

export type {
  ButtonColors,
  ButtonSize,
  ButtonStyles,
  ButtonVariant,
} from "./Button.styles.js";

export interface ButtonProps {
  label: string;
  /**
   * Called on press. When it returns a promise, the button shows a spinner
   * and ignores presses until it settles — no double submission, without
   * any state in the caller. A rejection goes to `onError`.
   */
  onPress?: (() => void) | (() => Promise<unknown>);
  /** Receives a rejection of `onPress`'s promise; without it, it stays unhandled. */
  onError?: (error: unknown) => void;
  /** @defaultValue "primary" */
  variant?: ButtonVariant;
  /** @defaultValue "md" (48 dp, Android's minimum touch target) */
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner and ignores presses (announced as busy). */
  loading?: boolean;
  /**
   * Shown next to the label: a node, or a function receiving the label color
   * (`(color) => <Ionicons name="add" size={20} color={color} />`).
   */
  icon?: ReactNode | ((color: ColorValue) => ReactNode);
  /** @defaultValue "start" */
  iconPosition?: "start" | "end";
  /** Stretches to the parent's width. @defaultValue false */
  fullWidth?: boolean;
  /**
   * Drawn under the label, filling the button and clipped to its corners —
   * e.g. a stretched gradient image (`<Image source={gradient} style={StyleSheet.absoluteFill} resizeMode="stretch" />`).
   */
  background?: ReactNode;
  /** Read by screen readers instead of `label`. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Caps the system font scaling of the label. */
  maxFontSizeMultiplier?: number;
  /** Extends the touch area beyond the button (useful with `size="sm"`). */
  hitSlop?: number | Insets;
  testID?: string;
  /** The app's palette — see {@link ButtonColors}. */
  colors?: ButtonColors;
  /** Per-slot style overrides — see {@link ButtonStyles}. */
  styles?: ButtonStyles;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/**
 * A button with five variants (`primary`, `secondary`, `outline`, `ghost`,
 * `danger`), three sizes, an optional icon, a loading state, and built-in
 * protection against double taps on async actions. Themed with one `colors`
 * object; every slot can be restyled through `styles`.
 *
 * @example
 * ```tsx
 * import { Button } from "@forthtilliath/react-native-kit/components/form/Button";
 *
 * <Button label="Enregistrer" onPress={save} colors={{ primary: c.primary, onPrimary: c.onPrimary }} />
 * <Button label="Supprimer" variant="danger" onPress={() => confirmDestructive("Supprimer ?", remove)} />
 * ```
 */
export function Button({
  label,
  onPress,
  onError,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "start",
  fullWidth = false,
  background,
  accessibilityLabel,
  accessibilityHint,
  maxFontSizeMultiplier,
  hitSlop,
  testID,
  colors,
  styles,
}: ButtonProps) {
  const [pending, setPending] = useState(false);
  // State updates land after the frame: a ref also stops a second tap
  // arriving before the re-render.
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const busy = loading || pending;
  const inactive = disabled || busy;
  const palette = variantColors(variant, { ...defaultButtonColors, ...colors });
  const sizing = sizeStyles[size];

  const handlePress = () => {
    if (inactive || pendingRef.current) return;
    const result = onPress?.();
    if (!isPromiseLike(result)) return;
    pendingRef.current = true;
    setPending(true);
    const settle = () => {
      pendingRef.current = false;
      if (mountedRef.current) setPending(false);
    };
    void result.then(settle, (error: unknown) => {
      settle();
      if (!onError) throw error;
      onError(error);
    });
  };

  const iconNode = busy ? (
    <ActivityIndicator size="small" color={palette.label} />
  ) : typeof icon === "function" ? (
    icon(palette.label)
  ) : (
    icon
  );

  return (
    <Pressable
      onPress={handlePress}
      disabled={inactive}
      hitSlop={hitSlop}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy }}
      style={({ pressed }) => [
        defaultButtonStyles.button,
        {
          minHeight: sizing.minHeight,
          paddingHorizontal: sizing.paddingHorizontal,
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        fullWidth && { alignSelf: "stretch" },
        styles?.button,
        pressed && !inactive && [defaultButtonStyles.pressed, styles?.pressed],
        disabled && [defaultButtonStyles.disabled, styles?.disabled],
      ]}
    >
      {background !== undefined && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {background}
        </View>
      )}
      <View
        style={[
          defaultButtonStyles.content,
          { gap: sizing.gap },
          iconPosition === "end" && { flexDirection: "row-reverse" },
          styles?.content,
        ]}
      >
        {iconNode}
        <Text
          style={[
            defaultButtonStyles.label,
            { color: palette.label, fontSize: sizing.fontSize },
            styles?.label,
          ]}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
