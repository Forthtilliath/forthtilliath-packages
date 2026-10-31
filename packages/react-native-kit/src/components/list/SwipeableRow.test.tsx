import { Text } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import {
  lastSwipeableProps,
  swipeableMethods,
} from "../../__mocks__/react-native-gesture-handler-reanimated-swipeable.js";
import { flattenStyle, screenIcons } from "../../__mocks__/screenQueries.js";

import { SwipeableRow } from "./SwipeableRow.js";

const deleteButton = (name = "x") => screen.getByRole("button", { name });

describe("SwipeableRow", () => {
  it("renders its children", async () => {
    await render(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="Delete row">
        <Text>Row content</Text>
      </SwipeableRow>,
    );
    expect(screen.getByText("Row content")).toBeOnTheScreen();
  });

  it("keeps the delete action's shape when only overriding its background color", async () => {
    await render(
      <SwipeableRow
        onDelete={vi.fn()}
        deleteLabel="Delete row"
        styles={{ deleteAction: { backgroundColor: "#dc2626" } }}
      >
        <Text>Row content</Text>
      </SwipeableRow>,
    );
    expect(deleteButton("Delete row")).toHaveStyle({
      width: 84,
      borderRadius: 12,
      backgroundColor: "#dc2626",
    });
  });

  it('defaults the delete text to "Supprimer", "Delete" with locale="en"', async () => {
    const { rerender } = await render(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="x">
        <Text>Row</Text>
      </SwipeableRow>,
    );
    expect(screen.getByText("Supprimer")).toBeOnTheScreen();

    await rerender(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="x" locale="en">
        <Text>Row</Text>
      </SwipeableRow>,
    );
    expect(screen.getByText("Delete")).toBeOnTheScreen();
  });

  it("closes the row then calls onDelete when the delete button is pressed", async () => {
    const close = vi.spyOn(swipeableMethods, "close");
    const onDelete = vi.fn();
    await render(
      <SwipeableRow onDelete={onDelete} deleteLabel="Delete row">
        <Text>Row content</Text>
      </SwipeableRow>,
    );

    await fireEvent.press(deleteButton("Delete row"));

    expect(close).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("doesn't delete on open in the default (button) mode", async () => {
    await render(
      <SwipeableRow onDelete={vi.fn()} deleteLabel="x">
        <Text>Row</Text>
      </SwipeableRow>,
    );
    expect(lastSwipeableProps.current?.onSwipeableOpen).toBeUndefined();
    expect(lastSwipeableProps.current?.overshootRight).toBe(true);
  });

  describe("with fullSwipeToDelete", () => {
    it("deletes once the row is swiped open", async () => {
      const onDelete = vi.fn();
      await render(
        <SwipeableRow onDelete={onDelete} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      await act(() => {
        lastSwipeableProps.current?.onSwipeableOpen?.("right");
      });
      expect(onDelete).toHaveBeenCalledOnce();
      expect(lastSwipeableProps.current?.overshootRight).toBe(false);
    });

    it("renders a full-width band with the text only, no icon", async () => {
      await render(
        <SwipeableRow onDelete={vi.fn()} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      expect(deleteButton()).toHaveStyle({
        flex: 1,
        alignItems: "flex-end",
        paddingEnd: 16,
      });
      expect(deleteButton()).toHaveTextContent("Supprimer");
      expect(screenIcons()).toEqual([]);
    });

    it("slides the row out on a tap of the band, instead of deleting at once", async () => {
      const openRight = vi.spyOn(swipeableMethods, "openRight");
      const onDelete = vi.fn();
      await render(
        <SwipeableRow onDelete={onDelete} deleteLabel="x" fullSwipeToDelete>
          <Text>Row</Text>
        </SwipeableRow>,
      );
      await fireEvent.press(deleteButton());
      expect(openRight).toHaveBeenCalledOnce();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("passes the container slot to the swipeable", async () => {
      await render(
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
