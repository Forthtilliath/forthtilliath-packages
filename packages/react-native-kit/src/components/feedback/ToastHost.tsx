import { useEffect, useRef, useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { AccessibilityInfo, Animated, Pressable, Text } from "react-native";

import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import {
  registerToastHost,
  type ToastHideReason,
  type ToastRequest,
} from "./toast.js";

/** Per-slot style overrides for {@link ToastHost}, each merged after its default. */
export interface ToastHostStyles {
  /** The floating bar (absolute-positioned near the bottom). */
  toast?: StyleProp<ViewStyle>;
  message?: StyleProp<TextStyle>;
  action?: StyleProp<TextStyle>;
}

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

const defaultStyles = {
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    elevation: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  } satisfies ViewStyle,
  message: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 21,
    paddingVertical: 12,
  } satisfies TextStyle,
  action: {
    color: "#7cc0ff",
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 12,
  } satisfies TextStyle,
};

const DEFAULT_DURATION_MS = 3500;
const DEFAULT_ACTION_DURATION_MS = 5000;

/** The delay asked for, lengthened by Android's accessibility "Time to take action". */
async function recommendedTimeout(ms: number): Promise<number> {
  if (typeof AccessibilityInfo.getRecommendedTimeoutMillis !== "function") {
    return ms;
  }
  try {
    return await AccessibilityInfo.getRecommendedTimeoutMillis(ms);
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
  const merged = mergeSlotStyles(defaultStyles, styles);
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

    const animate = (toValue: number, onEnd?: () => void) => {
      Animated.timing(opacity, {
        toValue,
        duration: fadeRef.current,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onEnd?.();
      });
    };

    const end = (reason: ToastHideReason) => {
      clearTimeout(timer);
      const ended = current;
      if (!ended) return;
      current = null;
      ended.onHide?.(reason);
      animate(0, () => {
        if (current === null) setToast(null);
      });
    };

    const unregister = registerToastHost({
      show(next) {
        clearTimeout(timer);
        current?.onHide?.("replaced");
        current = next;
        setToast(next);
        animate(1);
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

  const translateY = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      style={[
        merged.toast,
        { bottom: bottomOffset, opacity, transform: [{ translateY }] },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => endRef.current?.("dismissed")}
        accessibilityRole="button"
        accessibilityHint={dismissHint ?? dismissHints[resolvedLocale]}
      >
        <Text style={merged.message} numberOfLines={maxLines}>
          {toast.message}
        </Text>
      </Pressable>
      {toast.action && (
        <Pressable
          onPress={() => {
            toast.action?.onPress();
            endRef.current?.("action");
          }}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={merged.action}>{toast.action.label}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
