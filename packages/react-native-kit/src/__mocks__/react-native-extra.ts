import * as React from "react";

// More of react-native's API for the stub in react-native.tsx (re-exported
// from there), kept apart so that file stays readable.

type Style = Record<string, unknown>;

function flattenStyle(style: unknown): Style | undefined {
  if (Array.isArray(style)) {
    return style.reduce<Style>(
      (flat, part) => Object.assign(flat, flattenStyle(part)),
      {},
    );
  }
  return style && typeof style === "object" ? (style as Style) : undefined;
}

export const StyleSheet = {
  create: <T>(styles: T): T => styles,
  flatten: flattenStyle,
  hairlineWidth: 1,
  absoluteFill: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
};

interface AnimationConfig {
  toValue: number;
}

type EndCallback = (result: { finished: boolean }) => void;

/**
 * Animations finish at once: `start` sets the end value and calls back with
 * `finished: true`, so tests see the end state without fake timers.
 */
class AnimatedValue {
  constructor(public value: number) {}

  setValue(value: number) {
    this.value = value;
  }

  /** Linear, clamped: enough for opacity / translate interpolations. */
  interpolate({
    inputRange,
    outputRange,
  }: {
    inputRange: [number, number];
    outputRange: [number, number];
  }) {
    const [inMin, inMax] = inputRange;
    const [outMin, outMax] = outputRange;
    const ratio = Math.min(
      Math.max((this.value - inMin) / (inMax - inMin), 0),
      1,
    );
    return outMin + ratio * (outMax - outMin);
  }
}

function animation(value: AnimatedValue, config: AnimationConfig) {
  return {
    start(callback?: EndCallback) {
      value.setValue(config.toValue);
      callback?.({ finished: true });
    },
    stop() {
      // Nothing runs in the background to stop.
    },
  };
}

export const Animated = {
  Value: AnimatedValue,
  View: function AnimatedView(props: Record<string, unknown>) {
    return React.createElement("View", props);
  },
  timing: animation,
  spring: animation,
};

/** What `isReduceMotionEnabled` answers; tests set it before rendering. */
export const mockReduceMotion = { value: false };

type Listener = (value: boolean) => void;
const reduceMotionListeners = new Set<Listener>();

/** Simulates the user toggling Android's "Remove animations". */
export function emitReduceMotionChange(value: boolean) {
  mockReduceMotion.value = value;
  for (const listener of reduceMotionListeners) listener(value);
}

export const AccessibilityInfo = {
  isReduceMotionEnabled: () => Promise.resolve(mockReduceMotion.value),
  addEventListener(_event: string, listener: Listener) {
    reduceMotionListeners.add(listener);
    return {
      remove: () => {
        reduceMotionListeners.delete(listener);
      },
    };
  },
  // Like Android with no accessibility timeout set: the duration asked for.
  getRecommendedTimeoutMillis: (ms: number) => Promise.resolve(ms),
  // Tests spy on it, like on Alert.alert.
  announceForAccessibility: (): void => undefined,
};
