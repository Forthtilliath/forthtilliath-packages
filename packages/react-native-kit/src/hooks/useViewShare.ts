import { type ComponentRef, useRef, useState } from "react";
import { Alert, type View } from "react-native";

import { type KitLocale, useKitLocale } from "../i18n/locale.js";
import {
  shareViewAsImage,
  type ShareViewAsImageOptions,
} from "../utils/helpers/shareViewAsImage.js";

export interface UseViewShareOptions extends ShareViewAsImageOptions {
  /**
   * Called when the capture or the share fails (capture missing from this
   * binary, no share sheet…). Unset, an alert shows the error's message.
   */
  onError?: (error: unknown) => void;
  /** Title of the default error alert. */
  errorTitle?: string;
  /** Message of the default error alert, for an error without a message. */
  errorMessage?: string;
}

const defaultErrorLabels: Record<
  KitLocale,
  { errorTitle: string; errorMessage: string }
> = {
  fr: {
    errorTitle: "Partage impossible",
    errorMessage: "L'image n'a pas pu être créée.",
  },
  en: {
    errorTitle: "Couldn't share",
    errorMessage: "The image couldn't be created.",
  },
};

/** Resolves once React has rendered the last state change and native drew it. */
function nextFrames() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Shares as an image a view rendered on demand (a scoreboard, a summary card
 * that isn't on screen): `capturing` is `true` while the capture runs — the
 * screen mounts the view attached to `ref` (off screen, `collapsable={false}`)
 * only meanwhile — and `share()` waits two frames for it to be drawn before
 * capturing it with {@link shareViewAsImage}. A second `share()` while one is
 * running is ignored.
 *
 * @example
 * ```tsx
 * const ranking = useViewShare({ dialogTitle: "Partager le classement" });
 *
 * <Button title="Partager" onPress={() => void ranking.share()} />
 * {ranking.capturing ? (
 *   <View ref={ranking.ref} collapsable={false} style={offScreen}>
 *     <RankingCard />
 *   </View>
 * ) : null}
 * ```
 */
export function useViewShare({
  onError,
  errorTitle,
  errorMessage,
  ...options
}: UseViewShareOptions = {}) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [capturing, setCapturing] = useState(false);
  // Ahead of `capturing`, which only changes on the next render.
  const busyRef = useRef(false);
  const locale = useKitLocale(options.locale);
  const defaults = defaultErrorLabels[locale];

  async function share() {
    if (busyRef.current) return;
    busyRef.current = true;
    setCapturing(true);
    try {
      await nextFrames();
      await shareViewAsImage(ref, { ...options, locale });
    } catch (error) {
      if (onError) onError(error);
      else
        Alert.alert(
          errorTitle ?? defaults.errorTitle,
          error instanceof Error && error.message
            ? error.message
            : (errorMessage ?? defaults.errorMessage),
        );
    } finally {
      busyRef.current = false;
      setCapturing(false);
    }
  }

  return { ref, capturing, share };
}
