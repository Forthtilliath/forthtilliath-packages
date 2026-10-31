import { type RefObject, useEffect } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Animated, Pressable, Text } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import type { ToastHideReason, ToastRequest } from "./toast.js";

/** Per-slot style overrides for `ToastHost`, each merged after its default. */
export interface ToastHostStyles {
  /** The floating bar (absolute-positioned near the bottom). */
  toast?: StyleProp<ViewStyle>;
  message?: StyleProp<TextStyle>;
  action?: StyleProp<TextStyle>;
}

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

interface ToastBarProps {
  toast: ToastRequest;
  opacity: Animated.Value;
  /** Current fade duration (0 when animations are removed). */
  fadeRef: RefObject<number>;
  /** Ends the toast on screen (set by the host). */
  endRef: RefObject<((reason: ToastHideReason) => void) | null>;
  bottomOffset: number;
  maxLines: number;
  dismissHint: string;
  styles?: ToastHostStyles;
}

/** The bar `ToastHost` draws for the toast on screen. */
export function ToastBar({
  toast,
  opacity,
  fadeRef,
  endRef,
  bottomOffset,
  maxLines,
  dismissHint,
  styles,
}: ToastBarProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  // Faded in from here, mounted together with the Animated.View: an
  // animation started before the view attaches to the value is stopped when
  // it does (StrictMode detaches and reattaches a newly mounted view).
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeRef.current,
      useNativeDriver: true,
    }).start();
  }, [toast.id, opacity, fadeRef]);

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
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => endRef.current?.("dismissed")}
        accessibilityRole="button"
        accessibilityHint={dismissHint}
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
