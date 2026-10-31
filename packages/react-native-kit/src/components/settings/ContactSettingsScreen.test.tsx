import { Linking } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { ContactSettingsScreen } from "./ContactSettingsScreen.js";

const emailButton = () =>
  screen.getByRole("button", { name: "Envoyer un email à dev@example.com" });

describe("ContactSettingsScreen", () => {
  it("shows the email and the default hints", async () => {
    await render(<ContactSettingsScreen email="dev@example.com" />);
    expect(screen.getByText("✉️ dev@example.com")).toBeOnTheScreen();
    expect(
      screen.getByText("Une question, un bug, une suggestion ?"),
    ).toBeOnTheScreen();
  });

  it("opens a mailto: link when the email button is pressed", async () => {
    const openURLSpy = vi
      .spyOn(Linking, "openURL")
      .mockResolvedValue(undefined);
    await render(<ContactSettingsScreen email="dev@example.com" />);

    await fireEvent.press(emailButton());

    expect(openURLSpy).toHaveBeenCalledWith("mailto:dev@example.com");
    openURLSpy.mockRestore();
  });

  it("accepts custom labels", async () => {
    await render(
      <ContactSettingsScreen
        email="dev@example.com"
        labels={{ hint: "Got a question?", footer: "Thanks!" }}
      />,
    );
    expect(screen.getByText("Got a question?")).toBeOnTheScreen();
    expect(screen.getByText("Thanks!")).toBeOnTheScreen();
  });

  it("switches to a rows layout with the email first when `actions` is given", async () => {
    const share = vi.fn();
    await render(
      <ContactSettingsScreen
        email="dev@example.com"
        actions={[
          { icon: "share-outline", label: "Partager l'app", onPress: share },
        ]}
      />,
    );
    expect(emailButton()).toHaveTextContent("Me contacter", { exact: false });
    expect(screen.queryByText("✉️ dev@example.com")).not.toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole("button", { name: "Partager l'app" }),
    );
    expect(share).toHaveBeenCalledTimes(1);
  });
});
