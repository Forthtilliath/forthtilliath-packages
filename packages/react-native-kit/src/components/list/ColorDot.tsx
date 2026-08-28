import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

export interface ColorDotProps {
  /**
   * Dot color, as any React Native color string (`"#ef4444"`, `"tomato"`,
   * `"rgba(0,0,0,0.5)"`…). When `undefined`, the component renders `null` —
   * so an optional field can be passed straight through:
   * `<ColorDot color={category.color} />`.
   */
  color?: string;
  /**
   * Diameter in px. The dot is always a perfect circle
   * (`borderRadius = size / 2`).
   *
   * @defaultValue 10
   */
  size?: number;
  /**
   * Extra style merged after the computed `{ width, height, borderRadius,
   * backgroundColor }`. Use it for spacing (`marginRight`), a border, or to
   * override the shape.
   */
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_SIZE = 10;

/**
 * A small round color swatch — the coloured bullet next to a category, a
 * team, a tag, or a status.
 *
 * It renders **nothing** when `color` is `undefined`, which is the whole
 * point: list rows can bind an optional color field without wrapping the dot
 * in `{category.color && ...}` at every call site.
 *
 * @example Basic usage
 * ```tsx
 * import { ColorDot } from "@forthtilliath/react-native-kit/components/list/ColorDot";
 *
 * <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
 *   <ColorDot color="#ef4444" />
 *   <Text>Urgent</Text>
 * </View>;
 * ```
 *
 * @example Optional color (renders nothing when the category has none)
 * ```tsx
 * <ColorDot color={category.color} size={12} />
 * ```
 *
 * @example Custom size and a subtle ring
 * ```tsx
 * <ColorDot
 *   color={team.color}
 *   size={16}
 *   style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.15)" }}
 * />
 * ```
 */
export function ColorDot({ color, size = DEFAULT_SIZE, style }: ColorDotProps) {
  if (!color) return null;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}
