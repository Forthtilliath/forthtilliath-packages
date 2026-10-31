import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { OptionsModal } from "./OptionsModal.js";
import { SelectField } from "./SelectField.js";

const options = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
];

/** The open modal, and the full-screen backdrop it is made of. */
function openModal() {
  const modal = screen.root;
  const [backdrop] = modal?.children ?? [];
  if (modal?.type !== "Modal" || typeof backdrop !== "object")
    throw new Error("expected an open modal and its backdrop");
  return { modal, backdrop };
}

describe("OptionsModal", () => {
  it("selects the tapped option, then closes", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    await render(
      <OptionsModal
        visible
        onClose={onClose}
        options={options}
        onSelect={onSelect}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Février" }));
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on a backdrop tap and on Android's back button", async () => {
    const onClose = vi.fn();
    await render(
      <OptionsModal
        visible
        onClose={onClose}
        options={options}
        onSelect={vi.fn()}
      />,
    );
    await fireEvent.press(openModal().backdrop);
    await fireEvent(openModal().modal, "requestClose");
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe("SelectField", () => {
  it("shows the caption and current value, options hidden", async () => {
    await render(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("Mois")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Mois : Janvier" }),
    ).toBeOnTheScreen();
    expect(screen.queryByText("Février")).not.toBeOnTheScreen();
  });

  it("opens the options and forwards the choice", async () => {
    const onSelect = vi.fn();
    await render(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={onSelect}
      />,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Mois : Janvier" }),
    );
    await fireEvent.press(screen.getByRole("button", { name: "Février" }));
    expect(onSelect).toHaveBeenCalledWith(2);
    expect(screen.queryByText("Février")).not.toBeOnTheScreen();
  });

  it("forwards nested OptionsModal styles and merges its own", async () => {
    await render(
      <SelectField
        label="Mois"
        valueLabel="Janvier"
        options={options}
        onSelect={vi.fn()}
        styles={{
          button: { borderColor: "#333333" },
          optionsModal: { optionText: { color: "#eeeeee" } },
        }}
      />,
    );
    const button = screen.getByRole("button", { name: "Mois : Janvier" });
    expect(button).toHaveStyle({ borderRadius: 8, borderColor: "#333333" });
    await fireEvent.press(button);
    expect(screen.getByText("Février")).toHaveStyle({
      fontSize: 16,
      color: "#eeeeee",
    });
  });
});
