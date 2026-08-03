/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { SwipeableRow } from "./SwipeableRow.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

// Style props are merged as arrays (default, then override) rather than the
// override replacing the default outright — flatten to a plain object for
// assertions, the same way React Native resolves a style array/prop.
function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return (style as unknown[]).reduce<Record<string, unknown>>(
      (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
      {},
    );
  }
  return (style as Record<string, unknown> | null | undefined) ?? {};
}

describe("SwipeableRow", () => {
  it("renders its children", () => {
    const tree = renderTree(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="Delete row">
        <Text>Row content</Text>
      </SwipeableRow>,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts.some((t) => t.props.children === "Row content")).toBe(true);
  });

  it("keeps the delete action's shape when only overriding its background color", () => {
    const tree = renderTree(
      <SwipeableRow
        onDelete={vi.fn()}
        deleteLabel="Delete row"
        styles={{ deleteAction: { backgroundColor: "#dc2626" } }}
      >
        <Text>Row content</Text>
      </SwipeableRow>,
    );
    const deleteAction = tree.root.findByType(Pressable);
    expect(flattenStyle(deleteAction.props.style)).toMatchObject({
      width: 84,
      borderRadius: 12,
      backgroundColor: "#dc2626",
    });
  });
});
