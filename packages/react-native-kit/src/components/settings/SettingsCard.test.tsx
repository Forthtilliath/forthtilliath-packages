import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { screenElements, screenTexts } from "../../__mocks__/screenQueries.js";

import {
  SettingsCard,
  SettingsCardHint,
  SettingsCardStatus,
} from "./SettingsCard.js";

/** Name and color of each icon on screen, in order. */
const icons = () =>
  screenElements("Ionicons").map(
    (icon) => icon.props as { name: string; color: string },
  );

describe("SettingsCard", () => {
  it("renders the header, then its content", async () => {
    await render(
      <SettingsCard icon="cloud-outline" title="Google Drive">
        <SettingsCardStatus icon="time-outline">
          hier à 21:42
        </SettingsCardStatus>
        <SettingsCardHint>Copie privée</SettingsCardHint>
      </SettingsCard>,
    );

    expect(screenTexts()).toEqual([
      "Google Drive",
      "hier à 21:42",
      "Copie privée",
    ]);
    expect(
      screen.getByRole("header", { name: "Google Drive" }),
    ).toBeOnTheScreen();
    expect(icons()).toEqual([
      expect.objectContaining({ name: "cloud-outline", color: "#2563eb" }),
      expect.objectContaining({ name: "time-outline", color: "#6b7280" }),
    ]);
  });

  it("works without a header icon", async () => {
    await render(<SettingsCard title="Compte" />);
    expect(icons()).toHaveLength(0);
  });

  it("applies colors and style overrides", async () => {
    await render(
      <SettingsCard
        icon="cloud-outline"
        iconColor="#f00"
        title="Drive"
        styles={{ card: { backgroundColor: "#222" }, title: { color: "#fff" } }}
      >
        <SettingsCardStatus
          icon="checkmark-circle"
          iconColor="#0a0"
          styles={{ text: { color: "#eee" } }}
        >
          Relié
        </SettingsCardStatus>
        <SettingsCardHint style={{ color: "#999" }}>Aide</SettingsCardHint>
      </SettingsCard>,
    );

    expect(screen.root).toHaveStyle({ backgroundColor: "#222", padding: 16 });
    expect(screen.getByText("Drive")).toHaveStyle({
      color: "#fff",
      fontWeight: "700",
    });
    expect(screen.getByText("Relié")).toHaveStyle({ color: "#eee" });
    expect(screen.getByText("Aide")).toHaveStyle({
      color: "#999",
      fontSize: 13,
    });
    expect(icons().map((icon) => icon.color)).toEqual(["#f00", "#0a0"]);
    expect(screenTexts()).toHaveLength(3);
  });
});
