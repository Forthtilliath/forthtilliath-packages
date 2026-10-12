import { describe, expect, it, vi } from "vitest";

import {
  findText,
  parentOf,
  press,
  renderTree,
  styleOf,
} from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { SegmentedToggle } from "./SegmentedToggle.js";

const options = [
  { value: "calendar", label: "Calendrier" },
  { value: "list", label: "Liste" },
] as const;

describe("SegmentedToggle", () => {
  it("marks only the active option as selected and styles it", () => {
    const tree = renderTree(
      <SegmentedToggle options={options} value="list" onChange={vi.fn()} />,
    );
    const list = parentOf(findText(tree, "Liste"));
    const calendar = parentOf(findText(tree, "Calendrier"));
    expect(
      propsOf<{ accessibilityState: { selected: boolean } }>(list)
        .accessibilityState.selected,
    ).toBe(true);
    expect(
      propsOf<{ accessibilityState: { selected: boolean } }>(calendar)
        .accessibilityState.selected,
    ).toBe(false);
    expect(styleOf(list)).toMatchObject({ backgroundColor: "#2563eb" });
    expect(styleOf(calendar).backgroundColor).toBeUndefined();
    expect(styleOf(findText(tree, "Liste"))).toMatchObject({
      color: "#ffffff",
    });
  });

  it("reports the tapped value", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <SegmentedToggle options={options} value="list" onChange={onChange} />,
    );
    press(parentOf(findText(tree, "Calendrier")));
    expect(onChange).toHaveBeenCalledWith("calendar");
  });

  it("announces options as radios, hint included", () => {
    const tree = renderTree(
      <SegmentedToggle
        label="Format"
        options={[
          { value: "duo", label: "Duos", hint: "2 × 2" },
          { value: "trio", label: "Trios" },
        ]}
        value="duo"
        onChange={vi.fn()}
      />,
    );
    const duo = propsOf<{
      accessibilityRole: string;
      accessibilityState: { checked: boolean };
      accessibilityLabel: string;
    }>(parentOf(findText(tree, "Duos")));
    expect(duo.accessibilityRole).toBe("radio");
    expect(duo.accessibilityState.checked).toBe(true);
    expect(duo.accessibilityLabel).toBe("Duos, 2 × 2");
    expect(
      propsOf<{ accessibilityLabel: string }>(parentOf(findText(tree, "Trios")))
        .accessibilityLabel,
    ).toBe("Trios");
    expect(styleOf(findText(tree, "2 × 2"))).toMatchObject({
      fontSize: 12,
      color: "#dbeafe",
    });
  });

  it("applies active overrides on top of the base slot", () => {
    const tree = renderTree(
      <SegmentedToggle
        options={options}
        value="list"
        onChange={vi.fn()}
        styles={{ buttonActive: { backgroundColor: "#0000ff" } }}
      />,
    );
    expect(styleOf(parentOf(findText(tree, "Liste")))).toMatchObject({
      flex: 1,
      borderRadius: 8,
      backgroundColor: "#0000ff",
    });
  });
});
