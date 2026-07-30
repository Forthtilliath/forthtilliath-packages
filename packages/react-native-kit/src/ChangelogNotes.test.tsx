/* eslint-disable @typescript-eslint/no-deprecated -- react-test-renderer is deprecated upstream with no drop-in replacement for RN component trees yet; matches the version glucodose itself uses. */
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { ChangelogNotes } from "./ChangelogNotes.js";

// react-test-renderer needs the initial render wrapped in act() to flush
// synchronously under React 19 — without it, create() returns a tree that
// looks unmounted to any assertion running right after.
function renderTree(element: ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("ChangelogNotes", () => {
  it("renders a heading as a distinct Text node", () => {
    const tree = renderTree(<ChangelogNotes notes="### Added" />);
    const texts = tree.root.findAllByType(Text);
    expect(texts.some((t) => t.props.children === "Added")).toBe(true);
  });

  it("renders a list item with a bullet and the item text", () => {
    const tree = renderTree(
      <ChangelogNotes notes="- Export history to CSV." />,
    );
    const rows = tree.root.findAllByType(View);
    expect(rows).toHaveLength(1);
    const texts = tree.root.findAllByType(Text);
    expect(texts.some((t) => t.props.children === "•")).toBe(true);
  });

  it("renders bold segments with a different style than the surrounding text", () => {
    const tree = renderTree(
      <ChangelogNotes notes="- **Broken widget**: fixed." />,
    );
    const texts = tree.root.findAllByType(Text);
    const bold = texts.find((t) => t.props.children === "Broken widget");
    const rest = texts.find((t) => t.props.children === ": fixed.");
    expect(bold?.props.style).not.toEqual(rest?.props.style);
  });

  it("applies custom styles over the defaults", () => {
    const customHeading = { color: "red" };
    const tree = renderTree(
      <ChangelogNotes notes="### Added" styles={{ heading: customHeading }} />,
    );
    const texts = tree.root.findAllByType(Text);
    const heading = texts.find((t) => t.props.children === "Added");
    expect(heading?.props.style).toEqual(customHeading);
  });

  it("renders nothing for empty notes", () => {
    const tree = renderTree(<ChangelogNotes notes="" />);
    expect(tree.root.findAllByType(Text)).toHaveLength(0);
  });
});
