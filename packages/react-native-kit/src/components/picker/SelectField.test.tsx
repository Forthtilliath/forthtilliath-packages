import { Pressable } from "react-native";
import { describe, expect, it, vi } from "vitest";

import {
  findText,
  parentOf,
  press,
  renderTree,
  styleOf,
  textValues,
} from "../../__mocks__/renderTree.js";

import { OptionsModal } from "./OptionsModal.js";
import { SelectField } from "./SelectField.js";

const options = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
];

describe("OptionsModal", () => {
  it("selects the tapped option, then closes", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const tree = renderTree(
      <OptionsModal
        visible
        onClose={onClose}
        options={options}
        onSelect={onSelect}
      />,
    );
    press(parentOf(findText(tree, "Février")));
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on a backdrop tap", () => {
    const onClose = vi.fn();
    const tree = renderTree(
      <OptionsModal
        visible
        onClose={onClose}
        options={options}
        onSelect={vi.fn()}
      />,
    );
    const [backdrop] = tree.root.findAllByType(Pressable);
    if (!backdrop) throw new Error("expected the backdrop");
    press(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("SelectField", () => {
  it("shows the caption and current value, options hidden", () => {
    const tree = renderTree(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={vi.fn()}
      />,
    );
    expect(textValues(tree)).toEqual(["Mois", "Janvier", "▾"]);
  });

  it("opens the options and forwards the choice", () => {
    const onSelect = vi.fn();
    const tree = renderTree(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={onSelect}
      />,
    );
    press(parentOf(findText(tree, "Janvier")));
    press(parentOf(findText(tree, "Février")));
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(textValues(tree)).not.toContain("Février");
  });

  it("forwards nested OptionsModal styles and merges its own", () => {
    const tree = renderTree(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={vi.fn()}
        styles={{
          button: { borderColor: "#333333" },
          optionsModal: { optionText: { color: "#eeeeee" } },
        }}
      />,
    );
    expect(styleOf(parentOf(findText(tree, "Janvier")))).toMatchObject({
      borderRadius: 8,
      borderColor: "#333333",
    });
    press(parentOf(findText(tree, "Janvier")));
    expect(styleOf(findText(tree, "Février"))).toMatchObject({
      fontSize: 16,
      color: "#eeeeee",
    });
  });
});
