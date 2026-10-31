import type { ColorValue, StyleProp, TextStyle } from "react-native";
import { Text } from "react-native";
import fontUrl from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf?url";
import glyphMap from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json";

// Same font file and glyph codes as the real @expo/vector-icons, loaded with
// a plain @font-face instead of expo-font.
const fontFace = document.createElement("style");
fontFace.textContent = `@font-face { font-family: "Ionicons"; src: url(${fontUrl}) format("truetype"); }`;
document.head.append(fontFace);

const glyphs: Record<string, number> = glyphMap;

interface IconProps {
  name: string;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
}

export function Ionicons({ name, size = 12, color, style }: IconProps) {
  const code = glyphs[name];
  // react-native-web turns `dataSet` into a data-icon attribute, which
  // main.tsx's font rule targets.
  const dataSet = { dataSet: { icon: "ionicons" } } as object;
  return (
    <Text
      {...dataSet}
      style={[
        { fontFamily: "Ionicons", fontSize: size, lineHeight: size, color },
        style,
      ]}
    >
      {code === undefined ? "?" : String.fromCodePoint(code)}
    </Text>
  );
}

Ionicons.glyphMap = glyphs;
