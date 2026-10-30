/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../../__mocks__/testInstance.js";

import { SwitchRow } from "./SwitchRow.js";
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
          apkSha256: "ab".repeat(32),
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
      "ab".repeat(32),
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

  it("checks stable releases only and shows no switch by default", async () => {
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

    expect(checkForUpdate).toHaveBeenCalledWith({ includePrereleases: false });
    expect(tree.root.findAllByType(SwitchRow)).toHaveLength(0);
  });

  it("offers test versions through the switch and checks again", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(null);
    const onIncludePrereleasesChange = vi.fn();
    const screen = (includePrereleases: boolean) => (
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
        includePrereleases={includePrereleases}
        onIncludePrereleasesChange={onIncludePrereleasesChange}
      />
    );
    const tree = renderTree(screen(false));
    await act(async () => {
      await flushAsync();
    });

    const toggle = tree.root.findByType(SwitchRow);
    expect(propsOf<{ label: string }>(toggle).label).toBe(
      "Recevoir les versions de test",
    );
    act(() => {
      propsOf<{ onChange: (value: boolean) => void }>(toggle).onChange(true);
    });
    expect(onIncludePrereleasesChange).toHaveBeenCalledWith(true);

    await act(async () => {
      tree.update(screen(true));
      await flushAsync();
    });
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
    const screen = (includePrereleases: boolean) => (
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        checkForUpdate={checkForUpdate}
        compareVersions={(a, b) => (a > b ? 1 : -1)}
        downloadAndInstallApk={vi.fn()}
        includePrereleases={includePrereleases}
        onIncludePrereleasesChange={vi.fn()}
      />
    );
    const tree = renderTree(screen(true));

    await act(async () => {
      tree.update(screen(false));
      await flushAsync();
    });
    await act(async () => {
      answerFirst({ version: "1.1.0-alpha.1", notes: "", apkUrl: "x" });
      await flushAsync();
    });

    expect(texts(tree)).toContain("Tu as déjà la dernière version.");
    expect(texts(tree)).not.toContain("Version 1.1.0-alpha.1 disponible");
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
