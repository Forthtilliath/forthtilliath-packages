import * as Haptics from "expo-haptics";

// Semantic aliases around expo-haptics. Every call is fire-and-forget: a
// failed vibration (web, no motor, haptics off) must never fail the action it
// accompanies.

/** Light tap — a button press or a stepper step. */
export function tapFeedback(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
    /* best effort */
  });
}

/** Selection tick — picking an option or flipping a switch. */
export function selectFeedback(): void {
  Haptics.selectionAsync().catch(() => {
    /* best effort */
  });
}

/** An action that succeeded (saved, drawn, sent…). */
export function successFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {
      /* best effort */
    },
  );
}

/** An action that failed. */
export function errorFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {
      /* best effort */
    },
  );
}
