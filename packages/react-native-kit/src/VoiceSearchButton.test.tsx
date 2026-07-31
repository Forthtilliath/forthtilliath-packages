/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Pressable } from "react-native";
import { act, create } from "react-test-renderer";
import { Ionicons } from "@expo/vector-icons";
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
} from "./__mocks__/expo-speech-recognition.js";
import { propsOf } from "./__mocks__/testInstance.js";
import { VoiceSearchButton } from "./VoiceSearchButton.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

// handlePress fires and forgets its async work (to satisfy Pressable's
// void-returning onPress type), so tests flush a real macrotask tick
// afterwards to let it settle before asserting.
function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function press(tree: ReturnType<typeof create>) {
  act(() => {
    propsOf<{ onPress: () => void }>(tree.root.findByType(Pressable)).onPress();
  });
  await act(() => flushAsync());
}

describe("VoiceSearchButton", () => {
  beforeEach(() => {
    resetSpeechEventListeners();
    vi.clearAllMocks();
  });

  it("shows the inactive mic icon by default", () => {
    const tree = renderTree(<VoiceSearchButton onResult={vi.fn()} />);
    expect(tree.root.findByType(Ionicons).props.name).toBe("mic-outline");
  });

  it("requests permission and starts recognition on press when not listening", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    const tree = renderTree(
      <VoiceSearchButton onResult={vi.fn()} lang="fr-FR" />,
    );

    await press(tree);

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith({
      lang: "fr-FR",
      interimResults: false,
    });
  });

  it("does not start recognition if permission is denied", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: false,
    });
    const tree = renderTree(<VoiceSearchButton onResult={vi.fn()} />);

    await press(tree);

    expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
  });

  it("switches to the active icon on the start event, and reports a result via onResult", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    const onResult = vi.fn();
    const tree = renderTree(<VoiceSearchButton onResult={onResult} />);

    await press(tree);
    act(() => {
      emitSpeechEvent("start");
    });
    expect(tree.root.findByType(Ionicons).props.name).toBe("mic");

    act(() => {
      emitSpeechEvent("result", { results: [{ transcript: "pomme" }] });
    });
    expect(onResult).toHaveBeenCalledWith("pomme");
  });

  it("stops recognition on press while listening", async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
      granted: true,
    });
    const tree = renderTree(<VoiceSearchButton onResult={vi.fn()} />);

    await press(tree);
    act(() => {
      emitSpeechEvent("start");
    });
    await press(tree);

    expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(1);
  });

  it("ignores a result event for an instance that never requested one (cross-talk isolation)", () => {
    const onResult = vi.fn();
    renderTree(<VoiceSearchButton onResult={onResult} />);

    act(() => {
      emitSpeechEvent("result", { results: [{ transcript: "pomme" }] });
    });

    expect(onResult).not.toHaveBeenCalled();
  });
});
