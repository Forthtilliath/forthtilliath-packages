/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { ThemeSettingsScreen } from "./ThemeSettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("ThemeSettingsScreen", () => {
  it("renders the three default French labels with their emoji", () => {
    const tree = renderTree(
      <ThemeSettingsScreen value="system" onChange={vi.fn()} />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: string }>(t).children);
    expect(texts).toEqual(
      expect.arrayContaining(["☀️", "Clair", "🌙", "Sombre", "⚙️", "Système"]),
    );
  });

  it("marks the current value as selected and shows a checkmark for it", () => {
    const tree = renderTree(
      <ThemeSettingsScreen value="dark" onChange={vi.fn()} />,
    );
    const selected = tree.root
      .findAllByType(Pressable)
      .map(
        (option) =>
          propsOf<{ accessibilityState: { checked: boolean } }>(option)
            .accessibilityState.checked,
      );
    expect(selected).toEqual([false, true, false]);

    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: string }>(t).children);
    expect(texts).toContain("✓");
  });

  it("calls onChange with the pressed option", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <ThemeSettingsScreen value="system" onChange={onChange} />,
    );
    const firstOption = tree.root.findAllByType(Pressable)[0];
    if (!firstOption) throw new Error("expected at least one option");

    act(() => {
      propsOf<{ onPress: () => void }>(firstOption).onPress();
    });

    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("accepts custom emojis and labels", () => {
    const tree = renderTree(
      <ThemeSettingsScreen
        value="light"
        onChange={vi.fn()}
        emojis={{ light: "🌞" }}
        labels={{ light: "Day" }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: string }>(t).children);
    expect(texts).toEqual(expect.arrayContaining(["🌞", "Day"]));
  });
});
