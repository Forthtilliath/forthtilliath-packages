/* eslint-disable react-refresh/only-export-components -- this is a test-only mock module, never loaded by a dev server, not subject to Fast Refresh */
import * as React from "react";

// react-native's real package entry uses newer Flow syntax that
// @babel/parser's flow plugin cannot parse (confirmed: `as Cast` casts are
// unsupported even with parserOpts.plugins: ["flow"]), so Vitest can never
// load the real package. Tests alias "react-native" to this stub instead (see
// vitest.config.ts resolve.alias). Each component renders the host element
// the real one renders, with every prop passed through, so
// @testing-library/react-native finds roles, labels, text and handlers the
// way it does on a device.
type HostProps = Record<string, unknown> & { children?: React.ReactNode };

function hostComponent(name: string) {
  return function HostComponent(props: HostProps) {
    return React.createElement(name, props);
  };
}

export * from "./react-native-extra.js";

export const Text = hostComponent("Text");
export const View = hostComponent("View");
export const ScrollView = hostComponent("ScrollView");
export const Image = hostComponent("Image");
export const TextInput = hostComponent("TextInput");
export const ActivityIndicator = hostComponent("ActivityIndicator");

interface PressState {
  pressed: boolean;
}

/**
 * Like the real one: an accessible `View`, `disabled` reported in its
 * accessibility state and declining the touch (so a press does nothing).
 */
export function Pressable({
  children,
  style,
  disabled,
  accessibilityState,
  ...rest
}: Omit<HostProps, "children"> & {
  children?: React.ReactNode | ((state: PressState) => React.ReactNode);
  style?: object | null | ((state: PressState) => unknown);
  disabled?: boolean | null;
  accessibilityState?: Record<string, unknown>;
}) {
  const idle = { pressed: false };
  return React.createElement(
    "View",
    {
      accessible: true,
      ...rest,
      accessibilityState: { ...accessibilityState, disabled: !!disabled },
      style: typeof style === "function" ? style(idle) : style,
      onStartShouldSetResponder: () => !disabled,
    },
    typeof children === "function" ? children(idle) : children,
  );
}

export function Modal({ visible = true, ...props }: HostProps) {
  return visible ? React.createElement("Modal", { visible, ...props }) : null;
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

/** Like the real one: a "switch" whose state follows `value`. */
export function Switch({
  value,
  disabled,
  accessibilityState,
  ...rest
}: HostProps & {
  value?: boolean;
  disabled?: boolean;
  accessibilityState?: Record<string, unknown>;
}) {
  return React.createElement("Switch", {
    accessibilityRole: "switch",
    ...rest,
    value,
    disabled,
    accessibilityState: {
      ...accessibilityState,
      checked: !!value,
      disabled: !!disabled,
    },
    onStartShouldSetResponder: () => !disabled,
  });
}

export const Linking = {
  // Tests spy on this via `vi.spyOn(Linking, "openURL")`, the same way they
  // use `Alert.alert` — see the note on `Alert` below.
  openURL() {
    return Promise.resolve();
  },
};

export interface AlertButton {
  text?: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export const Alert = {
  // Tests spy on this via `vi.spyOn(Alert, "alert")` — real callers (see
  // confirmDestructive.ts) type-check against the real react-native's
  // Alert.alert, not this stub, so this can safely take no parameters.
  alert: (): void => undefined,
};

// No native module is compiled into a test run: tests add old-architecture
// ones to `NativeModules`, or spy on `TurboModuleRegistry.get`.
export const NativeModules: Record<string, unknown> = {};

export const TurboModuleRegistry = {
  get(): unknown {
    return null;
  },
};
