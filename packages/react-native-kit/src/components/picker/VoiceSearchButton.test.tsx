import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Imported directly (not via the bare "expo-speech-recognition" specifier
// VoiceSearchButton.tsx uses) so tsc sees this stub's own types — `vi.fn()`,
// with `mockResolvedValue` etc. — instead of the real package's. Vitest's
// resolve.alias makes both resolve to the same file at runtime, so this is
// still the identical module instance the component talks to.
import {
  emitSpeechEvent,
  ExpoSpeechRecognitionModule,
  resetSpeechEventListeners,
} from "../../__mocks__/expo-speech-recognition.js";
import { screenIcons } from "../../__mocks__/screenQueries.js";

import { VoiceSearchButton } from "./VoiceSearchButton.js";

// handlePress fires and forgets its async work (to satisfy Pressable's
// void-returning onPress type), so tests flush a real macrotask tick
// afterwards to let it settle before asserting.
async function press(name = "Recherche vocale") {
  await fireEvent.press(screen.getByRole("button", { name }));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

describe("VoiceSearchButton", () => {
  beforeEach(() => {
    resetSpeechEventListeners();
    vi.clearAllMocks();
  });

  it("shows the inactive mic icon by default", async () => {
    await render(<VoiceSearchButton onResult={vi.fn()} />);
    expect(screenIcons()).toEqual(["mic-outline"]);
  });

  it("requests permission and starts recognition on press when not listening", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    await render(<VoiceSearchButton onResult={vi.fn()} lang="fr-FR" />);

    await press();

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith({
      lang: "fr-FR",
      interimResults: false,
    });
  });

  it("recognizes French by default, English with locale='en'", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });

    const { rerender } = await render(<VoiceSearchButton onResult={vi.fn()} />);
    await press();
    await rerender(<VoiceSearchButton onResult={vi.fn()} locale="en" />);
    await press("Voice search");

    expect(ExpoSpeechRecognitionModule.start.mock.calls).toEqual([
      [{ lang: "fr-FR", interimResults: false }],
      [{ lang: "en-US", interimResults: false }],
    ]);
  });

  it("localizes its default accessibility label", async () => {
    const { rerender } = await render(<VoiceSearchButton onResult={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Recherche vocale" }),
    ).toBeOnTheScreen();

    await rerender(<VoiceSearchButton onResult={vi.fn()} locale="en" />);
    expect(
      screen.getByRole("button", { name: "Voice search" }),
    ).toBeOnTheScreen();
  });

  it("does not start recognition if permission is denied", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: false,
    });
    await render(<VoiceSearchButton onResult={vi.fn()} />);

    await press();

    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
  });

  it("switches to the active icon on the start event, and reports a result via onResult", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    const onResult = vi.fn();
    await render(<VoiceSearchButton onResult={onResult} />);

    await press();
    await act(() => {
      emitSpeechEvent("start");
    });
    expect(screenIcons()).toEqual(["mic"]);
    expect(
      screen.getByRole("button", { name: "Arrêter la recherche vocale" }),
    ).toBeOnTheScreen();

    await act(() => {
      emitSpeechEvent("result", { results: [{ transcript: "pomme" }] });
    });
    expect(onResult).toHaveBeenCalledWith("pomme");
  });

  it("stops recognition on press while listening", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    await render(<VoiceSearchButton onResult={vi.fn()} />);

    await press();
    await act(() => {
      emitSpeechEvent("start");
    });
    await press("Arrêter la recherche vocale");

    expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(1);
  });

  it("ignores a result event for an instance that never requested one (cross-talk isolation)", async () => {
    const onResult = vi.fn();
    await render(<VoiceSearchButton onResult={onResult} />);

    await act(() => {
      emitSpeechEvent("result", { results: [{ transcript: "pomme" }] });
    });

    expect(onResult).not.toHaveBeenCalled();
  });
});
