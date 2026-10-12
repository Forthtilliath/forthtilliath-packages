/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable } from "react-native-gesture-handler";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { findText, renderTree, styleOf } from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { DragHandle } from "./DragHandle.js";

describe("DragHandle", () => {
  it("starts the drag on press-in, from gesture-handler's Pressable", () => {
    const onPressIn = vi.fn();
    const tree = renderTree(
      <DragHandle onPressIn={onPressIn} accessibilityLabel="Déplacer Marie" />,
    );
    const handle = tree.root.findByType(Pressable);
    act(() => {
      propsOf<{ onPressIn: () => void }>(handle).onPressIn();
    });
    expect(onPressIn).toHaveBeenCalledOnce();
    expect(
      propsOf<{ accessibilityLabel: string }>(handle).accessibilityLabel,
    ).toBe("Déplacer Marie");
  });

  it("forwards disabled and merges the glyph style", () => {
    const tree = renderTree(
      <DragHandle
        onPressIn={vi.fn()}
        disabled
        accessibilityLabel="x"
        styles={{ text: { color: "#eeeeee" } }}
      />,
    );
    expect(
      propsOf<{ disabled: boolean }>(tree.root.findByType(Pressable)).disabled,
    ).toBe(true);
    expect(styleOf(findText(tree, "⠿"))).toMatchObject({
      fontSize: 20,
      opacity: 0.5,
      color: "#eeeeee",
    });
  });
});
