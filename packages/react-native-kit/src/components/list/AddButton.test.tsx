import { Pressable } from "react-native";
import { describe, expect, it, vi } from "vitest";

import {
  findText,
  press,
  renderTree,
  styleOf,
} from "../../__mocks__/renderTree.js";

import { AddButton } from "./AddButton.js";

describe("AddButton", () => {
  it("renders its label and reports taps", () => {
    const onPress = vi.fn();
    const tree = renderTree(<AddButton label="+ Ajouter" onPress={onPress} />);
    findText(tree, "+ Ajouter");
    press(tree.root.findByType(Pressable));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("keeps the dashed border when overriding the button", () => {
    const tree = renderTree(
      <AddButton
        label="+ Ajouter"
        onPress={vi.fn()}
        styles={{ button: { borderColor: "#444444", marginTop: 12 } }}
      />,
    );
    expect(styleOf(tree.root.findByType(Pressable))).toMatchObject({
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: "#444444",
      marginTop: 12,
    });
  });
});
