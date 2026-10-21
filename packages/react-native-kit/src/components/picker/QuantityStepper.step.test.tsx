/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import { press, renderTree } from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { QuantityStepper } from "./QuantityStepper.js";

function buttons(tree: ReturnType<typeof renderTree>) {
  const [minus, plus] = tree.root.findAllByType(Pressable);
  if (!minus || !plus) throw new Error("expected the − and + buttons");
  return { minus, plus };
}

function field(tree: ReturnType<typeof renderTree>) {
  return propsOf<{
    value: string;
    maxLength: number;
    onChangeText: (t: string) => void;
  }>(tree.root.findByType(TextInput));
}

describe("QuantityStepper: step", () => {
  it("moves by step on −/+", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Points"
        min={-100}
        step={4}
      />,
    );
    press(buttons(tree).minus);
    press(buttons(tree).plus);
    expect(onChange.mock.calls).toEqual([[-4], [4]]);
  });

  it("clamps the last step to the bound", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={9}
        onChange={onChange}
        label="Points"
        max={10}
        step={4}
      />,
    );
    press(buttons(tree).plus);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("repeats by step while held", () => {
    vi.useFakeTimers();
    function Controlled() {
      const [value, setValue] = useState(0);
      return (
        <QuantityStepper
          value={value}
          onChange={setValue}
          label="Points"
          min={-100}
          step={4}
          repeatOnHold
        />
      );
    }
    const tree = renderTree(<Controlled />);
    act(() => {
      propsOf<{ onPressIn: () => void }>(buttons(tree).minus).onPressIn();
    });
    act(() => {
      vi.advanceTimersByTime(450 + 180);
      propsOf<{ onPressOut: () => void }>(buttons(tree).minus).onPressOut();
    });
    expect(field(tree).value).toBe("-8");
    vi.useRealTimers();
  });
});

describe("QuantityStepper: onStep", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports each −/+ change, not typing", () => {
    const onStep = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onStep={onStep}
      />,
    );
    press(buttons(tree).plus);
    press(buttons(tree).minus);
    act(() => {
      field(tree).onChangeText("12");
    });
    expect(onStep.mock.calls).toEqual([[4], [2]]);
  });

  it("reports long-press jumps", () => {
    const onStep = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        longPressStep={10}
        onStep={onStep}
      />,
    );
    act(() => {
      propsOf<{ onLongPress: () => void }>(buttons(tree).plus).onLongPress();
    });
    expect(onStep).toHaveBeenCalledWith(13);
  });

  it("stays silent when a bound stops the step", () => {
    vi.useFakeTimers();
    const onStep = vi.fn();
    function Controlled() {
      const [value, setValue] = useState(1);
      return (
        <QuantityStepper
          value={value}
          onChange={setValue}
          label="Pain"
          repeatOnHold
          onStep={onStep}
        />
      );
    }
    const tree = renderTree(<Controlled />);
    act(() => {
      propsOf<{ onPressIn: () => void }>(buttons(tree).minus).onPressIn();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onStep.mock.calls).toEqual([[0]]);
  });
});

describe("QuantityStepper: unbounded", () => {
  it("accepts any value with infinite bounds", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Points"
        min={-Infinity}
        max={Infinity}
      />,
    );
    act(() => {
      field(tree).onChangeText("-123456");
    });
    act(() => {
      field(tree).onChangeText("98765432");
    });
    expect(onChange.mock.calls).toEqual([[-123456], [98765432]]);
    expect(field(tree).maxLength).toBe(16);
    expect(propsOf<{ disabled: boolean }>(buttons(tree).minus).disabled).toBe(
      false,
    );
  });
});
