/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { act } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

function blur(tree: ReturnType<typeof renderTree>) {
  act(() => {
    propsOf<{ onBlur: () => void }>(tree.root.findByType(TextInput)).onBlur();
  });
}

function fieldText(tree: ReturnType<typeof renderTree>) {
  return propsOf<{ value: string }>(tree.root.findByType(TextInput)).value;
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
    expect(onChange.mock.calls).toEqual([[12], [50]]);
    expect(fieldText(tree)).toBe("");
    blur(tree);
    expect(onChange).toHaveBeenLastCalledWith(0);
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
    blur(tree);
    expect(onChange).toHaveBeenLastCalledWith(1);

    const full = renderTree(
      <QuantityStepper value={5} onChange={vi.fn()} label="Bans" max={5} />,
    );
    const { plus } = buttons(full);
    expect(propsOf<{ disabled: boolean }>(plus).disabled).toBe(true);
    expect(styleOf(plus)).toMatchObject({ opacity: 0.35 });
  });

  it("lets a number starting below min be typed, clamped on blur", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={10}
        onChange={onChange}
        label="Points"
        min={10}
        max={99}
      />,
    );
    type(tree, "2");
    expect(onChange).not.toHaveBeenCalled();
    expect(fieldText(tree)).toBe("2");
    type(tree, "25");
    expect(onChange).toHaveBeenLastCalledWith(25);

    type(tree, "3");
    blur(tree);
    expect(onChange).toHaveBeenLastCalledWith(10);
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

  it("allows negatives below a negative min, sign included", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Pénalités"
        min={-50}
      />,
    );
    const field = tree.root.findByType(TextInput);
    expect(propsOf<{ keyboardType: string }>(field).keyboardType).toBe(
      "numeric",
    );
    expect(propsOf<{ maxLength: number }>(field).maxLength).toBe(3);
    press(buttons(tree).minus);
    expect(onChange).toHaveBeenLastCalledWith(-1);

    type(tree, "-");
    expect(fieldText(tree)).toBe("-");
    type(tree, "-1a3");
    expect(onChange).toHaveBeenLastCalledWith(-13);
    type(tree, "-");
    blur(tree);
    expect(onChange).toHaveBeenLastCalledWith(0);
    type(tree, "-80");
    blur(tree);
    expect(onChange).toHaveBeenLastCalledWith(-50);
  });

  it("drops the sign when negatives are not allowed", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper value={0} onChange={onChange} label="Pain" />,
    );
    type(tree, "-7");
    expect(onChange).toHaveBeenLastCalledWith(7);
  });

  describe("repeatOnHold", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function Controlled(props: { initial: number; min?: number }) {
      const [value, setValue] = useState(props.initial);
      return (
        <QuantityStepper
          value={value}
          onChange={setValue}
          label="Points"
          min={props.min}
          repeatOnHold
        />
      );
    }

    function hold(button: ReturnType<typeof buttons>["plus"], ms: number) {
      act(() => {
        propsOf<{ onPressIn: () => void }>(button).onPressIn();
      });
      act(() => {
        vi.advanceTimersByTime(ms);
      });
      act(() => {
        propsOf<{ onPressOut: () => void }>(button).onPressOut();
      });
    }

    it("repeats while held and stops on release", () => {
      const tree = renderTree(<Controlled initial={0} />);
      expect(propsOf<{ onPress?: unknown }>(buttons(tree).plus).onPress).toBe(
        undefined,
      );
      hold(buttons(tree).plus, 450 + 180 * 3);
      expect(fieldText(tree)).toBe("4");
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(fieldText(tree)).toBe("4");
    });

    it("stops at the bound", () => {
      const tree = renderTree(<Controlled initial={-2} min={-3} />);
      act(() => {
        propsOf<{ onPressIn: () => void }>(buttons(tree).minus).onPressIn();
      });
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(fieldText(tree)).toBe("-3");
      expect(vi.getTimerCount()).toBe(0);
    });
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
