import { screen } from "@testing-library/react-native";

/** Every text on screen, in reading order — for tests about ordering. */
export function screenTexts(): string[] {
  const texts = screen.root?.queryAll((node) => node.type === "Text") ?? [];
  return texts.map((text) =>
    text.children.filter((child) => typeof child === "string").join(""),
  );
}

/** Names of the icons on screen (see expo-vector-icons.tsx), in order. */
export function screenIcons(): unknown[] {
  const icons = screen.root?.queryAll((node) => node.type === "Ionicons") ?? [];
  return icons.map((icon) => (icon.props as { name?: unknown }).name);
}
