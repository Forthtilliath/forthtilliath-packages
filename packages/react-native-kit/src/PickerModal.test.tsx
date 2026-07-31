/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text, TextInput, View } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "./__mocks__/testInstance.js";
import { type PickerItem, PickerModal } from "./PickerModal.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

function item(id: number, label: string, group?: string): PickerItem {
  return { id, label, group };
}

// react-test-renderer types a TestInstance's `.props` as `any` — boundary
// cast once here instead of at every `.map()` call site below.
function textOf(instance: { props: { children?: unknown } }): string {
  return instance.props.children as string;
}

function typeIn(tree: ReturnType<typeof create>, text: string) {
  propsOf<{ onChangeText: (value: string) => void }>(
    tree.root.findByType(TextInput),
  ).onChangeText(text);
}

describe("PickerModal", () => {
  it("renders nothing when not visible", () => {
    const tree = renderTree(
      <PickerModal
        visible={false}
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(tree.toJSON()).toBeNull();
  });

  it("lists items flat, without a section header, when none have a group", () => {
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    const texts = tree.root.findAllByType(Text).map(textOf);
    expect(texts).toContain("Apple");
    expect(texts).toContain("Pear");
  });

  it("groups items into sections by title, sorted alphabetically", () => {
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple", "Fruit"), item(2, "Carrot", "Vegetable")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    const texts = tree.root.findAllByType(Text).map(textOf);
    const fruitIndex = texts.indexOf("Fruit");
    const vegetableIndex = texts.indexOf("Vegetable");
    expect(fruitIndex).toBeGreaterThanOrEqual(0);
    expect(fruitIndex).toBeLessThan(vegetableIndex);
  });

  it("respects an explicit groupOrder over alphabetical order", () => {
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple", "Fruit"), item(2, "Carrot", "Vegetable")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        groupOrder={["Vegetable", "Fruit"]}
      />,
    );
    const texts = tree.root.findAllByType(Text).map(textOf);
    expect(texts.indexOf("Vegetable")).toBeLessThan(texts.indexOf("Fruit"));
  });

  it("filters by a case-insensitive substring match by default", () => {
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    act(() => {
      typeIn(tree, "app");
    });
    const texts = tree.root.findAllByType(Text).map(textOf);
    expect(texts).toContain("Apple");
    expect(texts).not.toContain("Pear");
  });

  it("uses a custom filterItems function when provided", () => {
    const filterItems = vi.fn((items: PickerItem[]) => items.slice(0, 1));
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple"), item(2, "Pear")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        filterItems={filterItems}
      />,
    );
    act(() => {
      typeIn(tree, "anything");
    });
    expect(filterItems).toHaveBeenCalledWith(
      [item(1, "Apple"), item(2, "Pear")],
      "anything",
    );
    const texts = tree.root.findAllByType(Text).map(textOf);
    expect(texts).toContain("Apple");
    expect(texts).not.toContain("Pear");
  });

  it("calls onSelect with the tapped item and clears the search", () => {
    const onSelect = vi.fn();
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={onSelect}
        onClose={vi.fn()}
      />,
    );
    act(() => {
      typeIn(tree, "app");
    });

    const rows = tree.root.findAllByType(Pressable);
    const appleRow = rows.find((r) => r.props.accessibilityLabel === "Apple");
    act(() => {
      if (appleRow) propsOf<{ onPress: () => void }>(appleRow).onPress();
    });

    expect(onSelect).toHaveBeenCalledWith(item(1, "Apple"));
    expect(
      propsOf<{ value: string }>(tree.root.findByType(TextInput)).value,
    ).toBe("");
  });

  it("shows extraActions above the results, even during a non-matching search", () => {
    const onExtraPress = vi.fn();
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        extraActions={[{ label: "Add a new item", onPress: onExtraPress }]}
      />,
    );
    act(() => {
      typeIn(tree, "nothing matches this");
    });

    const rows = tree.root.findAllByType(Pressable);
    const extraRow = rows.find(
      (r) => r.props.accessibilityLabel === "Add a new item",
    );
    expect(extraRow).toBeDefined();
    act(() => {
      if (extraRow) propsOf<{ onPress: () => void }>(extraRow).onPress();
    });
    expect(onExtraPress).toHaveBeenCalledTimes(1);
  });

  it("shows the default empty message, overridable via emptyMessage", () => {
    const withDefault = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(withDefault.root.findAllByType(Text).map(textOf)).toContain(
      "Aucun résultat.",
    );

    const withCustom = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        emptyMessage="Nothing here."
      />,
    );
    expect(withCustom.root.findAllByType(Text).map(textOf)).toContain(
      "Nothing here.",
    );
  });

  it("calls onClose when the close button is pressed", () => {
    const onClose = vi.fn();
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={onClose}
      />,
    );
    const closeButton = tree.root
      .findAllByType(Pressable)
      .find((p) => p.props.accessibilityLabel === "Fermer");
    act(() => {
      if (closeButton) propsOf<{ onPress: () => void }>(closeButton).onPress();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets to initialQuery each time it becomes visible", () => {
    const tree = renderTree(
      <PickerModal
        visible={false}
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        initialQuery="app"
      />,
    );
    act(() => {
      tree.update(
        <PickerModal
          visible
          title="Pick"
          items={[item(1, "Apple")]}
          onSelect={vi.fn()}
          onClose={vi.fn()}
          initialQuery="app"
        />,
      );
    });
    expect(
      propsOf<{ value: string }>(tree.root.findByType(TextInput)).value,
    ).toBe("app");
  });
});

describe("PickerModal without groups", () => {
  it("never renders a View-only section header when no item has a group", () => {
    const tree = renderTree(
      <PickerModal
        visible
        title="Pick"
        items={[item(1, "Apple")]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(tree.root.findAllByType(View).length).toBeGreaterThan(0);
  });
});
