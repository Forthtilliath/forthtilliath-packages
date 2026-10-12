/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable, Switch } from "react-native";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import {
  press,
  renderTree,
  styleOf,
  textValues,
} from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { SwitchRow } from "./SwitchRow.js";

describe("SwitchRow", () => {
  it("toggles from a tap on the row", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <SwitchRow label="Sons" value={false} onChange={onChange} />,
    );
    press(tree.root.findByType(Pressable));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("forwards the switch's own changes", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <SwitchRow label="Sons" value onChange={onChange} />,
    );
    act(() => {
      propsOf<{ onValueChange: (v: boolean) => void }>(
        tree.root.findByType(Switch),
      ).onValueChange(false);
    });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("announces one switch with its state and description", () => {
    const tree = renderTree(
      <SwitchRow
        label="Sons"
        description="Bruitage au tirage"
        value
        onChange={vi.fn()}
        disabled
      />,
    );
    const row = propsOf<{
      accessibilityRole: string;
      accessibilityState: { checked: boolean; disabled: boolean };
      accessibilityHint: string;
      disabled: boolean;
    }>(tree.root.findByType(Pressable));
    expect(row.accessibilityRole).toBe("switch");
    expect(row.accessibilityState).toEqual({ checked: true, disabled: true });
    expect(row.accessibilityHint).toBe("Bruitage au tirage");
    expect(row.disabled).toBe(true);
    expect(textValues(tree)).toEqual(["Sons", "Bruitage au tirage"]);
    expect(
      propsOf<{ importantForAccessibility: string }>(
        tree.root.findByType(Switch),
      ).importantForAccessibility,
    ).toBe("no-hide-descendants");
  });

  it("omits the description line when there is none", () => {
    const tree = renderTree(
      <SwitchRow label="Sons" value={false} onChange={vi.fn()} />,
    );
    expect(textValues(tree)).toEqual(["Sons"]);
  });

  it("applies switch colors by state and style overrides", () => {
    const colors = {
      trackOff: "#333",
      trackOn: "#0af",
      thumbOff: "#999",
      thumbOn: "#fff",
    };
    const on = renderTree(
      <SwitchRow
        label="Sons"
        value
        onChange={vi.fn()}
        colors={colors}
        styles={{ row: { borderWidth: 1 } }}
      />,
    );
    const sw = propsOf<{
      trackColor: { false: string; true: string };
      thumbColor: string;
    }>(on.root.findByType(Switch));
    expect(sw.trackColor).toEqual({ false: "#333", true: "#0af" });
    expect(sw.thumbColor).toBe("#fff");
    expect(styleOf(on.root.findByType(Pressable))).toMatchObject({
      flexDirection: "row",
      borderWidth: 1,
    });

    const off = renderTree(
      <SwitchRow
        label="Sons"
        value={false}
        onChange={vi.fn()}
        colors={colors}
      />,
    );
    expect(
      propsOf<{ thumbColor: string }>(off.root.findByType(Switch)).thumbColor,
    ).toBe("#999");
  });
});
