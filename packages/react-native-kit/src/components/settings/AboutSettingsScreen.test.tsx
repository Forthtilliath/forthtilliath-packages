import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { AboutSettingsScreen } from "./AboutSettingsScreen.js";

describe("AboutSettingsScreen", () => {
  it("shows the app name, version, description and developer credit", async () => {
    await render(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="Un outil personnel de calcul de dose."
        developerName="Vincent LISITA"
      />,
    );
    expect(screen.getByText("GlucoDose")).toBeOnTheScreen();
    expect(screen.getByText("Version 1.2.0")).toBeOnTheScreen();
    expect(
      screen.getByText("Un outil personnel de calcul de dose."),
    ).toBeOnTheScreen();
    expect(
      screen.getByText("Développée par Vincent LISITA."),
    ).toBeOnTheScreen();
  });

  it("renders each entry of a description array as its own paragraph", async () => {
    await render(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description={["Premier paragraphe.", "Second paragraphe."]}
        developerName="Vincent LISITA"
      />,
    );
    expect(screen.getByText("Premier paragraphe.")).toBeOnTheScreen();
    expect(screen.getByText("Second paragraphe.")).toBeOnTheScreen();
  });

  it("accepts custom labels", async () => {
    await render(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="..."
        developerName="Vincent LISITA"
        labels={{
          version: (v) => `v${v}`,
          developedBy: (name) => `By ${name}`,
        }}
      />,
    );
    expect(screen.getByText("v1.2.0")).toBeOnTheScreen();
    expect(screen.getByText("By Vincent LISITA")).toBeOnTheScreen();
  });

  it("renders extra sections with their title and paragraphs", async () => {
    await render(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="..."
        sections={[
          {
            title: "Avertissement médical",
            paragraphs: ["Ceci n'est pas un avis médical."],
          },
        ]}
      />,
    );
    expect(screen.getByText("Avertissement médical")).toBeOnTheScreen();
    expect(
      screen.getByText("Ceci n'est pas un avis médical."),
    ).toBeOnTheScreen();
  });

  it("doesn't show a developer credit when `developerName` is omitted", async () => {
    await render(
      <AboutSettingsScreen
        appName="GlucoDose"
        version="1.2.0"
        description="..."
      />,
    );
    expect(screen.queryByText(/^Développée par/)).not.toBeOnTheScreen();
  });
});
