import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenTexts } from "../../__mocks__/screenQueries.js";

import { ThemeOptionList } from "./ThemeOptionList.js";

describe("ThemeOptionList", () => {
  it("renders the three default French labels", async () => {
    await render(<ThemeOptionList value="system" onChange={vi.fn()} />);
    expect(screenTexts()).toEqual(["Clair", "Sombre", "Système"]);
  });

  it("marks the current value as checked", async () => {
    await render(<ThemeOptionList value="dark" onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "Clair" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Sombre" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Système" })).not.toBeChecked();
  });

  it("calls onChange with the pressed option", async () => {
    const onChange = vi.fn();
    await render(<ThemeOptionList value="system" onChange={onChange} />);
    await fireEvent.press(screen.getByRole("radio", { name: "Clair" }));
    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("accepts custom labels", async () => {
    await render(
      <ThemeOptionList
        value="light"
        onChange={vi.fn()}
        labels={{ light: "Light", dark: "Dark", system: "System" }}
      />,
    );
    expect(screenTexts()).toEqual(["Light", "Dark", "System"]);
  });
});
