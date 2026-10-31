/** A button at the right of a toast — typically "Annuler" after a deletion. */
export interface ToastAction {
  label: string;
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

export interface ToastOptions {
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

export interface ToastRequest extends ToastOptions {
  id: number;
  message: string;
}

/** What a `ToastHost` registers to receive toasts. */
export interface ToastHostHandle {
  show: (toast: ToastRequest) => void;
  hide: () => void;
}

const hosts: ToastHostHandle[] = [];
let lastId = 0;

/**
 * Registers a host; the most recently registered one (e.g. the host inside a
 * `Modal` that just opened) receives the toasts until it unregisters.
 *
 * @returns The function that unregisters it.
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
 * @returns The toast's id, or `null` when no `ToastHost` is mounted (nothing shown).
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
