/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable, Text } from "react-native";
import type { ReactTestRenderer } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "./__mocks__/testInstance.js";
import type { UpdateNotifierProps } from "./UpdateNotifier.js";
import { UpdateNotifier } from "./UpdateNotifier.js";

const RELEASE = {
  version: "2.0.0",
  notes: "",
  apkUrl: "https://example.com/app.apk",
};

function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function render(overrides: Partial<UpdateNotifierProps> = {}) {
  const props: UpdateNotifierProps = {
    currentVersion: "1.0.0",
    checkForUpdate: vi.fn().mockResolvedValue(RELEASE),
    getLastCheck: () => ({ lastCheckedAt: null, dismissedVersion: null }),
    onChecked: vi.fn(),
    downloadAndInstallApk: vi.fn().mockResolvedValue(undefined),
    onDismissVersion: vi.fn(),
    ...overrides,
  };
  let tree!: ReactTestRenderer;
  await act(async () => {
    tree = create(<UpdateNotifier {...props} />);
    await flushAsync();
  });
  return { tree, props };
}

type Instance = ReactTestRenderer["root"];

function textOf(node: Instance) {
  return node
    .findAllByType(Text)
    .map((t) => propsOf<{ children: unknown }>(t).children)
    .flat()
    .join("");
}

function texts(tree: ReactTestRenderer) {
  return textOf(tree.root);
}

async function press(tree: ReactTestRenderer, label: string) {
  const button = tree.root
    .findAllByType(Pressable)
    .find((p) => textOf(p) === label);
  if (!button) throw new Error(`No "${label}" button`);
  await act(async () => {
    propsOf<{ onPress: () => void }>(button).onPress();
    await flushAsync();
  });
}

describe("UpdateNotifier", () => {
  it("announces a newer release with Install / Ignore", async () => {
    const { tree } = await render();
    expect(texts(tree)).toContain("Version 2.0.0 disponible");
    expect(texts(tree)).toContain("Installer");
    expect(texts(tree)).toContain("Ignorer");
  });

  it("does not check while disabled", async () => {
    const checkForUpdate = vi.fn().mockResolvedValue(RELEASE);
    const { tree } = await render({ enabled: false, checkForUpdate });
    expect(checkForUpdate).not.toHaveBeenCalled();
    expect(tree.toJSON()).toBeNull();
  });

  it("persists an ignored version and hides the banner", async () => {
    const { tree, props } = await render();
    await press(tree, "Ignorer");
    expect(props.onDismissVersion).toHaveBeenCalledWith("2.0.0");
    expect(tree.toJSON()).toBeNull();
  });

  it("installs right away, showing the download progress", async () => {
    let report: (fraction: number) => void = () => undefined;
    const downloadAndInstallApk = vi.fn(
      (_url: string, onProgress?: (fraction: number) => void) => {
        report = onProgress ?? report;
        return new Promise<void>(() => undefined);
      },
    );
    const { tree, props } = await render({ downloadAndInstallApk });

    await press(tree, "Installer");
    await act(async () => {
      report(0.42);
      await flushAsync();
    });

    expect(downloadAndInstallApk).toHaveBeenCalledWith(
      RELEASE.apkUrl,
      expect.any(Function),
    );
    expect(texts(tree)).toContain("Téléchargement de la version 2.0.0… 42%");
    expect(props.onDismissVersion).not.toHaveBeenCalled();
  });

  it("offers a retry after a failed download, then can be closed", async () => {
    const downloadAndInstallApk = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockReturnValueOnce(new Promise<void>(() => undefined))
      .mockRejectedValueOnce(new Error("network"));
    const { tree } = await render({ downloadAndInstallApk });

    await press(tree, "Installer");
    expect(texts(tree)).toContain(
      "Le téléchargement de la version 2.0.0 a échoué.",
    );

    await press(tree, "Réessayer");
    expect(downloadAndInstallApk).toHaveBeenCalledTimes(2);
    expect(texts(tree)).toContain("Téléchargement de la version 2.0.0… 0%");
  });

  it("closes the error card", async () => {
    const downloadAndInstallApk = vi
      .fn()
      .mockRejectedValue(new Error("network"));
    const { tree } = await render({ downloadAndInstallApk });

    await press(tree, "Installer");
    await press(tree, "Fermer");
    expect(tree.toJSON()).toBeNull();
  });

  it("goes back to idle once the installer has taken over", async () => {
    const { tree } = await render();
    await press(tree, "Installer");
    expect(tree.toJSON()).toBeNull();
  });

  it("speaks English with locale en", async () => {
    const { tree } = await render({ locale: "en" });
    expect(texts(tree)).toContain("Install");
    expect(texts(tree)).toContain("Ignore");
  });
});
