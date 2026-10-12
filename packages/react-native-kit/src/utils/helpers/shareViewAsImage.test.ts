import type { RefObject } from "react";
import type { View } from "react-native";
import { NativeModules, TurboModuleRegistry } from "react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const captureRef = vi.hoisted(() =>
  vi.fn<(view: unknown, options: unknown) => Promise<string>>(),
);
vi.mock("react-native-view-shot", () => ({ captureRef }));

const shareFile = vi.hoisted(() =>
  vi.fn<(uri: string, options: unknown) => Promise<void>>(),
);
vi.mock("./shareFile.js", () => ({ shareFile }));

const { isNativeModuleAvailable } =
  await import("./isNativeModuleAvailable.js");
const { shareViewAsImage } = await import("./shareViewAsImage.js");

const modules = NativeModules as Record<string, unknown>;
const view = { current: null } as RefObject<View | null>;

beforeEach(() => {
  captureRef.mockReset().mockResolvedValue("file:///cache/shot.png");
  shareFile.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  delete modules.RNViewShot;
  vi.restoreAllMocks();
});

describe("isNativeModuleAvailable", () => {
  it("finds a module of either architecture", () => {
    expect(isNativeModuleAvailable("RNViewShot")).toBe(false);

    modules.RNViewShot = {};
    expect(isNativeModuleAvailable("RNViewShot")).toBe(true);
    delete modules.RNViewShot;

    vi.spyOn(TurboModuleRegistry, "get").mockReturnValue({});
    expect(isNativeModuleAvailable("RNViewShot")).toBe(true);
  });
});

describe("shareViewAsImage", () => {
  it("captures the view as a PNG and shares it", async () => {
    modules.RNViewShot = {};
    await shareViewAsImage(view, { dialogTitle: "Partager le classement" });

    expect(captureRef).toHaveBeenCalledWith(view, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
    expect(shareFile).toHaveBeenCalledWith("file:///cache/shot.png", {
      dialogTitle: "Partager le classement",
      mimeType: "image/png",
    });
  });

  it("throws a user-facing message when the binary can't capture", async () => {
    await expect(shareViewAsImage(view)).rejects.toThrow(
      "Le partage en image n'est pas disponible dans cette version de l'app.",
    );
    await expect(shareViewAsImage(view, { locale: "en" })).rejects.toThrow(
      "Sharing as an image isn't available in this version of the app.",
    );
    await expect(
      shareViewAsImage(view, { captureUnavailableMessage: "Nope" }),
    ).rejects.toThrow("Nope");
    expect(captureRef).not.toHaveBeenCalled();
  });
});
