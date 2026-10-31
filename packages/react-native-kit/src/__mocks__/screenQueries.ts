import { screen } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";

/** Host elements of `type` on screen, the root included, in reading order. */
export function screenElements(type: string): TestInstance[] {
  const root = screen.root;
  if (!root) return [];
  const descendants = root.queryAll((node) => node.type === type);
  return root.type === type ? [root, ...descendants] : descendants;
}

/** A style prop as one object, arrays merged in order like React Native. */
export function flattenStyle(style: unknown): Record<string, unknown> {
  return [style]
    .flat(Infinity)
    .reduce<Record<string, unknown>>(
      (flat, part) => ({ ...flat, ...(part as object | null) }),
      {},
    );
}

/** Every text on screen, in reading order — for tests about ordering. */
export function screenTexts(): string[] {
  return screenElements("Text").map((text) =>
    text.children.filter((child) => typeof child === "string").join(""),
  );
}

/** Names of the icons on screen (see expo-vector-icons.tsx), in order. */
export function screenIcons(): unknown[] {
  return screenElements("Ionicons").map(
    (icon) => (icon.props as { name?: unknown }).name,
  );
}
