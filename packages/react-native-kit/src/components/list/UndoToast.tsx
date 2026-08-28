import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

/**
 * Per-slot style overrides for {@link UndoToast}. Every field is optional and
 * is **merged after** the matching default (as a style array), so overriding
 * one property (say `toast.backgroundColor`) keeps the rest of the default
 * for that slot — the positioning, padding, and shadow don't disappear.
 */
export interface UndoToastStyles {
  /** The floating bar container (absolute-positioned, near the bottom). */
  toast?: StyleProp<ViewStyle>;
  /** The message text on the left. Truncated to a single line. */
  message?: StyleProp<TextStyle>;
  /** The action label on the right (the tappable "Undo"). */
  action?: StyleProp<TextStyle>;
}

export interface UndoToastProps {
  /**
   * What just happened, phrased in the past tense — e.g.
   * `"« Marie » supprimée"` or `"1 item deleted"`. Rendered on a
   * single line and truncated with an ellipsis if too long.
   */
  message: string;
  /**
   * Label of the action button.
   *
   * @defaultValue "Undo"
   */
  actionLabel?: string;
  /**
   * Called when the action button is tapped. Wire this to your reverse-the-
   * change logic (restore the row, re-insert the item…). The host is
   * responsible for hiding the toast afterwards.
   */
  onAction: () => void;
  /** Per-slot style overrides — see {@link UndoToastStyles}. */
  styles?: UndoToastStyles;
}

const defaultStyles = {
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1f1f1f",
    elevation: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  } satisfies ViewStyle,
  message: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  } satisfies TextStyle,
  action: {
    color: "#7cc0ff",
    fontWeight: "700",
    fontSize: 14,
  } satisfies TextStyle,
};

/**
 * A bottom-of-screen snackbar for **undoing an action that already
 * happened** — the counterpart to a delete that runs immediately with no
 * confirmation dialog (for instance a {@link SwipeToDeleteRow} swipe).
 *
 * `UndoToast` is presentational only: it does not time itself out, animate
 * in/out, or stack. The host owns that — typically a piece of state holding
 * the "pending undo" payload, a `setTimeout` that commits the change for
 * good, and an exit animation. This keeps the component free of any
 * animation-library or timer opinions.
 *
 * The default look is a dark floating bar, readable on both light and dark
 * backgrounds. Re-theme it through {@link UndoToastProps.styles}.
 *
 * @example Minimal
 * ```tsx
 * import { UndoToast } from "@forthtilliath/react-native-kit/components/list/UndoToast";
 *
 * {recentlyDeleted && (
 *   <UndoToast
 *     message={`"${recentlyDeleted.name}" deleted`}
 *     onAction={restoreLast}
 *   />
 * )}
 * ```
 *
 * @example Full pattern — auto-commit after 5s, localized label, themed
 * ```tsx
 * const [pending, setPending] = useState<Employee | null>(null);
 *
 * function remove(employee: Employee) {
 *   setEmployees((list) => list.filter((e) => e.id !== employee.id));
 *   setPending(employee);
 * }
 *
 * useEffect(() => {
 *   if (!pending) return;
 *   const id = setTimeout(() => {
 *     db.deleteEmployee(pending.id); // point of no return
 *     setPending(null);
 *   }, 5000);
 *   return () => clearTimeout(id);
 * }, [pending]);
 *
 * {pending && (
 *   <UndoToast
 *     message={`« ${pending.name} » supprimé`}
 *     actionLabel="Annuler"
 *     onAction={() => {
 *       setEmployees((list) => [...list, pending]);
 *       setPending(null);
 *     }}
 *     styles={{
 *       toast: { backgroundColor: colors.inverseSurface },
 *       message: { color: colors.inverseOnSurface },
 *       action: { color: colors.inversePrimary },
 *     }}
 *   />
 * )}
 * ```
 */
export function UndoToast({
  message,
  actionLabel = "Undo",
  onAction,
  styles,
}: UndoToastProps) {
  // Merge each slot as [default, override] so a partial override doesn't drop
  // the rest of that slot's default (positioning, shadow, flex…).
  const merged = {
    toast: [defaultStyles.toast, styles?.toast],
    message: [defaultStyles.message, styles?.message],
    action: [defaultStyles.action, styles?.action],
  };

  return (
    <View style={merged.toast}>
      <Text style={merged.message} numberOfLines={1}>
        {message}
      </Text>
      <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
        <Text style={merged.action}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
