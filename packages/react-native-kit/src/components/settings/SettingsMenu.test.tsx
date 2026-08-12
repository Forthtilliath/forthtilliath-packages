/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { SettingsMenu } from "./SettingsMenu.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("SettingsMenu", () => {
  it("renders one row per item, with its title and hint", () => {
    const tree = renderTree(
      <SettingsMenu
        items={[
          {
            key: "backup",
            emoji: "💾",
            title: "Sauvegarde",
            hint: "Exporter tes données",
            onPress: vi.fn(),
          },
          { key: "theme", emoji: "🎨", title: "Thème", onPress: vi.fn() },
        ]}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toEqual([
      "💾",
      "Sauvegarde",
      "Exporter tes données",
      "🎨",
      "Thème",
    ]);
  });

  it("calls the item's onPress when its row is pressed", () => {
    const onPress = vi.fn();
    const tree = renderTree(
      <SettingsMenu
        items={[{ key: "backup", emoji: "💾", title: "Sauvegarde", onPress }]}
      />,
    );

    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
