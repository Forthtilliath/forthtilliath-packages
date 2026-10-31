import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * `true` when the user asked for fewer animations (Android: Accessibility ▸
 * Remove animations), updated live if they change it. Native transitions
 * follow that setting on their own; `Animated` ones don't — skip or shorten
 * them when this is `true`.
 *
 * `false` until the setting is known (first render), and if it can't be read.
 *
 * @returns Whether animations should be reduced.
 * @example
 * const reducedMotion = useReducedMotion();
 * Animated.timing(opacity, { toValue: 1, duration: reducedMotion ? 0 : 250, useNativeDriver: true }).start();
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduced(value);
      })
      .catch(() => {
        // Unknown: keep the animations.
      });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
