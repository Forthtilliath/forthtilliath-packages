/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { Ionicons } from "@expo/vector-icons";
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

  it("defaults to the well-known emoji for a recognized key when no emoji/icon is given", () => {
    const tree = renderTree(
      <SettingsMenu
        items={[{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }]}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("💾");
  });

  it("defaults to the well-known icon for a recognized key when defaultIconKind is 'icon'", () => {
    const tree = renderTree(
      <SettingsMenu
        items={[{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }]}
        defaultIconKind="icon"
      />,
    );
    const icons = tree.root
      .findAllByType(Ionicons)
      .map((el) => propsOf<{ name: unknown }>(el).name);
    expect(icons).toContain("save-outline");
  });

  it("doesn't default an icon for an unrecognized key", () => {
    const tree = renderTree(
      <SettingsMenu
        items={[{ key: "profile", title: "Mon nom", onPress: vi.fn() }]}
      />,
    );
    expect(tree.root.findAllByType(Ionicons)).toHaveLength(1); // just the chevron
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Mon nom");
  });

  it("an item's own emoji/icon overrides the default for its key", () => {
    const tree = renderTree(
      <SettingsMenu
        items={[
          { key: "backup", emoji: "📦", title: "Sauvegarde", onPress: vi.fn() },
        ]}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("📦");
    expect(texts).not.toContain("💾");
  });

  it("hides every hint when showHints is false", () => {
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
        ]}
        showHints={false}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).not.toContain("Exporter tes données");
  });

  it("renders items grouped under their section title when `groups` is given", () => {
    const tree = renderTree(
      <SettingsMenu
        groups={[
          {
            title: "Réglages de calcul",
            items: [{ key: "ratio", title: "Ratio", onPress: vi.fn() }],
          },
          {
            items: [{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }],
          },
        ]}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Réglages de calcul");
    expect(texts).toContain("Ratio");
    expect(texts).toContain("Sauvegarde");
  });
});
