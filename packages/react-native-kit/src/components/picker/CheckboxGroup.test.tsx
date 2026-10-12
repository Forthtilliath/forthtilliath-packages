import { Pressable } from "react-native";
import { describe, expect, it, vi } from "vitest";

import {
  findText,
  parentOf,
  press,
  renderTree,
  styleOf,
} from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { CheckboxGroup } from "./CheckboxGroup.js";

const options = [
  { value: "leaders", label: "Leaders" },
  { value: "cities", label: "Cités" },
  { value: "armada", label: "Armada" },
] as const;

describe("CheckboxGroup", () => {
  it("checks an option at the end of the list", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <CheckboxGroup
        options={options}
        values={["cities"]}
        onChange={onChange}
      />,
    );
    press(parentOf(findText(tree, "Leaders")));
    expect(onChange).toHaveBeenCalledWith(["cities", "leaders"]);
  });

  it("unchecks a checked option", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <CheckboxGroup
        options={options}
        values={["leaders", "cities"]}
        onChange={onChange}
      />,
    );
    press(parentOf(findText(tree, "Leaders")));
    expect(onChange).toHaveBeenCalledWith(["cities"]);
  });

  it("announces each chip as a checkbox with its state", () => {
    const tree = renderTree(
      <CheckboxGroup
        label="Extensions"
        options={options}
        values={["armada"]}
        onChange={vi.fn()}
      />,
    );
    const chips = tree.root.findAllByType(Pressable).map((p) =>
      propsOf<{
        accessibilityRole: string;
        accessibilityState: { checked: boolean };
        accessibilityLabel: string;
      }>(p),
    );
    expect(chips.map((c) => c.accessibilityRole)).toEqual([
      "checkbox",
      "checkbox",
      "checkbox",
    ]);
    expect(chips.map((c) => c.accessibilityState.checked)).toEqual([
      false,
      false,
      true,
    ]);
    expect(chips[2]?.accessibilityLabel).toBe("Armada");
  });

  it("styles checked chips, with overrides", () => {
    const tree = renderTree(
      <CheckboxGroup
        options={options}
        values={["cities"]}
        onChange={vi.fn()}
        styles={{
          chipChecked: { backgroundColor: "#c9a227" },
          textChecked: { color: "#000" },
        }}
      />,
    );
    expect(styleOf(parentOf(findText(tree, "Cités")))).toMatchObject({
      backgroundColor: "#c9a227",
      borderColor: "#2563eb",
    });
    expect(styleOf(findText(tree, "Cités"))).toMatchObject({ color: "#000" });
    expect(styleOf(findText(tree, "Leaders"))).toMatchObject({
      color: "#6b7280",
    });
  });
});
