import * as React from "react";

// Like react-native itself, react-native-gesture-handler's package entry
// uses Flow syntax @babel/parser can't parse. Tests alias it to this minimal
// stub instead (see vitest.config.ts resolve.alias) — SwipeableRow only needs
// a component that renders its children and right-action render prop, and
// exposes a no-op close() via ref.
export interface SwipeableHandle {
  close: () => void;
}

export interface SwipeableProps {
  children?: React.ReactNode;
  renderRightActions?: () => React.ReactNode;
  ref?: React.Ref<SwipeableHandle>;
}

// DragHandle uses gesture-handler's Pressable; a plain host element is enough
// for tree assertions, like react-native's own Pressable stub.
export function Pressable({
  children,
  ...rest
}: { children?: React.ReactNode } & Record<string, unknown>) {
  return React.createElement("GHPressable", rest, children);
}

export function Swipeable({
  children,
  renderRightActions,
  ref,
}: SwipeableProps) {
  React.useImperativeHandle(ref, () => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- intentional no-op stub
    close() {},
  }));
  return React.createElement(
    React.Fragment,
    null,
    renderRightActions?.(),
    children,
  );
}
