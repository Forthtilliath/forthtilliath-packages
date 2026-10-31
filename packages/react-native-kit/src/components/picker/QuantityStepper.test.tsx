import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuantityStepper } from "./QuantityStepper.js";

const minus = (label = "Pain") =>
  screen.getByRole("button", { name: `Retirer : ${label}` });
const plus = (label = "Pain") =>
  screen.getByRole("button", { name: `Ajouter : ${label}` });
const field = (label = "Pain") => screen.getByLabelText(`Quantité : ${label}`);

describe("QuantityStepper", () => {
  it("steps down and up", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper value={3} onChange={onChange} label="Pain" />,
    );
    await fireEvent.press(minus());
    await fireEvent.press(plus());
    expect(onChange.mock.calls).toEqual([[2], [4]]);
  });

  it("caps the font scaling of −, + and the field", async () => {
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        maxFontSizeMultiplier={1.3}
      />,
    );
    for (const node of [screen.getByText("−"), screen.getByText("+"), field()])
      expect(node).toHaveProp("maxFontSizeMultiplier", 1.3);
  });

  it("disables and dims − at zero", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper value={0} onChange={onChange} label="Pain" />,
    );
    expect(minus()).toBeDisabled();
    expect(minus()).toHaveStyle({ opacity: 0.35, width: 40 });
    await fireEvent.press(minus());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps digits only and clamps typed values to max", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper value={0} onChange={onChange} label="Pain" max={50} />,
    );
    await fireEvent.changeText(field(), "1a2");
    await fireEvent.changeText(field(), "75");
    await fireEvent.changeText(field(), "");
    expect(onChange.mock.calls).toEqual([[12], [50]]);
    expect(field()).toHaveDisplayValue("");
    await fireEvent(field(), "blur");
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(field()).toHaveProp("maxLength", 2);
  });

  it("clamps to a custom min and disables + at max", async () => {
    const onChange = vi.fn();
    const { rerender } = await render(
      <QuantityStepper
        value={1}
        onChange={onChange}
        label="Bans"
        min={1}
        max={5}
      />,
    );
    expect(minus("Bans")).toBeDisabled();
    await fireEvent.changeText(field("Bans"), "");
    await fireEvent(field("Bans"), "blur");
    expect(onChange).toHaveBeenLastCalledWith(1);

    await rerender(
      <QuantityStepper value={5} onChange={vi.fn()} label="Bans" max={5} />,
    );
    expect(plus("Bans")).toBeDisabled();
    expect(plus("Bans")).toHaveStyle({ opacity: 0.35 });
  });

  it("lets a number starting below min be typed, clamped on blur", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={10}
        onChange={onChange}
        label="Points"
        min={10}
        max={99}
      />,
    );
    await fireEvent.changeText(field("Points"), "2");
    expect(onChange).not.toHaveBeenCalled();
    expect(field("Points")).toHaveDisplayValue("2");
    await fireEvent.changeText(field("Points"), "25");
    expect(onChange).toHaveBeenLastCalledWith(25);

    await fireEvent.changeText(field("Points"), "3");
    await fireEvent(field("Points"), "blur");
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("jumps by longPressStep on long press, clamped", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={3}
        onChange={onChange}
        label="Bans"
        max={6}
        longPressStep={5}
      />,
    );
    await fireEvent(plus("Bans"), "longPress");
    await fireEvent(minus("Bans"), "longPress");
    expect(onChange.mock.calls).toEqual([[6], [0]]);
  });

  it("ignores long presses without longPressStep", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper value={3} onChange={onChange} label="Pain" />,
    );
    await fireEvent(plus(), "longPress");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows negatives below a negative min, sign included", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper
        value={0}
        onChange={onChange}
        label="Pénalités"
        min={-50}
      />,
    );
    const input = () => field("Pénalités");
    expect(input()).toHaveProp("keyboardType", "numeric");
    expect(input()).toHaveProp("maxLength", 3);
    await fireEvent.press(minus("Pénalités"));
    expect(onChange).toHaveBeenLastCalledWith(-1);

    await fireEvent.changeText(input(), "-");
    expect(input()).toHaveDisplayValue("-");
    await fireEvent.changeText(input(), "-1a3");
    expect(onChange).toHaveBeenLastCalledWith(-13);
    await fireEvent.changeText(input(), "-");
    await fireEvent(input(), "blur");
    expect(onChange).toHaveBeenLastCalledWith(0);
    await fireEvent.changeText(input(), "-80");
    await fireEvent(input(), "blur");
    expect(onChange).toHaveBeenLastCalledWith(-50);
  });

  it("drops the sign when negatives are not allowed", async () => {
    const onChange = vi.fn();
    await render(
      <QuantityStepper value={0} onChange={onChange} label="Pain" />,
    );
    await fireEvent.changeText(field(), "-7");
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

    async function advance(ms: number) {
      await act(() => {
        vi.advanceTimersByTime(ms);
      });
    }

    it("repeats while held and stops on release", async () => {
      await render(<Controlled initial={0} />);
      // Taps do nothing: the step comes from pressIn.
      await fireEvent.press(plus("Points"));
      expect(field("Points")).toHaveDisplayValue("0");
      await fireEvent(plus("Points"), "pressIn");
      await advance(450 + 180 * 3);
      await fireEvent(plus("Points"), "pressOut");
      expect(field("Points")).toHaveDisplayValue("4");
      await advance(5000);
      expect(field("Points")).toHaveDisplayValue("4");
    });

    it("stops at the bound", async () => {
      await render(<Controlled initial={-2} min={-3} />);
      await fireEvent(minus("Points"), "pressIn");
      await advance(3000);
      expect(field("Points")).toHaveDisplayValue("-3");
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  it("labels the controls in French by default, English with locale", async () => {
    const { rerender } = await render(
      <QuantityStepper value={1} onChange={vi.fn()} label="Pain" />,
    );
    expect(plus()).toBeOnTheScreen();

    await rerender(
      <QuantityStepper
        value={1}
        onChange={vi.fn()}
        label="Bread"
        locale="en"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Decrease: Bread" }),
    ).toBeOnTheScreen();
  });

  it("accepts custom screen-reader labels", async () => {
    await render(
      <QuantityStepper
        value={1}
        onChange={vi.fn()}
        label="Pain"
        a11yLabels={{ increase: (l) => `Un ${l} de plus` }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Un Pain de plus" }),
    ).toBeOnTheScreen();
    expect(minus()).toBeOnTheScreen();
  });
});
