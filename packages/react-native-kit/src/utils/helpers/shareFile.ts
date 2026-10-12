import * as Sharing from "expo-sharing";

import { DEFAULT_KIT_LOCALE, type KitLocale } from "../../i18n/locale.js";

export interface ShareFileOptions {
  /** E.g. `"text/calendar"`, `"image/png"`. */
  mimeType: string;
  /** Title of Android's share sheet. */
  dialogTitle?: string;
  /** Language of the default error message. @defaultValue "fr" */
  locale?: KitLocale;
  /** Message of the error thrown when the device can't share. */
  unavailableMessage?: string;
}

const defaultUnavailableMessages: Record<KitLocale, string> = {
  fr: "Le partage n'est pas disponible sur cet appareil.",
  en: "Sharing isn't available on this device.",
};

/**
 * Opens the native share sheet for a local file (a capture, an export…).
 * Needs `expo-sharing` (an optional peer dependency).
 *
 * @param uri - A `file://` URI.
 * @param options - See {@link ShareFileOptions}.
 * @throws An `Error` with a user-facing message when sharing isn't available.
 * @example
 * await shareFile(captureUri, { mimeType: "image/png", dialogTitle: "Partager le planning" });
 */
export async function shareFile(
  uri: string,
  options: ShareFileOptions,
): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error(
      options.unavailableMessage ??
        defaultUnavailableMessages[options.locale ?? DEFAULT_KIT_LOCALE],
    );
  }
  await Sharing.shareAsync(uri, {
    mimeType: options.mimeType,
    dialogTitle: options.dialogTitle,
  });
}
