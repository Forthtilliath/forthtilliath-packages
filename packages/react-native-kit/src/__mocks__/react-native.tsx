/* eslint-disable react-refresh/only-export-components -- this is a test-only mock module, never loaded by a dev server, not subject to Fast Refresh */
import * as React from "react";

// react-native's real package entry uses newer Flow syntax that
// @babel/parser's flow plugin cannot parse (confirmed: `as Cast` casts are
// unsupported even with parserOpts.plugins: ["flow"]), so Vitest can never
// load the real package. Tests alias "react-native" to this minimal stub
// instead (see vitest.config.ts resolve.alias) — components only need to
// behave like plain host elements for react-test-renderer's tree assertions,
// never like real native views.
export function Text({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: unknown;
}) {
  return React.createElement("Text", { style }, children);
}

export function View({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: unknown;
}) {
  return React.createElement("View", { style }, children);
}

export function Image({
  source,
  style,
}: {
  source?: unknown;
  style?: unknown;
}) {
  return React.createElement("Image", { source, style });
}

export function Pressable({
  children,
  style,
  onPress,
  ...rest
}: {
  children?: React.ReactNode;
  style?: unknown;
  onPress?: () => void;
} & Record<string, unknown>) {
  return React.createElement(
    "Pressable",
    { style, onPress, ...rest },
    children,
  );
}

export function Modal({
  visible,
  children,
}: {
  visible?: boolean;
  children?: React.ReactNode;
}) {
  return visible ? React.createElement(React.Fragment, null, children) : null;
}

export function TextInput({
  value,
  onChangeText,
  ...rest
}: {
  value?: string;
  onChangeText?: (text: string) => void;
} & Record<string, unknown>) {
  return React.createElement("TextInput", { value, onChangeText, ...rest });
}

interface Section<T> {
  title: string | null;
  data: T[];
}

export function SectionList<T>({
  sections,
  keyExtractor,
  ListHeaderComponent,
  ListEmptyComponent,
  renderSectionHeader,
  renderItem,
}: {
  sections: Section<T>[];
  keyExtractor: (item: T) => string;
  ListHeaderComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  renderSectionHeader?: (info: { section: Section<T> }) => React.ReactNode;
  renderItem: (info: { item: T }) => React.ReactNode;
}) {
  const isEmpty = sections.every((section) => section.data.length === 0);
  return React.createElement(
    View,
    null,
    ListHeaderComponent,
    isEmpty
      ? ListEmptyComponent
      : sections.map((section) =>
          React.createElement(
            React.Fragment,
            // Only one section has a null title (the ungrouped/flat case),
            // so title is unique enough here without an index.
            { key: section.title ?? "" },
            renderSectionHeader?.({ section }),
            section.data.map((item) =>
              React.createElement(
                React.Fragment,
                { key: keyExtractor(item) },
                renderItem({ item }),
              ),
            ),
          ),
        ),
  );
}

// Tests import this directly (aliased "react-native") to control what
// useColorScheme() returns, the same way they use `Alert` to spy on alerts.
export const mockColorScheme: { value: "light" | "dark" | null } = {
  value: "light",
};

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix -- must be named useColorScheme to stand in for react-native's real hook of that name
export function useColorScheme() {
  return mockColorScheme.value;
}

export interface AlertButton {
  text?: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export const Alert = {
  // Tests spy on this via `vi.spyOn(Alert, "alert")` — real callers (see
  // confirmDestructive.ts) type-check against the real react-native's
  // Alert.alert, not this stub, so this can safely take no parameters.
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- intentional no-op stub
  alert() {},
};
