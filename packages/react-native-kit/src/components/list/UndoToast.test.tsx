/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text, View } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { UndoToast } from "./UndoToast.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return (style as unknown[]).reduce<Record<string, unknown>>(
      (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
      {},
    );
  }
  return (style as Record<string, unknown> | null | undefined) ?? {};
}

function textValues(tree: ReturnType<typeof create>): unknown[] {
  return tree.root
    .findAllByType(Text)
    .map((t) => propsOf<{ children: unknown }>(t).children);
}

function findText(
  tree: ReturnType<typeof create>,
  value: string,
): ReactTestInstance {
  const found = tree.root
    .findAllByType(Text)
    .find((t) => propsOf<{ children: unknown }>(t).children === value);
  if (!found)
    throw new Error(`expected a <Text> reading ${JSON.stringify(value)}`);
  return found;
}

describe("UndoToast", () => {
  it("renders the message", () => {
    const tree = renderTree(
      <UndoToast message="« Marie » supprimée" onAction={vi.fn()} />,
    );
    expect(textValues(tree)).toContain("« Marie » supprimée");
  });

  it('defaults the action label to "Undo"', () => {
    const tree = renderTree(<UndoToast message="x" onAction={vi.fn()} />);
    expect(textValues(tree)).toContain("Undo");
  });

  it("uses a custom action label", () => {
    const tree = renderTree(
      <UndoToast message="x" actionLabel="Annuler" onAction={vi.fn()} />,
    );
    expect(textValues(tree)).toContain("Annuler");
    expect(textValues(tree)).not.toContain("Undo");
  });

  it("calls onAction when the button is pressed", () => {
    const onAction = vi.fn();
    const tree = renderTree(<UndoToast message="x" onAction={onAction} />);
    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("truncates the message to a single line", () => {
    const tree = renderTree(<UndoToast message="x" onAction={vi.fn()} />);
    const message = findText(tree, "x");
    expect(propsOf<{ numberOfLines: number }>(message).numberOfLines).toBe(1);
  });

  it("exposes the action as an accessible button", () => {
    const tree = renderTree(<UndoToast message="x" onAction={vi.fn()} />);
    expect(
      propsOf<{ accessibilityRole: string }>(tree.root.findByType(Pressable))
        .accessibilityRole,
    ).toBe("button");
  });

  it("keeps the default floating-bar layout", () => {
    const tree = renderTree(<UndoToast message="x" onAction={vi.fn()} />);
    expect(
      flattenStyle(
        propsOf<{ style: unknown }>(tree.root.findByType(View)).style,
      ),
    ).toMatchObject({
      position: "absolute",
      bottom: 24,
      flexDirection: "row",
    });
  });

  it("keeps the rest of a slot's default when overriding one property", () => {
    const tree = renderTree(
      <UndoToast
        message="x"
        onAction={vi.fn()}
        styles={{ toast: { backgroundColor: "#0a0a0a" } }}
      />,
    );
    expect(
      flattenStyle(
        propsOf<{ style: unknown }>(tree.root.findByType(View)).style,
      ),
    ).toMatchObject({
      position: "absolute",
      bottom: 24,
      backgroundColor: "#0a0a0a",
    });
  });

  it("applies message and action style overrides", () => {
    const tree = renderTree(
      <UndoToast
        message="hello"
        onAction={vi.fn()}
        styles={{
          message: { color: "#111111" },
          action: { color: "#2563eb" },
        }}
      />,
    );
    expect(
      flattenStyle(propsOf<{ style: unknown }>(findText(tree, "hello")).style),
    ).toMatchObject({ flex: 1, color: "#111111" });
    expect(
      flattenStyle(propsOf<{ style: unknown }>(findText(tree, "Undo")).style),
    ).toMatchObject({ fontWeight: "700", color: "#2563eb" });
  });
});
