/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Text } from "react-native";
import type { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";
import { act, create } from "react-test-renderer";

import { propsOf } from "./testInstance.js";

/** Renders inside `act()`, so effects have run when the tree is returned. */
export function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReactTestRenderer;
  act(() => {
    tree = create(element);
  });
  return tree;
}

// Style props are merged as arrays (default, then override) — flatten them
// to a plain object for assertions, the way React Native resolves them.
export function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return (style as unknown[]).reduce<Record<string, unknown>>(
      (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
      {},
    );
  }
  if (typeof style !== "object" || style === null) return {};
  return style as Record<string, unknown>;
}

/** The flattened `style` prop of a test instance. */
export function styleOf(instance: ReactTestInstance): Record<string, unknown> {
  return flattenStyle(propsOf<{ style: unknown }>(instance).style);
}

/** The children of every `<Text>` in the tree. */
export function textValues(tree: ReactTestRenderer): unknown[] {
  return tree.root
    .findAllByType(Text)
    .map((t) => propsOf<{ children: unknown }>(t).children);
}

/** The `<Text>` whose children are exactly `value`. */
export function findText(
  tree: ReactTestRenderer,
  value: unknown,
): ReactTestInstance {
  const found = tree.root
    .findAllByType(Text)
    .find((t) => propsOf<{ children: unknown }>(t).children === value);
  if (!found) throw new Error(`no <Text> reading ${JSON.stringify(value)}`);
  return found;
}

/** The parent of a test instance — e.g. the Pressable around a `<Text>`. */
export function parentOf(instance: ReactTestInstance): ReactTestInstance {
  if (!instance.parent) throw new Error("expected a parent instance");
  return instance.parent;
}

/** Calls `onPress` of a test instance inside `act()`. */
export function press(instance: ReactTestInstance) {
  act(() => {
    propsOf<{ onPress: () => void }>(instance).onPress();
  });
}
