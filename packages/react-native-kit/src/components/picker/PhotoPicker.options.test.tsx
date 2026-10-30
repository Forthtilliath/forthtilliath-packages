/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import { Alert, Pressable, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

// See PhotoPicker.test.tsx for why the stub is imported directly.
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

function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function openPicker(tree: ReturnType<typeof create>) {
  const [picker] = tree.root.findAllByType(Pressable);
  if (!picker) throw new Error("expected the picker");
  act(() => {
    propsOf<{ onPress: () => void }>(picker).onPress();
  });
  return picker;
}

async function chooseFromLibrary(alertSpy: { mock: { calls: unknown[][] } }) {
  const buttons = alertSpy.mock.calls.at(-1)?.[2] as
    { text?: string; onPress?: () => void }[] | undefined;
  await act(async () => {
    buttons?.find((b) => b.text === "Choisir dans la galerie")?.onPress?.();
    await flushAsync();
  });
}

describe("PhotoPicker options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://raw.jpg" }],
    });
  });

  it("renders a custom preview instead of the default ones", () => {
    const renderPreview = vi.fn((uri: string | null) => (
      <Text>{uri ?? "initiales"}</Text>
    ));
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="du joueur"
        renderPreview={renderPreview}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("initiales");
    expect(texts).not.toContain("Ajouter une photo");
    expect(renderPreview).toHaveBeenCalledWith(null, false);
  });

  it("passes a failed save to onError", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const error = new Error("disk full");
    const onError = vi.fn();
    const onChange = vi.fn();
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={onChange}
        savePhoto={vi.fn().mockRejectedValue(error)}
        photoLabel="du joueur"
        onError={onError}
      />,
    );

    openPicker(tree);
    await chooseFromLibrary(alertSpy);

    expect(onError).toHaveBeenCalledWith(error);
    expect(onChange).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  it("alerts on a failed save without onError", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn().mockRejectedValue(new Error("disk full"))}
        photoLabel="du joueur"
      />,
    );

    openPicker(tree);
    await chooseFromLibrary(alertSpy);

    expect(alertSpy).toHaveBeenLastCalledWith(
      "Photo non enregistrée",
      "La photo n'a pas pu être enregistrée. Réessaie.",
    );
  });

  it("calls onOpen when the choice opens, not while saving", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const onOpen = vi.fn();
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={() => new Promise<string>(() => undefined)}
        photoLabel="du joueur"
        onOpen={onOpen}
      />,
    );

    openPicker(tree);
    expect(onOpen).toHaveBeenCalledTimes(1);
    await chooseFromLibrary(alertSpy);
    openPicker(tree);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("ignores presses while saving", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    let finishSave: (uri: string) => void = () => undefined;
    const savePhoto = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          finishSave = resolve;
        }),
    );
    const onChange = vi.fn();
    const renderPreview = vi.fn(() => null);
    const tree = renderTree(
      <PhotoPicker
        photoUri={null}
        onChange={onChange}
        savePhoto={savePhoto}
        photoLabel="du joueur"
        renderPreview={renderPreview}
      />,
    );

    openPicker(tree);
    await chooseFromLibrary(alertSpy);
    expect(renderPreview).toHaveBeenLastCalledWith(null, true);
    const picker = openPicker(tree);
    expect(propsOf<{ disabled: boolean }>(picker).disabled).toBe(true);
    expect(alertSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishSave("file://saved.jpg");
      await flushAsync();
    });
    expect(onChange).toHaveBeenCalledWith("file://saved.jpg");
    expect(renderPreview).toHaveBeenLastCalledWith(null, false);
  });
});
