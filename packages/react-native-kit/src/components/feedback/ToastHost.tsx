import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated } from "react-native";

import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";

import {
  registerToastHost,
  type ToastHideReason,
  type ToastRequest,
} from "./toast.js";
import { ToastBar, type ToastHostStyles } from "./ToastBar.js";

export type { ToastHostStyles } from "./ToastBar.js";

export interface ToastHostProps {
  /**
   * Distance from the bottom of the host — add the bottom safe-area inset,
   * and the tab bar or a floating button the toast must not cover.
   *
   * @defaultValue 24
   */
  bottomOffset?: number;
  /** Longer messages are cut with an ellipsis. @defaultValue 3 */
  maxLines?: number;
  /** Fade in/out duration; 0 when Android animations are removed. @defaultValue 200 */
  fadeMs?: number;
  /** Language of the built-in hint. */
  locale?: KitLocale;
  /** Overrides the screen-reader hint of the message ("Masque le message"). */
  dismissHint?: string;
  styles?: ToastHostStyles;
}

const dismissHints: Record<KitLocale, string> = {
  fr: "Masque le message",
  en: "Hides the message",
};

const DEFAULT_DURATION_MS = 3500;
const DEFAULT_ACTION_DURATION_MS = 5000;

/**
 * The delay asked for, lengthened by Android's accessibility "Time to take
 * action" — never shortened: anything but a longer finite number (a mock
 * answering `false`, a platform without the setting) keeps `ms`.
 */
async function recommendedTimeout(ms: number): Promise<number> {
  if (typeof AccessibilityInfo.getRecommendedTimeoutMillis !== "function") {
    return ms;
  }
  try {
    const recommended: unknown =
      await AccessibilityInfo.getRecommendedTimeoutMillis(ms);
    return typeof recommended === "number" &&
      Number.isFinite(recommended) &&
      recommended > ms
      ? recommended
      : ms;
  } catch {
    return ms;
  }
}

/**
 * Where the toasts of `showToast()` appear: mount one at the root of the app
 * (it survives navigation, like an undo offered after leaving a screen), and
 * one inside each `Modal` that needs its own — the most recently mounted host
 * receives the toasts. Announced by TalkBack, auto-hidden, one at a time.
 *
 * @example
 * ```tsx
 * import { ToastHost } from "@forthtilliath/react-native-kit/components/feedback/ToastHost";
 *
 * // app/_layout.tsx, last child so it draws on top
 * <ToastHost bottomOffset={insets.bottom + 64} />
 * ```
 */
export function ToastHost({
  bottomOffset = 24,
  maxLines = 3,
  fadeMs = 200,
  locale,
  dismissHint,
  styles,
}: ToastHostProps) {
  const resolvedLocale = useKitLocale(locale);
  const reducedMotion = useReducedMotion();
  const [toast, setToast] = useState<ToastRequest | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const fadeRef = useRef(fadeMs);
  const endRef = useRef<((reason: ToastHideReason) => void) | null>(null);

  useEffect(() => {
    fadeRef.current = reducedMotion ? 0 : fadeMs;
  }, [fadeMs, reducedMotion]);

  useEffect(() => {
    let current: ToastRequest | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const end = (reason: ToastHideReason) => {
      clearTimeout(timer);
      const ended = current;
      if (!ended) return;
      current = null;
      ended.onHide?.(reason);
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeRef.current,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && current === null) setToast(null);
      });
    };

    const unregister = registerToastHost({
      show(next) {
        clearTimeout(timer);
        current?.onHide?.("replaced");
        current = next;
        setToast(next);
        const duration =
          next.durationMs ??
          (next.action ? DEFAULT_ACTION_DURATION_MS : DEFAULT_DURATION_MS);
        void recommendedTimeout(duration).then((ms) => {
          if (current?.id !== next.id) return;
          timer = setTimeout(() => {
            end("timeout");
          }, ms);
        });
      },
      hide: () => {
        end("hidden");
      },
    });
    endRef.current = end;

    return () => {
      unregister();
      clearTimeout(timer);
      endRef.current = null;
      // The action stays done: let the app commit it.
      current?.onHide?.("hidden");
      current = null;
    };
  }, [opacity]);

  if (!toast) return null;

  return (
    <ToastBar
      toast={toast}
      opacity={opacity}
      fadeRef={fadeRef}
      endRef={endRef}
      bottomOffset={bottomOffset}
      maxLines={maxLines}
      dismissHint={dismissHint ?? dismissHints[resolvedLocale]}
      styles={styles}
    />
  );
}
