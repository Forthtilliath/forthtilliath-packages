import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenTexts } from "../../__mocks__/screenQueries.js";

import { ThemeToggle } from "./ThemeToggle.js";

describe("ThemeToggle", () => {
  it("renders the three default French labels", async () => {
    await render(<ThemeToggle value="system" onChange={vi.fn()} />);
    expect(screenTexts()).toEqual(["Clair", "Sombre", "Système"]);
  });

  it("marks the current value as selected", async () => {
    await render(<ThemeToggle value="dark" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Clair" })).not.toBeSelected();
    expect(screen.getByRole("button", { name: "Sombre" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Système" })).not.toBeSelected();
  });

  it("calls onChange with the pressed option", async () => {
    const onChange = vi.fn();
    await render(<ThemeToggle value="system" onChange={onChange} />);
    await fireEvent.press(screen.getByRole("button", { name: "Clair" }));
    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("accepts custom labels", async () => {
    await render(
      <ThemeToggle
        value="light"
        onChange={vi.fn()}
        labels={{ light: "Light", dark: "Dark", system: "System" }}
      />,
    );
    expect(screenTexts()).toEqual(["Light", "Dark", "System"]);
  });
});
