import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenIcons, screenTexts } from "../../__mocks__/screenQueries.js";

import { ThemeSettingsScreen } from "./ThemeSettingsScreen.js";

const radio = (name: string) => screen.getByRole("radio", { name });

describe("ThemeSettingsScreen", () => {
  it("renders the three default French labels with their emoji", async () => {
    await render(<ThemeSettingsScreen value="system" onChange={vi.fn()} />);
    expect(screenTexts()).toEqual(
      expect.arrayContaining(["☀️", "Clair", "🌙", "Sombre", "⚙️", "Système"]),
    );
  });

  it("marks the current value as selected and shows a checkmark for it", async () => {
    await render(<ThemeSettingsScreen value="dark" onChange={vi.fn()} />);
    expect(radio("Clair")).not.toBeChecked();
    expect(radio("Sombre")).toBeChecked();
    expect(radio("Système")).not.toBeChecked();
    expect(radio("Sombre")).toHaveTextContent("✓", { exact: false });
  });

  it("calls onChange with the pressed option", async () => {
    const onChange = vi.fn();
    await render(<ThemeSettingsScreen value="system" onChange={onChange} />);
    await fireEvent.press(radio("Clair"));
    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("accepts custom emojis and labels", async () => {
    await render(
      <ThemeSettingsScreen
        value="light"
        onChange={vi.fn()}
        emojis={{ light: "🌞" }}
        labels={{ light: "Day" }}
      />,
    );
    expect(screenTexts()).toEqual(expect.arrayContaining(["🌞", "Day"]));
  });

  it("renders Ionicons instead of emoji when variant is 'icon'", async () => {
    await render(
      <ThemeSettingsScreen value="dark" onChange={vi.fn()} variant="icon" />,
    );
    expect(screenIcons()).toEqual(
      expect.arrayContaining([
        "sunny-outline",
        "moon-outline",
        "phone-portrait-outline",
        "checkmark-circle",
      ]),
    );
    expect(screen.queryByText("☀️")).not.toBeOnTheScreen();
    expect(screen.queryByText("✓")).not.toBeOnTheScreen();
  });

  it("hides the hint when showHint is false", async () => {
    await render(
      <ThemeSettingsScreen
        value="system"
        onChange={vi.fn()}
        showHint={false}
      />,
    );
    expect(
      screen.queryByText(
        "« Système » suit automatiquement le réglage clair/sombre de ton téléphone.",
      ),
    ).not.toBeOnTheScreen();
  });
});
