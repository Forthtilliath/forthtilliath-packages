/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import {
  lastSwipeableProps,
  swipeableMethods,
} from "../../__mocks__/react-native-gesture-handler-reanimated-swipeable.js";

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

  it('defaults the delete text to "Supprimer", "Delete" with locale="en"', () => {
    const texts = (element: Parameters<typeof create>[0]) =>
      renderTree(element)
        .root.findAllByType(Text)
        .map((t) => t.props.children as unknown);

    expect(
      texts(
        <SwipeableRow onDelete={vi.fn()} deleteLabel="x">
          <Text>Row</Text>
        </SwipeableRow>,
      ),
    ).toContain("Supprimer");
    expect(
      texts(
        <SwipeableRow onDelete={vi.fn()} deleteLabel="x" locale="en">
          <Text>Row</Text>
        </SwipeableRow>,
      ),
    ).toContain("Delete");
  });

  it("closes the row then calls onDelete when the delete button is pressed", () => {
    const close = vi.spyOn(swipeableMethods, "close");
    const onDelete = vi.fn();
    const tree = renderTree(
      <SwipeableRow onDelete={onDelete} deleteLabel="Delete row">
        <Text>Row content</Text>
      </SwipeableRow>,
    );

    act(() => {
      (tree.root.findByType(Pressable).props.onPress as () => void)();
    });

    expect(close).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("doesn't delete on open in the default (button) mode", () => {
    renderTree(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="x">
        <Text>Row</Text>
      </SwipeableRow>,
    );
    expect(lastSwipeableProps.current?.onSwipeableOpen).toBeUndefined();
    expect(lastSwipeableProps.current?.overshootRight).toBe(true);
  });

  describe("with fullSwipeToDelete", () => {
    it("deletes once the row is swiped open", () => {
      const onDelete = vi.fn();
      renderTree(
        <SwipeableRow onDelete={onDelete} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      act(() => {
        lastSwipeableProps.current?.onSwipeableOpen?.("right");
      });
      expect(onDelete).toHaveBeenCalledOnce();
      expect(lastSwipeableProps.current?.overshootRight).toBe(false);
    });

    it("renders a full-width band with the text only, no icon", () => {
      const tree = renderTree(
        <SwipeableRow onDelete={vi.fn()} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      const action = tree.root.findByType(Pressable);
      expect(flattenStyle(action.props.style)).toMatchObject({
        flex: 1,
        alignItems: "flex-end",
        paddingEnd: 16,
      });
      expect(action.findAllByType(Text)).toHaveLength(1);
    });

    it("slides the row out on a tap of the band, instead of deleting at once", () => {
      const openRight = vi.spyOn(swipeableMethods, "openRight");
      const onDelete = vi.fn();
      const tree = renderTree(
        <SwipeableRow onDelete={onDelete} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      act(() => {
        (tree.root.findByType(Pressable).props.onPress as () => void)();
      });
      expect(openRight).toHaveBeenCalledOnce();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("passes the container slot to the swipeable", () => {
      renderTree(
        <SwipeableRow
          onDelete={vi.fn()}
          deleteLabel="x"
          fullSwipeToDelete
          styles={{ container: { borderRadius: 8 } }}
        >
          <Text>Row</Text>
        </SwipeableRow>,
      );
      expect(
        flattenStyle(lastSwipeableProps.current?.containerStyle),
      ).toMatchObject({ borderRadius: 8 });
    });
  });
});
