import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import type { KitLocale } from "../../i18n/locale.js";

/**
 * Per-slot style overrides for {@link QuantityStepper}, each merged after its
 * default.
 */
export interface QuantityStepperStyles {
  /** The row: − button, field, + button. */
  row?: StyleProp<ViewStyle>;
  /** Both round buttons. */
  button?: StyleProp<ViewStyle>;
  /** Added on top of `button` for "−" at `min` and "+" at `max`. */
  buttonDisabled?: StyleProp<ViewStyle>;
  /** The "−" / "+" glyphs. */
  buttonText?: StyleProp<TextStyle>;
  /** The numeric field in the middle (its text color included). */
  input?: StyleProp<TextStyle>;
}

/**
 * Screen-reader labels of the three controls, built from the stepper's `label`.
 */
export interface QuantityStepperA11yLabels {
  /** Spoken name of "−", from the stepper's `label`. */
  decrease: (label: string) => string;
  /** Spoken name of "+", from the stepper's `label`. */
  increase: (label: string) => string;
  /** Spoken name of the number field, from the stepper's `label`. */
  input: (label: string) => string;
}

/** Built-in spoken names of {@link QuantityStepper}, per locale. */
export const defaultA11yLabels: Record<KitLocale, QuantityStepperA11yLabels> = {
  fr: {
    decrease: (label) => `Retirer : ${label}`,
    increase: (label) => `Ajouter : ${label}`,
    input: (label) => `Quantité : ${label}`,
  },
  en: {
    decrease: (label) => `Decrease: ${label}`,
    increase: (label) => `Increase: ${label}`,
    input: (label) => `Quantity: ${label}`,
  },
};

/**
 * Default style of each slot of {@link QuantityStepper} (round blue buttons,
 * centered number).
 */
export const defaultStyles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  } satisfies ViewStyle,
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  buttonDisabled: { opacity: 0.35 } satisfies ViewStyle,
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  } satisfies TextStyle,
  input: {
    width: 52,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    padding: 0,
  } satisfies TextStyle,
};
