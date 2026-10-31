import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenTexts } from "../../__mocks__/screenQueries.js";

import { type PickerItem, PickerModal } from "./PickerModal.js";

function item(id: number, label: string, group?: string): PickerItem {
  return { id, label, group };
}

const search = () => screen.getByLabelText("Rechercher");

describe("PickerModal", () => {
  it("renders nothing when not visible", async () => {
    await render(
      <PickerModal
        visible={false}
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.toJSON()).toBeNull();
  });

  it("lists items flat, without a section header, when none have a group", async () => {
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Apple" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Pear" })).toBeOnTheScreen();
    expect(screenTexts()).not.toContain("");
  });

  it("groups items into sections by title, sorted alphabetically", async () => {
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple", "Fruit"), item(2, "Carrot", "Vegetable")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    const texts = screenTexts();
    expect(texts).toContain("Fruit");
    expect(texts.indexOf("Fruit")).toBeLessThan(texts.indexOf("Vegetable"));
  });

  it("respects an explicit groupOrder over alphabetical order", async () => {
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple", "Fruit"), item(2, "Carrot", "Vegetable")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        groupOrder={["Vegetable", "Fruit"]}
      />,
    );
    const texts = screenTexts();
    expect(texts.indexOf("Vegetable")).toBeLessThan(texts.indexOf("Fruit"));
  });

  it("filters by a case-insensitive substring match by default", async () => {
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    await fireEvent.changeText(search(), "app");
    expect(screen.getByText("Apple")).toBeOnTheScreen();
    expect(screen.queryByText("Pear")).not.toBeOnTheScreen();
  });

  it("uses a custom filterItems function when provided", async () => {
    const filterItems = vi.fn((items: PickerItem[]) => items.slice(0, 1));
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        filterItems={filterItems}
      />,
    );
    await fireEvent.changeText(search(), "anything");
    expect(filterItems).toHaveBeenCalledWith(
      [item(1, "Apple"), item(2, "Pear")],
      "anything",
    );
    expect(screen.getByText("Apple")).toBeOnTheScreen();
    expect(screen.queryByText("Pear")).not.toBeOnTheScreen();
  });

  it("calls onSelect with the tapped item and clears the search", async () => {
    const onSelect = vi.fn();
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={onSelect}
        onClose={vi.fn()}
      />,
    );
    await fireEvent.changeText(search(), "app");
    await fireEvent.press(screen.getByRole("button", { name: "Apple" }));

    expect(onSelect).toHaveBeenCalledWith(item(1, "Apple"));
    expect(search()).toHaveDisplayValue("");
  });

  it("shows extraActions above the results, even during a non-matching search", async () => {
    const onExtraPress = vi.fn();
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        extraActions={[{ label: "Add a new item", onPress: onExtraPress }]}
      />,
    );
    await fireEvent.changeText(search(), "nothing matches this");
    await fireEvent.press(
      screen.getByRole("button", { name: "Add a new item" }),
    );
    expect(onExtraPress).toHaveBeenCalledTimes(1);
  });

  it("shows the default empty message, overridable via emptyMessage", async () => {
    const { rerender } = await render(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Aucun résultat.")).toBeOnTheScreen();

    await rerender(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        emptyMessage="Nothing here."
      />,
    );
    expect(screen.getByText("Nothing here.")).toBeOnTheScreen();
  });

  it("calls onClose when the close button is pressed", async () => {
    const onClose = vi.fn();
    await render(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={onClose}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets to initialQuery each time it becomes visible", async () => {
    const { rerender } = await render(
      <PickerModal
        visible={false}
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        initialQuery="app"
      />,
    );
    await rerender(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        initialQuery="app"
      />,
    );
    expect(search()).toHaveDisplayValue("app");
  });
});
