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

export function Text(props: HostProps) {
  return React.createElement("Text", props);
}

export function View(props: HostProps) {
  return React.createElement("View", props);
}

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
