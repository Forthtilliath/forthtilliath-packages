/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { UpdateSettingsScreen } from "./UpdateSettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

async function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function texts(tree: ReturnType<typeof create>) {
  return tree.root
    .findAllByType(Text)
    .map((t) => propsOf<{ children: unknown }>(t).children)
    .flat();
}

describe("UpdateSettingsScreen", () => {
  it("checks for an update on mount and shows 'up to date' when there is none", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(null);
    const tree = renderTree(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );

    await act(async () => {
      await flushAsync();
    });

    expect(checkForUpdate).toHaveBeenCalledTimes(1);
    expect(texts(tree)).toContain("Tu as déjà la dernière version.");
    expect(texts(tree)).toContain("1.0.0");
  });

  it("shows the available release and lets the user install it", async () => {
    const downloadAndInstallApk = vi.fn().mockResolvedValue(undefined);
    const tree = renderTree(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockResolvedValue({
          version: "1.1.0",
          notes: "- New stuff.",
          apkUrl: "https://example.com/app.apk",
        })}
        compareVersions={(a, b) => (a > b ? 1 : -1)}
        downloadAndInstallApk={downloadAndInstallApk}
      />,
    );

    await act(async () => {
      await flushAsync();
    });

    expect(texts(tree)).toContain("Version 1.1.0 disponible");
    expect(texts(tree)).toContain("New stuff.");

    const installButton = tree.root
      .findAllByType(Pressable)
      .find(
        (p) =>
          propsOf<{ accessibilityLabel?: string }>(p).accessibilityLabel ===
          "Télécharger et installer la version 1.1.0",
      );
    if (!installButton) throw new Error("expected an install button");

    await act(async () => {
      propsOf<{ onPress: () => void }>(installButton).onPress();
      await flushAsync();
    });

    expect(downloadAndInstallApk).toHaveBeenCalledWith(
      "https://example.com/app.apk",
      expect.any(Function),
    );
  });

  it("shows an error message when the check fails", async () => {
    const tree = renderTree(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockRejectedValue(new Error("network"))}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );

    await act(async () => {
      await flushAsync();
    });

    expect(texts(tree)).toContain("Impossible de vérifier les mises à jour.");
  });

  it("shows release history when fetchReleaseHistory is passed", async () => {
    const tree = renderTree(
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

    await act(async () => {
      await flushAsync();
    });

    expect(texts(tree)).toContain("Historique des versions");
    expect(texts(tree)).toContain("Initial release.");
  });

  it("doesn't show a history section when fetchReleaseHistory is omitted", async () => {
    const tree = renderTree(
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={vi.fn().mockResolvedValue(null)}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
      />,
    );

    await act(async () => {
      await flushAsync();
    });

    expect(texts(tree)).not.toContain("Historique des versions");
  });
});
