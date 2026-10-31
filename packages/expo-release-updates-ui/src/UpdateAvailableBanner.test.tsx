import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { UpdateAvailableBanner } from "./UpdateAvailableBanner.js";

describe("UpdateAvailableBanner", () => {
  it("shows the version and release notes", async () => {
    await render(
      <UpdateAvailableBanner
        version="2.0.0"
        notes={"### Added\n- Something new."}
        onPress={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    expect(screen.getByText("Version 2.0.0 disponible")).toBeOnTheScreen();
    expect(screen.getByText("Added")).toBeOnTheScreen();
    expect(screen.getByText("Something new.")).toBeOnTheScreen();
  });

  it("calls onPress when the action button is pressed", async () => {
    const onPress = vi.fn();
    await render(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={onPress}
        onDismiss={vi.fn()}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Voir" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when the dismiss button is pressed", async () => {
    const onDismiss = vi.fn();
    await render(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={vi.fn()}
        onDismiss={onDismiss}
      />,
    );
    await fireEvent.press(
      screen.getByRole("button", {
        name: "Fermer la notification de mise à jour",
      }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("accepts custom labels", async () => {
    await render(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={vi.fn()}
        onDismiss={vi.fn()}
        labels={{
          title: (version) => `New version: ${version}`,
          action: "View",
          dismiss: "Close",
        }}
      />,
    );
    expect(screen.getByText("New version: 2.0.0")).toBeOnTheScreen();
    expect(screen.getByText("View")).toBeOnTheScreen();
    expect(screen.getByText("Close")).toBeOnTheScreen();
  });

  it("renders its built-in labels in the given locale", async () => {
    await render(
      <UpdateAvailableBanner
        version="2.0.0"
        notes=""
        onPress={vi.fn()}
        onDismiss={vi.fn()}
        locale="en"
        labels={{ action: "Update" }}
      />,
    );
    expect(screen.getByText("Version 2.0.0 available")).toBeOnTheScreen();
    expect(screen.getByText("Close")).toBeOnTheScreen();
    // `labels` still wins over the locale's defaults.
    expect(screen.getByText("Update")).toBeOnTheScreen();
  });
});
