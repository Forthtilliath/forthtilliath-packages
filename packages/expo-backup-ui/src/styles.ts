import type { StyleProp, TextStyle, ViewStyle } from "react-native";

/** Per-slot overrides, merged on top of the defaults (not replacing them). */
export interface BackupScreenStyles {
  container?: StyleProp<ViewStyle>;
  section?: StyleProp<ViewStyle>;
  sectionTitle?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
  status?: StyleProp<TextStyle>;
  errorText?: StyleProp<TextStyle>;
  button?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
  secondaryButton?: StyleProp<ViewStyle>;
  secondaryButtonText?: StyleProp<TextStyle>;
  ghostButton?: StyleProp<ViewStyle>;
  ghostButtonText?: StyleProp<TextStyle>;
  buttonDisabled?: StyleProp<ViewStyle>;
  switchRow?: StyleProp<ViewStyle>;
  switchLabel?: StyleProp<TextStyle>;
  modalBackdrop?: StyleProp<ViewStyle>;
  modalCard?: StyleProp<ViewStyle>;
  recoveryCode?: StyleProp<TextStyle>;
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

export const PRIMARY_COLOR = primary;

export type MergedStyles = Record<Slot, StyleProp<ViewStyle | TextStyle>[]> & {
  /** Undefined: white on primary buttons, primary color elsewhere. */
  activityIndicatorColor: string | undefined;
  placeholderTextColor: string;
};

/** Each slot as `[default, override]`, so overriding one property keeps the rest. */
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
