import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuantityStepper } from "./QuantityStepper.js";

const minus = (label = "Points") =>
  screen.getByRole("button", { name: `Retirer : ${label}` });
const plus = (label = "Points") =>
  screen.getByRole("button", { name: `Ajouter : ${label}` });
const field = (label = "Points") =>
  screen.getByLabelText(`Quantité : ${label}`);

/** A stepper that holds its value and repeats while held. */
function Controlled(props: {
  initial: number;
  min?: number;
  step?: number;
  onStep?: (value: number) => void;
}) {
  const [value, setValue] = useState(props.initial);
  return (
    <QuantityStepper
      value={value}
      onChange={setValue}
      label="Points"
      min={props.min}
      step={props.step}
      repeatOnHold
      onStep={props.onStep}
    />
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("QuantityStepper: step", () => {
  it("moves by step on −/+", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Points"
        min={-100}
        step={4}
      />,
    );
    await fireEvent.press(minus());
    await fireEvent.press(plus());
    expect(onChange.mock.calls).toEqual([[-4], [4]]);
  });

  it("clamps the last step to the bound", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={9}
        onChange={onChange}
        label="Points"
        max={10}
        step={4}
      />,
    );
    await fireEvent.press(plus());
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("repeats by step while held", async () => {
    vi.useFakeTimers();
    await render(<Controlled initial={0} min={-100} step={4} />);
    await fireEvent(minus(), "pressIn");
    await act(() => {
      vi.advanceTimersByTime(450 + 180);
    });
    await fireEvent(minus(), "pressOut");
    expect(field()).toHaveDisplayValue("-8");
  });
});

describe("QuantityStepper: onStep", () => {
  it("reports each −/+ change, not typing", async () => {
    const onStep = vi.fn();
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onStep={onStep}
      />,
    );
    await fireEvent.press(plus("Pain"));
    await fireEvent.press(minus("Pain"));
    await fireEvent.changeText(field("Pain"), "12");
    expect(onStep.mock.calls).toEqual([[4], [2]]);
  });

  it("reports long-press jumps", async () => {
    const onStep = vi.fn();
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        longPressStep={10}
        onStep={onStep}
      />,
    );
    await fireEvent(plus("Pain"), "longPress");
    expect(onStep).toHaveBeenCalledWith(13);
  });

  it("stays silent when a bound stops the step", async () => {
    vi.useFakeTimers();
    const onStep = vi.fn();
    await render(<Controlled initial={1} onStep={onStep} />);
    await fireEvent(minus(), "pressIn");
    await act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onStep.mock.calls).toEqual([[0]]);
  });
});

describe("QuantityStepper: unbounded", () => {
  it("accepts any value with infinite bounds", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Points"
        min={-Infinity}
        max={Infinity}
      />,
    );
    await fireEvent.changeText(field(), "-123456");
    await fireEvent.changeText(field(), "98765432");
    expect(onChange.mock.calls).toEqual([[-123456], [98765432]]);
    expect(field()).toHaveProp("maxLength", 16);
    expect(minus()).toBeEnabled();
  });
});
