import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { screenTexts } from "../../__mocks__/screenQueries.js";

import { PrivacySettingsScreen } from "./PrivacySettingsScreen.js";

describe("PrivacySettingsScreen", () => {
  it("renders the default 'everything stays local' sections with zero config", async () => {
    await render(<PrivacySettingsScreen />);
    expect(
      screen.getByText("Aucune donnée envoyée nulle part"),
    ).toBeOnTheScreen();
    expect(screen.getByText("Stockage local uniquement")).toBeOnTheScreen();
    expect(screen.getByText("Partage volontaire uniquement")).toBeOnTheScreen();
  });

  it("fully replaces the default sections when custom ones are passed", async () => {
    await render(
      <PrivacySettingsScreen
        sections={[
          { title: "Custom section", paragraphs: ["Custom paragraph."] },
        ]}
      />,
    );
    expect(screenTexts()).toEqual(["Custom section", "Custom paragraph."]);
  });
});
