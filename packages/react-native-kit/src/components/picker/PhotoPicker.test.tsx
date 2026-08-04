/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Alert, Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Imported directly (not via the bare "expo-image-picker" specifier
// PhotoPicker.tsx uses) so tsc sees this stub's own `vi.fn()` types instead
// of the real package's. Vitest's resolve.alias makes both resolve to the
// same file at runtime, so this is still the identical module instance.
import * as ImagePicker from "../../__mocks__/expo-image-picker.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { PhotoPicker } from "./PhotoPicker.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

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
function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function pressActionSheetButton(
  alertSpy: { mock: { calls: unknown[][] } },
  label: string,
) {
  lastAlertButtons(alertSpy)
    ?.find((b) => b.text === label)
    ?.onPress?.();
  await flushAsync();
}

describe("PhotoPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the placeholder when there is no photo", () => {
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="of the item"
      />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts.some((t) => t.props.children === "Ajouter une photo")).toBe(
      true,
    );
  });

  it("shows the preview and a remove link when there is a photo", () => {
    const tree = renderTree(
      <PhotoPicker
        photoUri="file://photo.jpg"
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="of the item"
      />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts.some((t) => t.props.children === "Retirer la photo")).toBe(
      true,
    );
  });

  it("opens an action sheet on press", () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="of the item"
      />,
    );

    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });

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
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={onChange}
        savePhoto={savePhoto}
        photoLabel="of the item"
      />,
    );

    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });
    await act(async () => {
      await pressActionSheetButton(alertSpy, "Prendre une photo");
    });

    expect(savePhoto).toHaveBeenCalledWith("file://raw.jpg");
    expect(onChange).toHaveBeenCalledWith("file://saved.jpg");
  });

  it("does not launch the camera when permission is denied", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
      granted: false,
    });
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="of the item"
      />,
    );

    act(() => {
      propsOf<{ onPress: () => void }>(
        tree.root.findByType(Pressable),
      ).onPress();
    });
    await act(async () => {
      await pressActionSheetButton(alertSpy, "Prendre une photo");
    });

    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  });

  it("calls onChange(null) when removing the photo", () => {
    const onChange = vi.fn();
    const tree = renderTree(
      <PhotoPicker
        photoUri="file://photo.jpg"
        onChange={onChange}
        savePhoto={vi.fn()}
        photoLabel="of the item"
      />,
    );

    act(() => {
      const removeButton = tree.root.findAllByType(Pressable)[1];
      if (removeButton)
        propsOf<{ onPress: () => void }>(removeButton).onPress();
    });

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
