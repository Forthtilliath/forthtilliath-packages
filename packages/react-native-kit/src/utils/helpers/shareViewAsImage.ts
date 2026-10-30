import type { ComponentRef, RefObject } from "react";
import type { View } from "react-native";

import { DEFAULT_KIT_LOCALE, type KitLocale } from "../../i18n/locale.js";

import { isNativeModuleAvailable } from "./isNativeModuleAvailable.js";
import { shareFile, type ShareFileOptions } from "./shareFile.js";

export type ShareViewAsImageOptions = Omit<ShareFileOptions, "mimeType"> & {
  /** Message of the error thrown when this binary can't capture views. */
  captureUnavailableMessage?: string;
};

const defaultCaptureUnavailableMessages: Record<KitLocale, string> = {
  fr: "Le partage en image n'est pas disponible dans cette version de l'app.",
  en: "Sharing as an image isn't available in this version of the app.",
};

/**
 * Captures a view as a PNG and opens the native share sheet with it (a
 * scoreboard, a schedule…). Needs `react-native-view-shot` and
 * `expo-sharing`. The capture library is loaded on demand, once its native
 * module is known to be there: on a binary built without it, only this
 * feature fails — with a user-facing `Error` — instead of the whole screen.
 *
 * @param view - Ref of the view to capture (`collapsable={false}` on Android),
 *   as `useRef<ComponentRef<typeof View>>(null)` gives — `View` is the
 *   component, not its instance type.
 * @param options - See {@link ShareViewAsImageOptions} and `shareFile`.
 * @example
 * await shareViewAsImage(rankingRef, { dialogTitle: "Partager le classement" });
 */
export async function shareViewAsImage(
  view: RefObject<ComponentRef<typeof View> | null>,
  { captureUnavailableMessage, ...options }: ShareViewAsImageOptions = {},
): Promise<void> {
  if (!isNativeModuleAvailable("RNViewShot")) {
    throw new Error(
      captureUnavailableMessage ??
        defaultCaptureUnavailableMessages[options.locale ?? DEFAULT_KIT_LOCALE],
    );
  }
  const { captureRef } = await import("react-native-view-shot");
  const uri = await captureRef(view, {
    format: "png",
    quality: 1,
    result: "tmpfile",
  });
  await shareFile(uri, { ...options, mimeType: "image/png" });
}
