import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ThumbnailStyles {
  thumbnail?: StyleProp<ImageStyle>;
  placeholder?: StyleProp<ViewStyle>;
  iconColor?: string;
}

export interface ThumbnailProps {
  photoUri: string | null;
  /** Icon shown in place of a photo, e.g. "cube-outline", "restaurant-outline". */
  placeholderIcon: keyof typeof Ionicons.glyphMap;
  size?: number;
  styles?: ThumbnailStyles;
}

const DEFAULT_SIZE = 48;

const defaultStyles: Required<ThumbnailStyles> = {
  thumbnail: { borderRadius: 10, backgroundColor: "#f3f4f6" },
  placeholder: {
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconColor: "#6b7280",
};

// List-row thumbnail (photo, or a placeholder icon when there is none).
export function Thumbnail({
  photoUri,
  placeholderIcon,
  size = DEFAULT_SIZE,
  styles,
}: ThumbnailProps) {
  const merged = { ...defaultStyles, ...styles };
  const dimensions = { width: size, height: size };

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={[dimensions, merged.thumbnail]}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[dimensions, merged.placeholder]}>
      <Ionicons
        name={placeholderIcon}
        size={Math.round(size * 0.46)}
        color={merged.iconColor}
      />
    </View>
  );
}
