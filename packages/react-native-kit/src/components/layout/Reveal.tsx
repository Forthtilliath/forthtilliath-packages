import { type ReactNode, useEffect, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Animated } from "react-native";

import { useReducedMotion } from "../../hooks/useReducedMotion.js";

export interface RevealProps {
  children: ReactNode;
  /** Position in a list: each item appears `staggerMs` after the previous one. @defaultValue 0 */
  index?: number;
  /** Delay between two consecutive items. @defaultValue 90 */
  staggerMs?: number;
  /** Fade and slide duration (ignored with `emphasis`). @defaultValue 260 */
  durationMs?: number;
  /** Distance slid up, in dp. @defaultValue 16 */
  distance?: number;
  /** A livelier arrival with a slight bounce and zoom — for a winner, a highlight. */
  emphasis?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Fades its content in while sliding it up, delayed by `index` — to reveal a
 * ranking or a list one item after the other. Runs once, on the native
 * thread, and not at all when the user asked Android to remove animations
 * (the content is then shown right away).
 *
 * @example
 * ```tsx
 * import { Reveal } from "@forthtilliath/react-native-kit/components/layout/Reveal";
 *
 * {ranking.map((entry, index) => (
 *   <Reveal key={entry.id} index={index} emphasis={index === 0}>
 *     <RankingRow entry={entry} />
 *   </Reveal>
 * ))}
 * ```
 */
export function Reveal({
  children,
  index = 0,
  staggerMs = 90,
  durationMs = 260,
  distance = 16,
  emphasis = false,
  style,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    const delay = Math.max(0, index) * staggerMs;
    const animation = emphasis
      ? Animated.spring(progress, {
          toValue: 1,
          delay,
          friction: 5,
          useNativeDriver: true,
        })
      : Animated.timing(progress, {
          toValue: 1,
          delay,
          duration: durationMs,
          useNativeDriver: true,
        });
    animation.start();
    return () => {
      animation.stop();
    };
  }, [progress, index, staggerMs, durationMs, emphasis, reducedMotion]);

  const animatedStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
      ...(emphasis
        ? [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ]
        : []),
    ],
  };

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}
