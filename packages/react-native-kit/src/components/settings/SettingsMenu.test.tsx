import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenIcons, screenTexts } from "../../__mocks__/screenQueries.js";

import { SettingsMenu } from "./SettingsMenu.js";

describe("SettingsMenu", () => {
  it("renders one row per item, with its title and hint", async () => {
    await render(
      <SettingsMenu
        items={[
          {
            key: "backup",
            emoji: "💾",
            title: "Sauvegarde",
            hint: "Exporter tes données",
            onPress: vi.fn(),
          },
          { key: "theme", emoji: "🎨", title: "Thème", onPress: vi.fn() },
        ]}
      />,
    );
    expect(screenTexts()).toEqual([
      "💾",
      "Sauvegarde",
      "Exporter tes données",
      "🎨",
      "Thème",
    ]);
  });

  it("calls the item's onPress when its row is pressed", async () => {
    const onPress = vi.fn();
    await render(
      <SettingsMenu
        items={[{ key: "backup", emoji: "💾", title: "Sauvegarde", onPress }]}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Sauvegarde" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("defaults to the well-known emoji for a recognized key when no emoji/icon is given", async () => {
    await render(
      <SettingsMenu
        items={[{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }]}
      />,
    );
    expect(screen.getByText("💾")).toBeOnTheScreen();
  });

  it("defaults to the well-known icon for a recognized key when defaultIconKind is 'icon'", async () => {
    await render(
      <SettingsMenu
        items={[{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }]}
        defaultIconKind="icon"
      />,
    );
    expect(screenIcons()).toContain("save-outline");
  });

  it("doesn't default an icon for an unrecognized key", async () => {
    await render(
      <SettingsMenu
        items={[{ key: "profile", title: "Mon nom", onPress: vi.fn() }]}
      />,
    );
    expect(screenIcons()).toHaveLength(1); // just the chevron
    expect(screen.getByText("Mon nom")).toBeOnTheScreen();
  });

  it("an item's own emoji/icon overrides the default for its key", async () => {
    await render(
      <SettingsMenu
        items={[
          { key: "backup", emoji: "📦", title: "Sauvegarde", onPress: vi.fn() },
        ]}
      />,
    );
    expect(screen.getByText("📦")).toBeOnTheScreen();
    expect(screen.queryByText("💾")).not.toBeOnTheScreen();
  });

  it("hides every hint when showHints is false", async () => {
    await render(
      <SettingsMenu
        items={[
          {
            key: "backup",
            emoji: "💾",
            title: "Sauvegarde",
            hint: "Exporter tes données",
            onPress: vi.fn(),
          },
        ]}
        showHints={false}
      />,
    );
    expect(screen.queryByText("Exporter tes données")).not.toBeOnTheScreen();
  });

  it("renders items grouped under their section title when `groups` is given", async () => {
    await render(
      <SettingsMenu
        groups={[
          {
            title: "Réglages de calcul",
            items: [{ key: "ratio", title: "Ratio", onPress: vi.fn() }],
          },
          {
            items: [{ key: "backup", title: "Sauvegarde", onPress: vi.fn() }],
          },
        ]}
      />,
    );
    const texts = screenTexts();
    expect(texts.indexOf("Réglages de calcul")).toBeLessThan(
      texts.indexOf("Ratio"),
    );
    expect(screen.getByRole("button", { name: "Ratio" })).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Sauvegarde" }),
    ).toBeOnTheScreen();
  });
});
