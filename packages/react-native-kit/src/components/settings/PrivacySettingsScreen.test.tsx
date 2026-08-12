/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { PrivacySettingsScreen } from "./PrivacySettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("PrivacySettingsScreen", () => {
  it("renders the default 'everything stays local' sections with zero config", () => {
    const tree = renderTree(<PrivacySettingsScreen />);
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Aucune donnée envoyée nulle part");
    expect(texts).toContain("Stockage local uniquement");
    expect(texts).toContain("Partage volontaire uniquement");
  });

  it("fully replaces the default sections when custom ones are passed", () => {
    const tree = renderTree(
      <PrivacySettingsScreen
        sections={[
          { title: "Custom section", paragraphs: ["Custom paragraph."] },
        ]}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toEqual(["Custom section", "Custom paragraph."]);
    expect(texts).not.toContain("Aucune donnée envoyée nulle part");
  });
});
