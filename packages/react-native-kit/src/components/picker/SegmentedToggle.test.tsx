import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { SegmentedToggle } from "./SegmentedToggle.js";

const options = [
  { value: "calendar", label: "Calendrier" },
  { value: "list", label: "Liste" },
] as const;

const radio = (name: string) => screen.getByRole("radio", { name });

describe("SegmentedToggle", () => {
  it("marks only the active option as selected and styles it", async () => {
    await render(
      <SegmentedToggle options={options} value="list" onChange={vi.fn()} />,
    );
    expect(radio("Liste")).toBeSelected();
    expect(radio("Calendrier")).not.toBeSelected();
    expect(radio("Liste")).toHaveStyle({ backgroundColor: "#2563eb" });
    expect(radio("Calendrier")).not.toHaveStyle({
      backgroundColor: "#2563eb",
    });
    expect(screen.getByText("Liste")).toHaveStyle({ color: "#ffffff" });
  });

  it("reports the tapped value", async () => {
    const onChange = vi.fn();
    await render(
      <SegmentedToggle options={options} value="list" onChange={onChange} />,
    );
    await fireEvent.press(radio("Calendrier"));
    expect(onChange).toHaveBeenCalledWith("calendar");
  });

  it("announces options as radios, hint included", async () => {
    await render(
      <SegmentedToggle
        label="Format"
        options={[
          { value: "duo", label: "Duos", hint: "2 × 2" },
          { value: "trio", label: "Trios" },
        ]}
        value="duo"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Format")).toHaveProp(
      "accessibilityRole",
      "radiogroup",
    );
    expect(radio("Duos, 2 × 2")).toBeChecked();
    expect(radio("Trios")).not.toBeChecked();
    expect(screen.getByText("2 × 2")).toHaveStyle({
      fontSize: 12,
      color: "#dbeafe",
    });
  });

  it("applies active overrides on top of the base slot", async () => {
    await render(
      <SegmentedToggle
        options={options}
        value="list"
        onChange={vi.fn()}
        styles={{ buttonActive: { backgroundColor: "#0000ff" } }}
      />,
    );
    expect(radio("Liste")).toHaveStyle({
      flex: 1,
      borderRadius: 8,
      backgroundColor: "#0000ff",
    });
  });
});
