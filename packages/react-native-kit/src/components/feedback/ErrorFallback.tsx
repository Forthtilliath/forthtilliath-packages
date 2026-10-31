import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/**
 * Per-slot style overrides for {@link ErrorFallback}, each merged after its
 * default.
 */
export interface ErrorFallbackStyles {
  /** The full-screen, centered container (its background included). */
  container?: StyleProp<ViewStyle>;
  /** The big emoji at the top. */
  emoji?: StyleProp<TextStyle>;
  /** The title. */
  title?: StyleProp<TextStyle>;
  /** The explanation under it. */
  hint?: StyleProp<TextStyle>;
  /** The retry button. */
  button?: StyleProp<ViewStyle>;
  /** The retry button's label. */
  buttonText?: StyleProp<TextStyle>;
  /** The scrollable box showing the error message. */
  detailsBox?: StyleProp<ViewStyle>;
  /** The details box's content container (its padding). */
  detailsContent?: StyleProp<ViewStyle>;
  /** The error message in the details box. */
  detailsText?: StyleProp<TextStyle>;
}

/** The fallback's texts; each defaults to the locale's. */
export interface ErrorFallbackLabels {
  /** Emoji at the top. Default: 😕. */
  emoji: string;
  /** Title. Default: "Une erreur est survenue" / "Something went wrong". */
  title: string;
  /** Explanation under the title, inviting to retry. */
  hint: string;
  /** Label of the retry button. Default: "Réessayer" / "Try again". */
  retry: string;
}

/**
 * Props of {@link ErrorFallback} (Expo Router's `ErrorBoundaryProps` fit as
 * is).
 */
export interface ErrorFallbackProps {
  /** The error that was thrown; its message shows in the details box. */
  error: Error;
  /**
   * Re-renders the failed tree — Expo Router's `retry`, or a boundary's reset.
   */
  retry: () => void | Promise<void>;
  /** Overrides some or all of the texts — see {@link ErrorFallbackLabels}. */
  labels?: Partial<ErrorFallbackLabels>;
  /**
   * Language of the default texts — French by default, or the nearest
   * `KitLocaleProvider`'s.
   */
  locale?: KitLocale;
  /**
   * Show `error.message` in a small box under the button.
   *
   * @defaultValue true
   */
  showDetails?: boolean;
  /** Per-slot style overrides — see {@link ErrorFallbackStyles}. */
  styles?: ErrorFallbackStyles;
}

const defaultLabels: Record<KitLocale, ErrorFallbackLabels> = {
  fr: {
    emoji: "😕",
    title: "Une erreur est survenue",
    hint: "Désolé, quelque chose s'est mal passé. Réessaie ci-dessous.",
    retry: "Réessayer",
  },
  en: {
    emoji: "😕",
    title: "Something went wrong",
    hint: "Sorry, something broke. Try again below.",
    retry: "Try again",
  },
};

const defaultStyles = {
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  } satisfies ViewStyle,
  emoji: { fontSize: 40, marginBottom: 12 } satisfies TextStyle,
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#111111",
  } satisfies TextStyle,
  hint: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
    color: "#111111",
  } satisfies TextStyle,
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    marginBottom: 24,
  } satisfies ViewStyle,
  buttonText: { color: "#ffffff", fontWeight: "700" } satisfies TextStyle,
  detailsBox: {
    maxHeight: 120,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "rgba(128,128,128,0.08)",
  } satisfies ViewStyle,
  detailsContent: { padding: 12 } satisfies ViewStyle,
  detailsText: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "monospace",
    color: "#111111",
  } satisfies TextStyle,
};

/**
 * A readable crash screen with a retry button, to replace Expo Router's
 * default error screen (black background, raw message, meant for
 * development). Export it as a route's `ErrorBoundary`, or render it from any
 * error boundary.
 *
 * @example
 * ```tsx
 * // app/_layout.tsx
 * import { ErrorFallback } from
 * "@forthtilliath/react-native-kit/components/feedback/ErrorFallback";
 *
 * export function ErrorBoundary(props: ErrorBoundaryProps) {
 *   return <ErrorFallback {...props} />;
 * }
 * ```
 */
export function ErrorFallback({
  error,
  retry,
  labels,
  locale,
  showDetails = true,
  styles,
}: ErrorFallbackProps) {
  const texts = { ...defaultLabels[useKitLocale(locale)], ...labels };
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.container}>
      <Text style={merged.emoji}>{texts.emoji}</Text>
      <Text style={merged.title}>{texts.title}</Text>
      <Text style={merged.hint}>{texts.hint}</Text>
      <Pressable
        style={merged.button}
        accessibilityRole="button"
        onPress={() => {
          void retry();
        }}
      >
        <Text style={merged.buttonText}>{texts.retry}</Text>
      </Pressable>
      {showDetails && (
        <ScrollView
          style={merged.detailsBox}
          contentContainerStyle={merged.detailsContent}
        >
          <Text style={merged.detailsText}>{error.message}</Text>
        </ScrollView>
      )}
    </View>
  );
}
