import { type ComponentRef, type Ref, useState } from "react";
import type {
  ColorValue,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Text, TextInput, View } from "react-native";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/**
 * Per-slot style overrides for {@link TextField}, each merged after its
 * default.
 */
export interface TextFieldStyles {
  /** The column holding label, input, hint and error. */
  container?: StyleProp<ViewStyle>;
  /** The label above the input. */
  label?: StyleProp<TextStyle>;
  /** The input itself. */
  input?: StyleProp<TextStyle>;
  /** Added while the input has focus. */
  inputFocused?: StyleProp<TextStyle>;
  /** Added while `error` is set. */
  inputError?: StyleProp<TextStyle>;
  /** The hint under the input. */
  hint?: StyleProp<TextStyle>;
  /** The error message under the input. */
  error?: StyleProp<TextStyle>;
}

/**
 * The app's palette for {@link TextField}; unset ones keep the neutral default.
 */
export interface TextFieldColors {
  /** Typed text. */
  text?: ColorValue;
  /** The label. */
  label?: ColorValue;
  /** The placeholder. */
  placeholder?: ColorValue;
  /** The input's background. */
  background?: ColorValue;
  /** Contrast of at least 3:1 with the background (WCAG 1.4.11). */
  border?: ColorValue;
  /** The border while the input has focus. */
  borderFocused?: ColorValue;
  /** The error message and the border while `error` is set. */
  error?: ColorValue;
}

/**
 * Props of {@link TextField}: those of a `TextInput` (except `style`), plus the
 * options below.
 */
export interface TextFieldProps extends Omit<TextInputProps, "style"> {
  /** Shown above the input and read as its name. */
  label?: string;
  /** A line under the input, also read as its hint. */
  hint?: string;
  /**
   * Shown under the input instead of `hint`, the border turned red; announced
   * by TalkBack as soon as it appears. `null`/`undefined`/`""` = no error.
   */
  error?: string | null;
  /**
   * Adds " *" after the label, and "obligatoire" / "required" to its spoken
   * name.
   */
  required?: boolean;
  /**
   * Ref to the `TextInput` (focus, chaining with `onSubmitEditing`). Typed by
   * instance (`ComponentRef<typeof TextInput>`): since RN 0.88, `TextInput` is a
   * function component and `Ref<TextInput>` no longer names the instance.
   */
  inputRef?: Ref<ComponentRef<typeof TextInput>>;
  /** Language of the spoken "required". */
  locale?: KitLocale;
  /** The app's palette (see {@link TextFieldColors}). */
  colors?: TextFieldColors;
  /** Per-slot style overrides (see {@link TextFieldStyles}). */
  styles?: TextFieldStyles;
}

const requiredWords: Record<KitLocale, string> = {
  fr: "obligatoire",
  en: "required",
};

const defaultColors = {
  text: "#111111",
  label: "#374151",
  placeholder: "#6b7280",
  background: "#ffffff",
  border: "#8b95a1",
  borderFocused: "#2563eb",
  error: "#b42318",
} satisfies Required<TextFieldColors>;

const defaultStyles = {
  container: { gap: 4 } satisfies ViewStyle,
  label: { fontSize: 14, fontWeight: "600" } satisfies TextStyle,
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  } satisfies TextStyle,
  inputFocused: { borderWidth: 2, paddingHorizontal: 11 } satisfies TextStyle,
  inputError: { borderWidth: 2, paddingHorizontal: 11 } satisfies TextStyle,
  hint: { fontSize: 13 } satisfies TextStyle,
  error: { fontSize: 13, fontWeight: "600" } satisfies TextStyle,
};

/**
 * A text input with its label, an optional hint and an error message — all
 * three read by screen readers with the input, the error announced when it
 * appears. Every other `TextInput` prop goes through (`maxLength`,
 * `keyboardType`, `autoComplete`…).
 *
 * @example
 * ```tsx
 * import { TextField } from
 * "@forthtilliath/react-native-kit/components/form/TextField";
 *
 * <TextField
 *   label="Nom du joueur"
 *   value={name}
 *   onChangeText={setName}
 *   maxLength={30}
 *   required
 *   error={name.trim() ? null : "Le nom est obligatoire."}
 * />
 * ```
 */
export function TextField({
  label,
  hint,
  error,
  required = false,
  inputRef,
  locale,
  colors,
  styles,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...input
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const resolvedLocale = useKitLocale(locale);
  const merged = mergeSlotStyles(defaultStyles, styles);
  const palette = { ...defaultColors, ...colors };
  const hasError = !!error;
  const name = accessibilityLabel ?? label;

  return (
    <View style={merged.container}>
      {label !== undefined && (
        <Text
          style={[{ color: palette.label }, merged.label]}
          // The input carries the name: the label isn't read twice.
          importantForAccessibility="no"
          accessibilityElementsHidden
        >
          {label}
          {required && " *"}
        </Text>
      )}
      <TextInput
        ref={inputRef}
        placeholderTextColor={palette.placeholder}
        {...input}
        accessibilityLabel={
          required && name ? `${name}, ${requiredWords[resolvedLocale]}` : name
        }
        accessibilityHint={(hasError ? error : hint) ?? undefined}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          {
            color: palette.text,
            backgroundColor: palette.background,
            borderColor: palette.border,
          },
          merged.input,
          focused && [
            { borderColor: palette.borderFocused },
            merged.inputFocused,
          ],
          hasError && [{ borderColor: palette.error }, merged.inputError],
        ]}
      />
      {hasError ? (
        <Text
          style={[{ color: palette.error }, merged.error]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : (
        hint !== undefined && (
          <Text
            style={[{ color: palette.placeholder }, merged.hint]}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            {hint}
          </Text>
        )
      )}
    </View>
  );
}
