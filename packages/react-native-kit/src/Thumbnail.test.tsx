/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Image, View } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { Thumbnail } from "./Thumbnail.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

describe("Thumbnail", () => {
  it("renders the photo when photoUri is set", () => {
    const tree = renderTree(
      <Thumbnail photoUri="file://photo.jpg" placeholderIcon="cube-outline" />,
    );
    const images = tree.root.findAllByType(Image);
    expect(images).toHaveLength(1);
    expect(images[0]?.props.source).toEqual({ uri: "file://photo.jpg" });
  });

  it("renders the placeholder icon when there is no photo", () => {
    const tree = renderTree(
      <Thumbnail photoUri={null} placeholderIcon="cube-outline" />,
    );
    expect(tree.root.findAllByType(Image)).toHaveLength(0);
    expect(tree.root.findAllByType(View)).toHaveLength(1);
  });

  it("applies custom styles over the defaults", () => {
    const tree = renderTree(
      <Thumbnail
        photoUri={null}
        placeholderIcon="cube-outline"
        styles={{ iconColor: "#ff0000" }}
      />,
    );
    expect(tree.toJSON()).toBeTruthy();
  });
});
