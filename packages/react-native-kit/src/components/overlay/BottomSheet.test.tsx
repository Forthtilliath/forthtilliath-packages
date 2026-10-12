import { Pressable, ScrollView, Text, View } from "react-native";
import { describe, expect, it, vi } from "vitest";

import { press, renderTree, styleOf } from "../../__mocks__/renderTree.js";

import { BottomSheet } from "./BottomSheet.js";

describe("BottomSheet", () => {
  it("renders its children in a scroll view when visible", () => {
    const tree = renderTree(
      <BottomSheet visible onClose={vi.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    expect(
      tree.root.findByType(ScrollView).findByType(Text).props.children,
    ).toBe("Content");
  });

  it("renders nothing when hidden", () => {
    const tree = renderTree(
      <BottomSheet visible={false} onClose={vi.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    expect(tree.toJSON()).toBeNull();
  });

  it("closes on a backdrop tap", () => {
    const onClose = vi.fn();
    const tree = renderTree(
      <BottomSheet visible onClose={onClose}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    press(tree.root.findByType(Pressable));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("adds the bottom inset as a spacer under the content", () => {
    const tree = renderTree(
      <BottomSheet visible onClose={vi.fn()} bottomInset={34}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    const heights = tree.root.findAllByType(View).map((v) => styleOf(v).height);
    expect(heights).toContain(34);
  });

  it("keeps the sheet's shape when overriding its background", () => {
    const tree = renderTree(
      <BottomSheet
        visible
        onClose={vi.fn()}
        styles={{ sheet: { backgroundColor: "#222222" } }}
      >
        <Text>Content</Text>
      </BottomSheet>,
    );
    const sheet = tree.root
      .findAllByType(View)
      .find((v) => styleOf(v).maxHeight === "85%");
    expect(sheet && styleOf(sheet)).toMatchObject({
      borderTopLeftRadius: 16,
      paddingBottom: 24,
      backgroundColor: "#222222",
    });
  });
});
