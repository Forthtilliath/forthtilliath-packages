import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { UpdateSettingsScreen } from "./UpdateSettingsScreen.js";

/** Lets the checks started on mount (or on a change) answer. */
function settle() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

describe("UpdateSettingsScreen", () => {
  it("checks for an update on mount and shows 'up to date' when there is none", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(null);
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );
    await settle();

    expect(checkForUpdate).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText("Tu as déjà la dernière version."),
    ).toBeOnTheScreen();
    expect(screen.getByText(/1\.0\.0/)).toBeOnTheScreen();
  });

  it("shows the available release and lets the user install it", async () => {
    const downloadAndInstallApk = vi.fn().mockResolvedValue(undefined);
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockResolvedValue({
          version: "1.1.0",
          notes: "- New stuff.",
          apkUrl: "https://example.com/app.apk",
          apkSha256: "ab".repeat(32),
        })}
        compareVersions={(a, b) => (a > b ? 1 : -1)}
        downloadAndInstallApk={downloadAndInstallApk}
      />,
    );
    await settle();

    expect(screen.getByText("Version 1.1.0 disponible")).toBeOnTheScreen();
    expect(screen.getByText("New stuff.")).toBeOnTheScreen();

    await fireEvent.press(
      screen.getByRole("button", {
        name: "Télécharger et installer la version 1.1.0",
      }),
    );
    await settle();

    expect(downloadAndInstallApk).toHaveBeenCalledWith(
      "https://example.com/app.apk",
      expect.any(Function),
      "ab".repeat(32),
    );
  });

  it("shows an error message when the check fails", async () => {
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockRejectedValue(new Error("network"))}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );
    await settle();

    expect(
      screen.getByText("Impossible de vérifier les mises à jour."),
    ).toBeOnTheScreen();
  });

  it("shows release history when fetchReleaseHistory is passed", async () => {
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockResolvedValue(null)}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
        fetchReleaseHistory={vi
          .fn()
          .mockResolvedValue([
            { version: "1.0.0", notes: "- Initial release." },
          ])}
      />,
    );
    await settle();

    expect(screen.getByText("Historique des versions")).toBeOnTheScreen();
    expect(screen.getByText("Initial release.")).toBeOnTheScreen();
  });

  it("checks stable releases only and shows no switch by default", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(null);
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );
    await settle();

    expect(checkForUpdate).toHaveBeenCalledWith({ includePrereleases: false });
    expect(screen.queryByRole("switch")).not.toBeOnTheScreen();
  });

  it("offers test versions through the switch and checks again", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(null);
    const onIncludePrereleasesChange = vi.fn();
    const updateScreen = (includePrereleases: boolean) => (
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
        includePrereleases={includePrereleases}
        onIncludePrereleasesChange={onIncludePrereleasesChange}
      />
    );
    const { rerender } = await render(updateScreen(false));
    await settle();

    const toggle = screen.getByRole("switch", {
      name: "Recevoir les versions de test",
    });
    expect(toggle).not.toBeChecked();
    await fireEvent.press(toggle);
    expect(onIncludePrereleasesChange).toHaveBeenCalledWith(true);

    await rerender(updateScreen(true));
    await settle();
    expect(checkForUpdate).toHaveBeenCalledTimes(2);
    expect(checkForUpdate).toHaveBeenLastCalledWith({
      includePrereleases: true,
    });
  });

  it("ignores the answer of a check that a newer one replaced", async () => {
    let answerFirst!: (release: unknown) => void;
    const checkForUpdate = vi
      .fn()
      .mockReturnValueOnce(
        new Promise((resolve) => {
          answerFirst = resolve;
        }),
      )
      .mockResolvedValueOnce(null);
    const updateScreen = (includePrereleases: boolean) => (
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={(a, b) => (a > b ? 1 : -1)}
        downloadAndInstallApk={vi.fn()}
        includePrereleases={includePrereleases}
        onIncludePrereleasesChange={vi.fn()}
      />
    );
    const { rerender } = await render(updateScreen(true));

    await rerender(updateScreen(false));
    await settle();
    await act(async () => {
      answerFirst({ version: "1.1.0-alpha.1", notes: "", apkUrl: "x" });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      screen.getByText("Tu as déjà la dernière version."),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText("Version 1.1.0-alpha.1 disponible"),
    ).not.toBeOnTheScreen();
  });

  it("doesn't show a history section when fetchReleaseHistory is omitted", async () => {
    await render(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockResolvedValue(null)}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );
    await settle();

    expect(screen.queryByText("Historique des versions")).not.toBeOnTheScreen();
  });
});
