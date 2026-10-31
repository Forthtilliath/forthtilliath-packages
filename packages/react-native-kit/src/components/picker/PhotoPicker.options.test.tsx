import { Alert, Text } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";

// See PhotoPicker.test.tsx for why the stub is imported directly.
import * as ImagePicker from "../../__mocks__/expo-image-picker.js";

import { PhotoPicker } from "./PhotoPicker.js";

function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const picker = () =>
  screen.getByRole("button", { name: "Ajouter une photo du joueur" });

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

  it("renders a custom preview instead of the default ones", async () => {
    const renderPreview = vi.fn((uri: string | null) => (
      <Text>{uri ?? "initiales"}</Text>
    ));
    await render(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="du joueur"
        renderPreview={renderPreview}
      />,
    );
    expect(screen.getByText("initiales")).toBeOnTheScreen();
    expect(screen.queryByText("Ajouter une photo")).not.toBeOnTheScreen();
    expect(renderPreview).toHaveBeenCalledWith(null, false);
  });

  it("passes a failed save to onError", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const error = new Error("disk full");
    const onError = vi.fn();
    const onChange = vi.fn();
    await render(
      <PhotoPicker
        photoUri={null}
        onChange={onChange}
        savePhoto={vi.fn().mockRejectedValue(error)}
        photoLabel="du joueur"
        onError={onError}
      />,
    );

    await fireEvent.press(picker());
    await chooseFromLibrary(alertSpy);

    expect(onError).toHaveBeenCalledWith(error);
    expect(onChange).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });

  it("alerts on a failed save without onError", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    await render(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn().mockRejectedValue(new Error("disk full"))}
        photoLabel="du joueur"
      />,
    );

    await fireEvent.press(picker());
    await chooseFromLibrary(alertSpy);

    expect(alertSpy).toHaveBeenLastCalledWith(
      "Photo non enregistrée",
      "La photo n'a pas pu être enregistrée. Réessaie.",
    );
  });

  it("calls onOpen when the choice opens, not while saving", async () => {
    const alertSpy = vi.spyOn(Alert, "alert");
    const onOpen = vi.fn();
    await render(
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={() => new Promise<string>(() => undefined)}
        photoLabel="du joueur"
        onOpen={onOpen}
      />,
    );

    await fireEvent.press(picker());
    expect(onOpen).toHaveBeenCalledTimes(1);
    await chooseFromLibrary(alertSpy);
    await fireEvent.press(picker());
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
    await render(
      <PhotoPicker
        photoUri={null}
        onChange={onChange}
        savePhoto={savePhoto}
        photoLabel="du joueur"
        renderPreview={renderPreview}
      />,
    );

    await fireEvent.press(picker());
    await chooseFromLibrary(alertSpy);
    expect(renderPreview).toHaveBeenLastCalledWith(null, true);
    expect(picker()).toBeDisabled();
    expect(picker()).toBeBusy();
    await fireEvent.press(picker());
    expect(alertSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishSave("file://saved.jpg");
      await flushAsync();
    });
    expect(onChange).toHaveBeenCalledWith("file://saved.jpg");
    expect(renderPreview).toHaveBeenLastCalledWith(null, false);
  });
});
