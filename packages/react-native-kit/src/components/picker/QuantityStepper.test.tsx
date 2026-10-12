/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable, TextInput } from "react-native";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { press, renderTree, styleOf } from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { QuantityStepper } from "./QuantityStepper.js";

function buttons(tree: ReturnType<typeof renderTree>) {
  const [minus, plus] = tree.root.findAllByType(Pressable);
  if (!minus || !plus) throw new Error("expected the − and + buttons");
  return { minus, plus };
}

function type(tree: ReturnType<typeof renderTree>, text: string) {
  act(() => {
    propsOf<{ onChangeText: (t: string) => void }>(
      tree.root.findByType(TextInput),
    ).onChangeText(text);
  });
}

describe("QuantityStepper", () => {
  it("steps down and up", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper value={3} onChange={onChange} label="Pain" />,
    );
    press(buttons(tree).minus);
    press(buttons(tree).plus);
    expect(onChange.mock.calls).toEqual([[2], [4]]);
  });

  it("disables and dims − at zero", () => {
    const tree = renderTree(
      <QuantityStepper value={0} onChange={vi.fn()} label="Pain" />,
    );
    const { minus } = buttons(tree);
    expect(propsOf<{ disabled: boolean }>(minus).disabled).toBe(true);
    expect(styleOf(minus)).toMatchObject({ opacity: 0.35, width: 40 });
  });

  it("keeps digits only and clamps typed values to max", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper value={0} onChange={onChange} label="Pain" max={50} />,
    );
    type(tree, "1a2");
    type(tree, "75");
    type(tree, "");
    expect(onChange.mock.calls).toEqual([[12], [50], [0]]);
    expect(
      propsOf<{ maxLength: number }>(tree.root.findByType(TextInput)).maxLength,
    ).toBe(2);
  });

  it("clamps to a custom min and disables + at max", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={1}
        onChange={onChange}
        label="Bans"
        min={1}
        max={5}
      />,
    );
    expect(propsOf<{ disabled: boolean }>(buttons(tree).minus).disabled).toBe(
      true,
    );
    type(tree, "");
    expect(onChange).toHaveBeenLastCalledWith(1);

    const full = renderTree(
      <QuantityStepper value={5} onChange={vi.fn()} label="Bans" max={5} />,
    );
    const { plus } = buttons(full);
    expect(propsOf<{ disabled: boolean }>(plus).disabled).toBe(true);
    expect(styleOf(plus)).toMatchObject({ opacity: 0.35 });
  });

  it("jumps by longPressStep on long press, clamped", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={onChange}
        label="Bans"
        max={6}
        longPressStep={5}
      />,
    );
    const longPress = (button: ReturnType<typeof buttons>["plus"]) => {
      act(() => {
        propsOf<{ onLongPress: () => void }>(button).onLongPress();
      });
    };
    longPress(buttons(tree).plus);
    longPress(buttons(tree).minus);
    expect(onChange.mock.calls).toEqual([[6], [0]]);
  });

  it("ignores long presses without longPressStep", () => {
    const tree = renderTree(
      <QuantityStepper value={3} onChange={vi.fn()} label="Pain" />,
    );
    expect(
      propsOf<{ onLongPress?: unknown }>(buttons(tree).plus).onLongPress,
    ).toBeUndefined();
  });

  it("labels the controls in French by default, English with locale", () => {
    const fr = renderTree(
      <QuantityStepper value={1} onChange={vi.fn()} label="Pain" />,
    );
    expect(
      propsOf<{ accessibilityLabel: string }>(buttons(fr).plus)
        .accessibilityLabel,
    ).toBe("Ajouter : Pain");

    const en = renderTree(
      <QuantityStepper
        value={1}
        onChange={vi.fn()}
        label="Bread"
        locale="en"
      />,
    );
    expect(
      propsOf<{ accessibilityLabel: string }>(buttons(en).minus)
        .accessibilityLabel,
    ).toBe("Decrease: Bread");
  });

  it("accepts custom screen-reader labels", () => {
    const tree = renderTree(
      <QuantityStepper
        value={1}
        onChange={vi.fn()}
        label="Pain"
        a11yLabels={{ increase: (l) => `Un ${l} de plus` }}
      />,
    );
    expect(
      propsOf<{ accessibilityLabel: string }>(buttons(tree).plus)
        .accessibilityLabel,
    ).toBe("Un Pain de plus");
    expect(
      propsOf<{ accessibilityLabel: string }>(buttons(tree).minus)
        .accessibilityLabel,
    ).toBe("Retirer : Pain");
  });
});
