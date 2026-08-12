/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { AboutSettingsScreen } from "./AboutSettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("AboutSettingsScreen", () => {
  it("shows the app name, version, description and developer credit", () => {
    const tree = renderTree(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="Un outil personnel de calcul de dose."
        developerName="Vincent LISITA"
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("GlucoDose");
    expect(texts).toContain("Version 1.2.0");
    expect(texts).toContain("Un outil personnel de calcul de dose.");
    expect(texts).toContain("Développée par Vincent LISITA.");
  });

  it("renders each entry of a description array as its own paragraph", () => {
    const tree = renderTree(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description={["Premier paragraphe.", "Second paragraphe."]}
        developerName="Vincent LISITA"
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Premier paragraphe.");
    expect(texts).toContain("Second paragraphe.");
  });

  it("accepts custom labels", () => {
    const tree = renderTree(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="..."
        developerName="Vincent LISITA"
        labels={{
          version: (v) => `v${v}`,
          developedBy: (name) => `By ${name}`,
        }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("v1.2.0");
    expect(texts).toContain("By Vincent LISITA");
  });
});
