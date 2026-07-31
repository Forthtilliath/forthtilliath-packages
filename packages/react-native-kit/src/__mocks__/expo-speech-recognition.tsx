import { useEffect } from "react";
import type { Mock } from "vitest";
import { vi } from "vitest";

// expo-speech-recognition wraps a native module, unavailable under
// Jest/Vitest (see GlucoDose's own PickerModal.test.tsx, which mocks it the
// same way for the same reason). This version also lets tests fire events
// via `emitSpeechEvent`, to exercise VoiceSearchButton's listening-state
// transitions instead of just no-opping the module away.
export type SpeechEventName = "start" | "end" | "error" | "result";

interface SpeechResultEvent {
  results: { transcript: string }[];
}

type Handler = (event?: SpeechResultEvent) => void;

const listenersByEvent = new Map<SpeechEventName, Set<Handler>>();

export function useSpeechRecognitionEvent(
  event: SpeechEventName,
  handler: Handler,
) {
  useEffect(() => {
    let listeners = listenersByEvent.get(event);
    if (!listeners) {
      listeners = new Set();
      listenersByEvent.set(event, listeners);
    }
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps -- registers once; VoiceSearchButton's handlers only close over refs/stable setState, never stale.
  }, []);
}

export function emitSpeechEvent(
  event: SpeechEventName,
  payload?: SpeechResultEvent,
) {
  listenersByEvent.get(event)?.forEach((handler) => {
    handler(payload);
  });
}

export function resetSpeechEventListeners() {
  listenersByEvent.clear();
}

export const ExpoSpeechRecognitionModule: {
  requestPermissionsAsync: Mock;
  start: Mock;
  stop: Mock;
} = {
  requestPermissionsAsync: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};
