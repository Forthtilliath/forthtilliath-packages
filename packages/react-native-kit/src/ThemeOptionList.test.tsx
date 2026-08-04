/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "./__mocks__/testInstance.js";
import { ThemeOptionList } from "./ThemeOptionList.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("ThemeOptionList", () => {
  it("renders the three default French labels", () => {
    const tree = renderTree(
      <ThemeOptionList value="system" onChange={vi.fn()} />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: string }>(t).children);
    expect(texts).toEqual(["Clair", "Sombre", "Système"]);
  });

  it("marks the current value as checked", () => {
    const tree = renderTree(
      <ThemeOptionList value="dark" onChange={vi.fn()} />,
    );
    const checked = tree.root
      .findAllByType(Pressable)
      .map(
        (option) =>
          propsOf<{ accessibilityState: { checked: boolean } }>(option)
            .accessibilityState.checked,
      );
    expect(checked).toEqual([false, true, false]);
  });

  it("calls onChange with the pressed option", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <ThemeOptionList value="system" onChange={onChange} />,
    );
    const firstOption = tree.root.findAllByType(Pressable)[0];
    if (!firstOption) throw new Error("expected at least one option");

    act(() => {
      propsOf<{ onPress: () => void }>(firstOption).onPress();
    });

    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("accepts custom labels", () => {
    const tree = renderTree(
      <ThemeOptionList
        value="light"
        onChange={vi.fn()}
        labels={{ light: "Light", dark: "Dark", system: "System" }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: string }>(t).children);
    expect(texts).toEqual(["Light", "Dark", "System"]);
  });
});
