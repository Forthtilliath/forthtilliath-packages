import { useRef, useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export interface VoiceSearchButtonStyles {
  iconColor?: string;
  iconColorActive?: string;
}

export interface VoiceSearchButtonProps {
  onResult: (transcript: string) => void;
  accessibilityLabel?: string;
  stopAccessibilityLabel?: string;
  /** BCP 47 locale passed to the speech recognizer. */
  lang?: string;
  styles?: VoiceSearchButtonStyles;
}

const defaultStyles: Required<VoiceSearchButtonStyles> = {
  iconColor: "#2563eb",
  iconColorActive: "#dc2626",
};

// Microphone button to dictate a search instead of typing it. Recognition
// events are global to the native module (not scoped to one instance): more
// than one button can be mounted at the same time (e.g. a name field plus a
// search picker on the same screen). `requestedRef` distinguishes the button
// that started THIS session from other mounted instances, so only it reacts
// to the result instead of all of them.
export function VoiceSearchButton({
  onResult,
  accessibilityLabel = "Voice search",
  stopAccessibilityLabel = "Stop voice search",
  lang = "en-US",
  styles,
}: VoiceSearchButtonProps) {
  const merged = { ...defaultStyles, ...styles };
  const [isListening, setIsListening] = useState(false);
  const requestedRef = useRef(false);

  useSpeechRecognitionEvent("start", () => {
    if (requestedRef.current) setIsListening(true);
  });
  useSpeechRecognitionEvent("end", () => {
    if (requestedRef.current) {
      setIsListening(false);
      requestedRef.current = false;
    }
  });
  useSpeechRecognitionEvent("error", () => {
    if (requestedRef.current) {
      setIsListening(false);
      requestedRef.current = false;
    }
  });
  useSpeechRecognitionEvent("result", (event) => {
    if (!requestedRef.current) return;
    const transcript = event.results[0]?.transcript;
    if (transcript) onResult(transcript);
  });

  async function handlePress() {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    requestedRef.current = true;
    ExpoSpeechRecognitionModule.start({ lang, interimResults: false });
  }

  return (
    <Pressable
      onPress={() => {
        void handlePress();
      }}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isListening ? stopAccessibilityLabel : accessibilityLabel
      }
    >
      <Ionicons
        name={isListening ? "mic" : "mic-outline"}
        size={20}
        color={isListening ? merged.iconColorActive : merged.iconColor}
      />
    </Pressable>
  );
}
