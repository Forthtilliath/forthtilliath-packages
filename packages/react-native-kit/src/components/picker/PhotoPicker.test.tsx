import { Alert } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Imported directly (not via the bare "expo-image-picker" specifier
// PhotoPicker.tsx uses) so tsc sees this stub's own `vi.fn()` types instead
// of the real package's. Vitest's resolve.alias makes both resolve to the
// same file at runtime, so this is still the identical module instance.
import * as ImagePicker from "../../__mocks__/expo-image-picker.js";

import { PhotoPicker } from "./PhotoPicker.js";

interface ActionSheetButton {
  text?: string;
  onPress?: () => void;
}

function lastAlertButtons(alertSpy: {
  mock: { calls: unknown[][] };
}): ActionSheetButton[] | undefined {
  return alertSpy.mock.calls.at(-1)?.[2] as ActionSheetButton[] | undefined;
}

// PhotoPicker's action-sheet buttons fire-and-forget their async work (to
// satisfy Alert's void-returning onPress type), so tests flush a real
// macrotask tick afterwards to let it settle before asserting.
async function pressActionSheetButton(
  alertSpy: { mock: { calls: unknown[][] } },
  label: string,
) {
  await act(async () => {
    lastAlertButtons(alertSpy)
      ?.find((b) => b.text === label)
      ?.onPress?.();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

const addButton = () =>
  screen.getByRole("button", { name: "Ajouter une photo of the item" });

function renderPicker(props: Partial<Parameters<typeof PhotoPicker>[0]> = {}) {
  return render(
    <PhotoPicker
      photoUri={null}
      onChange={vi.fn()}
      savePhoto={vi.fn()}
      photoLabel="of the item"
      {...props}
    />,
  );
}

describe("PhotoPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the placeholder when there is no photo", async () => {
    await renderPicker();
    expect(screen.getByText("Ajouter une photo")).toBeOnTheScreen();
    expect(screen.queryByText("Retirer la photo")).not.toBeOnTheScreen();
  });

  it("shows the preview and a remove link when there is a photo", async () => {
    await renderPicker({ photoUri: "file://photo.jpg" });
    expect(
      screen.getByRole("button", { name: "Photo of the item. Modifier." }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "Retirer la photo" }),
    ).toBeOnTheScreen();
  });

  it("opens an action sheet on press", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    await renderPicker();

    await fireEvent.press(addButton());

    expect(alertSpy).toHaveBeenCalledWith(
      "Photo of the item",
      undefined,
      expect.any(Array),
    );
  });

  it("saves and reports the picked camera photo when permission is granted", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    ImagePicker.launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://raw.jpg" }],
    });
    const savePhoto = vi.fn().mockResolvedValue("file://saved.jpg");
    const onChange = vi.fn();
    await renderPicker({ onChange, savePhoto });

    await fireEvent.press(addButton());
    await pressActionSheetButton(alertSpy, "Prendre une photo");

    expect(savePhoto).toHaveBeenCalledWith("file://raw.jpg");
    expect(onChange).toHaveBeenCalledWith("file://saved.jpg");
  });

  it("does not launch the camera when permission is denied", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      granted: false,
    });
    await renderPicker();

    await fireEvent.press(addButton());
    await pressActionSheetButton(alertSpy, "Prendre une photo");

    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  });

  it("picks from the library without requesting any permission", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://raw.jpg" }],
    });
    const savePhoto = vi.fn().mockResolvedValue("file://saved.jpg");
    const onChange = vi.fn();
    await renderPicker({ onChange, savePhoto });

    await fireEvent.press(addButton());
    await pressActionSheetButton(alertSpy, "Choisir dans la galerie");

    expect(
      ImagePicker.requestMediaLibraryPermissionsAsync,
    ).not.toHaveBeenCalled();
    expect(savePhoto).toHaveBeenCalledWith("file://raw.jpg");
    expect(onChange).toHaveBeenCalledWith("file://saved.jpg");
  });

  it("calls onChange(null) when removing the photo", async () => {
    const onChange = vi.fn();
    await renderPicker({ photoUri: "file://photo.jpg", onChange });

    await fireEvent.press(
      screen.getByRole("button", { name: "Retirer la photo" }),
    );

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
