/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Text } from "react-native";
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
});
