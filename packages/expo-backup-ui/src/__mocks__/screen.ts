/* eslint-disable @typescript-eslint/no-deprecated -- see renderHook.ts */
import type { ReactElement } from "react";
import { Alert, Pressable, Text } from "react-native";
import { act, create, type ReactTestInstance } from "react-test-renderer";
import { vi } from "vitest";

import type { AlertButton } from "./react-native.js";
import { propsOf } from "./testInstance.js";

export function render(element: ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

export async function flush(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

export function findButton(
  tree: ReturnType<typeof create>,
  label: string,
): ReactTestInstance {
  return tree.root.find(
    (node) =>
      node.type === Pressable &&
      propsOf<{ accessibilityLabel?: string }>(node).accessibilityLabel ===
        label,
  );
}

export function hasButton(
  tree: ReturnType<typeof create>,
  label: string,
): boolean {
  try {
    findButton(tree, label);
    return true;
  } catch {
    return false;
  }
}

export async function press(tree: ReturnType<typeof create>, label: string) {
  const button = findButton(tree, label);
  await act(async () => {
    propsOf<{ onPress: () => void }>(button).onPress();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

export function allText(tree: ReturnType<typeof create>): string {
  return tree.root
    .findAllByType(Text)
    .map((node) => {
      const { children } = propsOf<{ children?: unknown }>(node);
      if (Array.isArray(children)) return children.join("");
      return typeof children === "string" || typeof children === "number"
        ? String(children)
        : "";
    })
    .join("\n");
}

type AlertCall = [title: string, message?: string, buttons?: AlertButton[]];

/** Spies on Alert.alert; `tap(text)` presses a button of the last alert. */
export function spyOnAlerts() {
  const spy = vi.spyOn(Alert, "alert");
  return {
    spy,
    last: () => spy.mock.calls.at(-1) as unknown as AlertCall | undefined,
    async tap(text: string) {
      const call = spy.mock.calls.at(-1) as unknown as AlertCall | undefined;
      const button = call?.[2]?.find((candidate) => candidate.text === text);
      if (!button?.onPress)
        throw new Error(`no "${text}" button in the last alert`);
      await act(async () => {
        button.onPress?.();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
  };
}
