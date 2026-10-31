import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import type { UpdateNotifierProps } from "./UpdateNotifier.js";
import { UpdateNotifier } from "./UpdateNotifier.js";

const RELEASE = {
  version: "2.0.0",
  notes: "",
  apkUrl: "https://example.com/app.apk",
  apkSha256: "ab".repeat(32),
};

function settle() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

async function renderNotifier(overrides: Partial<UpdateNotifierProps> = {}) {
  const props: UpdateNotifierProps = {
    currentVersion: "1.0.0",
    checkForUpdate: vi.fn().mockResolvedValue(RELEASE),
    getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
    onChecked: vi.fn(),
    downloadAndInstallApk: vi.fn().mockResolvedValue(undefined),
    onDismissVersion: vi.fn(),
    ...overrides,
  };
  await render(<UpdateNotifier {...props} />);
  await settle();
  return props;
}

/** Taps the button showing `label`, then lets its work settle. */
async function press(label: string) {
  await fireEvent.press(screen.getByText(label));
  await settle();
}

describe("UpdateNotifier", () => {
  it("announces a newer release with Install / Ignore", async () => {
    await renderNotifier();
    expect(screen.getByText("Version 2.0.0 disponible")).toBeOnTheScreen();
    expect(screen.getByText("Installer")).toBeOnTheScreen();
    expect(screen.getByText("Ignorer")).toBeOnTheScreen();
  });

  it("does not check while disabled", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    await renderNotifier({ enabled: false, checkForUpdate });
    expect(checkForUpdate).not.toHaveBeenCalled();
    expect(screen.toJSON()).toBeNull();
  });

  it("persists an ignored version and hides the banner", async () => {
    const props = await renderNotifier();
    await press("Ignorer");
    expect(props.onDismissVersion).toHaveBeenCalledWith("2.0.0");
    expect(screen.toJSON()).toBeNull();
  });

  it("installs right away, showing the download progress", async () => {
    let report: (fraction: number) => void = () => undefined;
    const downloadAndInstallApk = vi.fn(
      (_url: string, onProgress?: (fraction: number) => void) => {
        report = onProgress ?? report;
        return new Promise<void>(() => undefined);
      },
    );
    const props = await renderNotifier({ downloadAndInstallApk });

    await press("Installer");
    await act(() => {
      report(0.42);
    });

    expect(downloadAndInstallApk).toHaveBeenCalledWith(
      RELEASE.apkUrl,
      expect.any(Function),
      RELEASE.apkSha256,
    );
    expect(
      screen.getByText("Téléchargement de la version 2.0.0… 42%"),
    ).toBeOnTheScreen();
    expect(props.onDismissVersion).not.toHaveBeenCalled();
  });

  it("offers a retry after a failed download, then can be closed", async () => {
    const downloadAndInstallApk = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockReturnValueOnce(new Promise<void>(() => undefined))
      .mockRejectedValueOnce(new Error("network"));
    await renderNotifier({ downloadAndInstallApk });

    await press("Installer");
    expect(
      screen.getByText("Le téléchargement de la version 2.0.0 a échoué."),
    ).toBeOnTheScreen();

    await press("Réessayer");
    expect(downloadAndInstallApk).toHaveBeenCalledTimes(2);
    expect(downloadAndInstallApk).toHaveBeenLastCalledWith(
      RELEASE.apkUrl,
      expect.any(Function),
      RELEASE.apkSha256,
    );
    expect(
      screen.getByText("Téléchargement de la version 2.0.0… 0%"),
    ).toBeOnTheScreen();
  });

  it("closes the error card", async () => {
    const downloadAndInstallApk = vi
      .fn()
      .mockRejectedValue(new Error("network"));
    await renderNotifier({ downloadAndInstallApk });

    await press("Installer");
    await press("Fermer");
    expect(screen.toJSON()).toBeNull();
  });

  it("goes back to idle once the installer has taken over", async () => {
    await renderNotifier();
    await press("Installer");
    expect(screen.toJSON()).toBeNull();
  });

  it("speaks English with locale en", async () => {
    await renderNotifier({ locale: "en" });
    expect(screen.getByText("Install")).toBeOnTheScreen();
    expect(screen.getByText("Ignore")).toBeOnTheScreen();
  });
});
