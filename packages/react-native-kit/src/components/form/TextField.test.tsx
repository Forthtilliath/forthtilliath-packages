import { createRef, useState } from "react";
import type { TextInput } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { IntegerField } from "./IntegerField.js";
import { TextField } from "./TextField.js";

describe("TextField", () => {
  it("names the input after its label and passes TextInput props through", async () => {
    const onChangeText = vi.fn();
    await render(
      <TextField
        label="Nom"
        value=""
        onChangeText={onChangeText}
        maxLength={30}
      />,
    );
    const input = screen.getByLabelText("Nom");
    expect(input).toHaveProp("maxLength", 30);
    await fireEvent.changeText(input, "Léa");
    expect(onChangeText).toHaveBeenCalledWith("Léa");
  });

  it("marks a required field, also for screen readers", async () => {
    await render(<TextField label="Nom" required />);
    expect(
      screen.getByText("Nom *", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Nom, obligatoire")).toBeOnTheScreen();
  });

  it('says "required" in English', async () => {
    await render(<TextField label="Name" required locale="en" />);
    expect(screen.getByLabelText("Name, required")).toBeOnTheScreen();
  });

  it("reads the hint, replaced by the error, which is announced", async () => {
    const { rerender } = await render(
      <TextField label="Nom" hint="30 caractères max." />,
    );
    expect(screen.getByLabelText("Nom")).toHaveProp(
      "accessibilityHint",
      "30 caractères max.",
    );

    await rerender(
      <TextField
        label="Nom"
        hint="30 caractères max."
        error="Nom déjà pris."
      />,
    );
    const error = screen.getByText("Nom déjà pris.");
    expect(error).toHaveProp("accessibilityLiveRegion", "polite");
    expect(screen.queryByText("30 caractères max.")).not.toBeOnTheScreen();
    expect(screen.getByLabelText("Nom")).toHaveProp(
      "accessibilityHint",
      "Nom déjà pris.",
    );
    expect(screen.getByLabelText("Nom")).toHaveStyle({
      borderColor: "#b42318",
      borderWidth: 2,
    });
  });

  it("outlines the input on focus and still calls onFocus / onBlur", async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    await render(
      <TextField
        label="Nom"
        onFocus={onFocus}
        onBlur={onBlur}
        colors={{ borderFocused: "#00ff00" }}
      />,
    );
    const input = screen.getByLabelText("Nom");
    await fireEvent(input, "focus");
    expect(input).toHaveStyle({ borderColor: "#00ff00" });
    expect(onFocus).toHaveBeenCalled();
    await fireEvent(input, "blur");
    expect(input).toHaveStyle({ borderColor: "#8b95a1" });
    expect(onBlur).toHaveBeenCalled();
  });

  it("forwards inputRef", async () => {
    const ref = createRef<TextInput>();
    await render(<TextField label="Nom" inputRef={ref} />);
    expect(ref.current).not.toBeNull();
  });
});

function ControlledInteger(props: {
  min?: number;
  max?: number;
  onChange?: (n: number) => void;
}) {
  const [value, setValue] = useState(5);
  return (
    <IntegerField
      label="Points"
      value={value}
      min={props.min}
      max={props.max}
      onChange={(n) => {
        props.onChange?.(n);
        setValue(n);
      }}
    />
  );
}

describe("IntegerField", () => {
  it("lets a negative number be typed, a lone minus included", async () => {
    const onChange = vi.fn();
    await render(<ControlledInteger onChange={onChange} />);
    const input = screen.getByLabelText("Points");
    expect(input).toHaveProp("keyboardType", "numeric");

    await fireEvent.changeText(input, "-");
    expect(input).toHaveProp("value", "-");
    expect(onChange).not.toHaveBeenCalled();

    await fireEvent.changeText(input, "-12");
    expect(onChange).toHaveBeenLastCalledWith(-12);
    expect(input).toHaveProp("value", "-12");
  });

  it("cleans pasted text", async () => {
    const onChange = vi.fn();
    await render(<ControlledInteger onChange={onChange} />);
    await fireEvent.changeText(screen.getByLabelText("Points"), "1 250 pts");
    expect(onChange).toHaveBeenLastCalledWith(1250);
  });

  it("uses the number pad and drops the minus when min ≥ 0", async () => {
    const onChange = vi.fn();
    await render(<ControlledInteger min={0} onChange={onChange} />);
    const input = screen.getByLabelText("Points");
    expect(input).toHaveProp("keyboardType", "number-pad");
    await fireEvent.changeText(input, "-3");
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("keeps an out-of-range value as typed, then clamps it on blur", async () => {
    const onChange = vi.fn();
    await render(<ControlledInteger min={10} max={20} onChange={onChange} />);
    const input = screen.getByLabelText("Points");

    await fireEvent.changeText(input, "1");
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveProp("value", "1");

    await fireEvent(input, "blur");
    expect(onChange).toHaveBeenLastCalledWith(10);
    expect(input).toHaveProp("value", "10");
  });

  it("shows the last valid value again after an unfinished entry", async () => {
    await render(<ControlledInteger />);
    const input = screen.getByLabelText("Points");
    await fireEvent.changeText(input, "");
    expect(input).toHaveProp("value", "");
    await fireEvent(input, "blur");
    expect(input).toHaveProp("value", "5");
  });
});
