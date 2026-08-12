/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Linking, Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { ContactSettingsScreen } from "./ContactSettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("ContactSettingsScreen", () => {
  it("shows the email and the default hints", () => {
    const tree = renderTree(<ContactSettingsScreen email="dev@example.com" />);
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children)
      .flat();
    expect(texts).toContain("✉️ dev@example.com");
    expect(texts).toContain("Une question, un bug, une suggestion ?");
  });

  it("opens a mailto: link when the email button is pressed", () => {
    const openURLSpy = vi
      .spyOn(Linking, "openURL")
      .mockResolvedValue(undefined);
    const tree = renderTree(<ContactSettingsScreen email="dev@example.com" />);

    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });

    expect(openURLSpy).toHaveBeenCalledWith("mailto:dev@example.com");
    openURLSpy.mockRestore();
  });

  it("accepts custom labels", () => {
    const tree = renderTree(
      <ContactSettingsScreen
        email="dev@example.com"
        labels={{ hint: "Got a question?", footer: "Thanks!" }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Got a question?");
    expect(texts).toContain("Thanks!");
  });
});
