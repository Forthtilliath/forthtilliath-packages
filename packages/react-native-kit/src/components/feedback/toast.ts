/** A button at the right of a toast — typically "Annuler" after a deletion. */
export interface ToastAction {
  /** Text of the action button, e.g. "Annuler" / "Undo". */
  label: string;
  /**
   * Called when the action is pressed; the toast then hides with reason
   * `"action"`.
   */
  onPress: () => void;
}

/** How a toast went away, given to {@link ToastOptions.onHide}. */
export type ToastHideReason =
  /** Its time ran out. */
  | "timeout"
  /** Its action was pressed (`action.onPress` already called). */
  | "action"
  /** The user tapped the message to close it. */
  | "dismissed"
  /** A newer toast took its place. */
  | "replaced"
  /** `hideToast()` was called, or its host unmounted. */
  | "hidden";

/** Options of {@link showToast}. */
export interface ToastOptions {
  /**
   * A button on the toast (e.g. undo), which lengthens its default duration.
   */
  action?: ToastAction;
  /**
   * How long it stays, before Android's "Time to take action" setting
   * (Accessibility) lengthens it if the user chose a longer delay.
   *
   * @defaultValue 3500, or 5000 with an `action`
   */
  durationMs?: number;
  /**
   * Called once when the toast goes away, with the reason. For an undoable
   * action, commit it for good here unless the reason is `"action"`.
   */
  onHide?: (reason: ToastHideReason) => void;
}

/**
 * A toast as handed to the host: the options plus an id and the message.
 * @internal
 */
export interface ToastRequest extends ToastOptions {
  /**
   * Unique id of this toast, so the host can tell a new toast from the current
   * one.
   */
  id: number;
  /** The text to show. */
  message: string;
}

/** What a `ToastHost` registers to receive toasts. */
export interface ToastHostHandle {
  /** Displays a toast, replacing the current one. */
  show: (toast: ToastRequest) => void;
  /** Hides the current toast. */
  hide: () => void;
}

const hosts: ToastHostHandle[] = [];
let lastId = 0;

/**
 * Registers a host; the most recently registered one (e.g. the host inside a
 * `Modal` that just opened) receives the toasts until it unregisters.
 *
 * @returns The function that unregisters it.
 * @internal
 */
export function registerToastHost(host: ToastHostHandle): () => void {
  hosts.push(host);
  return () => {
    const index = hosts.lastIndexOf(host);
    if (index !== -1) hosts.splice(index, 1);
  };
}

/**
 * Shows a short message at the bottom of the screen, from anywhere (a store
 * action, an event handler…), in the topmost mounted `ToastHost`. A new toast
 * replaces the one on screen.
 *
 * @param message - Plain text, a few words; `\n` starts a new line.
 * @param options - See {@link ToastOptions}.
 * @returns The toast's id, or `null` when no `ToastHost` is mounted (nothing
 *   shown).
 * @example
 * showToast("Partie enregistrée");
 * showToast(`« ${player.name} » supprimé`, {
 *   action: { label: "Annuler", onPress: () => restore(player) },
 *   onHide: (reason) => { if (reason !== "action") purgePhoto(player) },
 * });
 */
export function showToast(
  message: string,
  options: ToastOptions = {},
): number | null {
  const host = hosts.at(-1);
  if (!host) return null;
  lastId += 1;
  host.show({ ...options, id: lastId, message });
  return lastId;
}

/** Hides the toast of every host (reason `"hidden"`). */
export function hideToast(): void {
  for (const host of [...hosts]) host.hide();
}
