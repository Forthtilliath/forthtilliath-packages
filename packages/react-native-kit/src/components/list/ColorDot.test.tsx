/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { View } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { ColorDot } from "./ColorDot.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

// Style props are passed as arrays (computed base, then `style` override);
// flatten to a plain object the way React Native resolves a style array.
function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return (style as unknown[]).reduce<Record<string, unknown>>(
      (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
      {},
    );
  }
  return (style as Record<string, unknown> | null | undefined) ?? {};
}

describe("ColorDot", () => {
  it("renders nothing when no color is given", () => {
    const tree = renderTree(<ColorDot />);
    expect(tree.toJSON()).toBeNull();
  });

  it("renders nothing for an empty-string color", () => {
    const tree = renderTree(<ColorDot color="" />);
    expect(tree.toJSON()).toBeNull();
  });

  it("renders a single View with the given background color", () => {
    const tree = renderTree(<ColorDot color="#ef4444" />);
    const views = tree.root.findAllByType(View);
    expect(views).toHaveLength(1);
    expect(flattenStyle(views[0]?.props.style)).toMatchObject({
      backgroundColor: "#ef4444",
    });
  });

  it("defaults to a 10px circle", () => {
    const tree = renderTree(<ColorDot color="#000000" />);
    expect(flattenStyle(tree.root.findByType(View).props.style)).toMatchObject({
      width: 10,
      height: 10,
      borderRadius: 5,
    });
  });

  it("stays a circle at a custom size", () => {
    const tree = renderTree(<ColorDot color="#000000" size={24} />);
    expect(flattenStyle(tree.root.findByType(View).props.style)).toMatchObject({
      width: 24,
      height: 24,
      borderRadius: 12,
    });
  });

  it("merges the custom style after the computed one", () => {
    const tree = renderTree(
      <ColorDot
        color="#000000"
        size={12}
        style={{ marginRight: 8, borderWidth: 1 }}
      />,
    );
    expect(flattenStyle(tree.root.findByType(View).props.style)).toMatchObject({
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#000000",
      marginRight: 8,
      borderWidth: 1,
    });
  });

  it("lets the custom style win on conflicting keys", () => {
    const tree = renderTree(
      <ColorDot color="#000000" size={12} style={{ borderRadius: 2 }} />,
    );
    expect(flattenStyle(tree.root.findByType(View).props.style)).toMatchObject({
      borderRadius: 2,
    });
  });
});
