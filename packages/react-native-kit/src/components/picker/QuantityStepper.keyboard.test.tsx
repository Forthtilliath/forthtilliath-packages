import { type ComponentRef, createRef } from "react";
import { type TextInput } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { QuantityStepper } from "./QuantityStepper.js";

const field = (label = "Pain") => screen.getByLabelText(`Quantité : ${label}`);

describe("QuantityStepper keyboard chain", () => {
  it("keeps the default Enter key without onSubmitEditing", async () => {
    await render(<QuantityStepper value={3} onChange={vi.fn()} label="Pain" />);
    expect(field()).toHaveProp("returnKeyType", undefined);
    expect(field()).toHaveProp("submitBehavior", undefined);
  });

  it("shows a next key and keeps the keyboard open with onSubmitEditing", async () => {
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onSubmitEditing={vi.fn()}
      />,
    );
    expect(field()).toHaveProp("returnKeyType", "next");
    expect(field()).toHaveProp("submitBehavior", "submit");
  });

  it("takes a custom Enter key label", async () => {
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onSubmitEditing={vi.fn()}
        returnKeyType="done"
      />,
    );
    expect(field()).toHaveProp("returnKeyType", "done");
  });

  it("sends the typed draft before moving on", async () => {
    const calls: string[] = [];
    await render(
      <QuantityStepper
        value={12}
        onChange={(n) => calls.push(`change ${String(n)}`)}
        label="Bans"
        min={10}
        onSubmitEditing={() => calls.push("submit")}
      />,
    );
    // "2" is below min: kept as a draft until the field is left.
    await fireEvent.changeText(field("Bans"), "2");
    await fireEvent(field("Bans"), "submitEditing");
    expect(calls).toEqual(["change 10", "submit"]);
  });

  it("hands inputRef to the field", async () => {
    const ref = createRef<ComponentRef<typeof TextInput>>();
    await render(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        inputRef={ref}
      />,
    );
    expect(ref.current).not.toBeNull();
  });
});
