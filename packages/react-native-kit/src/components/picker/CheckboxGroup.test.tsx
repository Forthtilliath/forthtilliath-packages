import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { CheckboxGroup } from "./CheckboxGroup.js";

const options = [
  { value: "leaders", label: "Leaders" },
  { value: "cities", label: "Cités" },
  { value: "armada", label: "Armada" },
] as const;

const chip = (name: string) => screen.getByRole("checkbox", { name });

describe("CheckboxGroup", () => {
  it("checks an option at the end of the list", async () => {
    const onChange = vi.fn();
    await render(
      <CheckboxGroup
        options={options}
        values={["cities"]}
        onChange={onChange}
      />,
    );
    await fireEvent.press(chip("Leaders"));
    expect(onChange).toHaveBeenCalledWith(["cities", "leaders"]);
  });

  it("unchecks a checked option", async () => {
    const onChange = vi.fn();
    await render(
      <CheckboxGroup
        options={options}
        values={["leaders", "cities"]}
        onChange={onChange}
      />,
    );
    await fireEvent.press(chip("Leaders"));
    expect(onChange).toHaveBeenCalledWith(["cities"]);
  });

  it("announces each chip as a checkbox with its state", async () => {
    await render(
      <CheckboxGroup
        label="Extensions"
        options={options}
        values={["armada"]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(chip("Leaders")).not.toBeChecked();
    expect(chip("Cités")).not.toBeChecked();
    expect(chip("Armada")).toBeChecked();
  });

  it("styles checked chips, with overrides", async () => {
    await render(
      <CheckboxGroup
        options={options}
        values={["cities"]}
        onChange={vi.fn()}
        styles={{
          chipChecked: { backgroundColor: "#c9a227" },
          textChecked: { color: "#000" },
        }}
      />,
    );
    expect(chip("Cités")).toHaveStyle({
      backgroundColor: "#c9a227",
      borderColor: "#2563eb",
    });
    expect(screen.getByText("Cités")).toHaveStyle({ color: "#000" });
    expect(screen.getByText("Leaders")).toHaveStyle({ color: "#6b7280" });
  });
});
