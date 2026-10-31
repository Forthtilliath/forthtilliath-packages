import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Per-slot overrides, merged on top of the defaults (not replacing them). */
export interface BackupScreenStyles {
  /** The screen's root view. */
  container?: StyleProp<ViewStyle>;
  /** Each card (Drive, file, encryption). */
  section?: StyleProp<ViewStyle>;
  /** Title of a card. */
  sectionTitle?: StyleProp<TextStyle>;
  /** Explanatory text of a card. */
  hint?: StyleProp<TextStyle>;
  /** Status line (last backup, linked account). */
  status?: StyleProp<TextStyle>;
  /** Failure message of the Drive card. */
  errorText?: StyleProp<TextStyle>;
  /** Primary (filled) buttons. */
  button?: StyleProp<ViewStyle>;
  /** Their label. */
  buttonText?: StyleProp<TextStyle>;
  /** Secondary (outlined) buttons, on top of `button`. */
  secondaryButton?: StyleProp<ViewStyle>;
  /** Their label. */
  secondaryButtonText?: StyleProp<TextStyle>;
  /**
   * Text-only buttons (disconnect, enter a recovery code…), on top of `button`.
   */
  ghostButton?: StyleProp<ViewStyle>;
  /** Their label. */
  ghostButtonText?: StyleProp<TextStyle>;
  /** Added to a button while it is disabled or another action runs. */
  buttonDisabled?: StyleProp<ViewStyle>;
  /** Row of the encryption switch. */
  switchRow?: StyleProp<ViewStyle>;
  /** Label of the switch. */
  switchLabel?: StyleProp<TextStyle>;
  /** Dimmed background behind the recovery code windows. */
  modalBackdrop?: StyleProp<ViewStyle>;
  /** Card of those windows. */
  modalCard?: StyleProp<ViewStyle>;
  /** The recovery code itself (large, monospaced, selectable). */
  recoveryCode?: StyleProp<TextStyle>;
  /** The recovery code input. */
  input?: StyleProp<TextStyle>;
  /** Not a style: color of the spinners. */
  activityIndicatorColor?: string;
  /** Not a style: placeholder color of the recovery-code input. */
  placeholderTextColor?: string;
}

type Slot = Exclude<
  keyof BackupScreenStyles,
  "activityIndicatorColor" | "placeholderTextColor"
>;

const primary = "#2563eb";

/**
 * Default style of each slot (white cards, blue primary buttons).
 * @internal
 */
export const defaultStyles: Record<Slot, ViewStyle | TextStyle> = {
  container: { gap: 16 },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  hint: { fontSize: 13, lineHeight: 18, color: "#6b7280" },
  status: { fontSize: 14, color: "#111827" },
  errorText: { fontSize: 13, color: "#dc2626" },
  button: {
    backgroundColor: primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: primary,
  },
  secondaryButtonText: { color: primary },
  ghostButton: { backgroundColor: "transparent" },
  ghostButtonText: { color: "#6b7280" },
  buttonDisabled: { opacity: 0.5 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: { flex: 1, fontSize: 15, color: "#111827" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  recoveryCode: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: "monospace",
    letterSpacing: 1,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontFamily: "monospace",
    color: "#111827",
  },
};

/**
 * Blue of the default primary buttons, also the default spinner color.
 * @internal
 */
export const PRIMARY_COLOR = primary;

/**
 * Each slot as `[default, override]`, ready for a `style` prop.
 * @internal
 */
export type MergedStyles = Record<Slot, StyleProp<ViewStyle | TextStyle>[]> & {
  /** Undefined: white on primary buttons, primary color elsewhere. */
  activityIndicatorColor: string | undefined;
  placeholderTextColor: string;
};

/**
 * Each slot as `[default, override]`, so overriding one property keeps the
 * rest.
 * @internal
 */
export function mergeStyles(
  overrides: BackupScreenStyles | undefined,
): MergedStyles {
  const merged: Partial<Record<Slot, StyleProp<ViewStyle | TextStyle>[]>> = {};
  for (const slot of Object.keys(defaultStyles) as Slot[]) {
    merged[slot] = [defaultStyles[slot], overrides?.[slot]];
  }
  return {
    ...(merged as Record<Slot, StyleProp<ViewStyle | TextStyle>[]>),
    activityIndicatorColor: overrides?.activityIndicatorColor,
    placeholderTextColor: overrides?.placeholderTextColor ?? "#9ca3af",
  };
}
