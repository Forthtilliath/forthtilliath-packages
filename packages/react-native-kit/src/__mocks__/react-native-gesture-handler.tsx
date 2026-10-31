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

// DragHandle uses gesture-handler's Pressable, which renders like
// react-native's own (an accessible View): reuse that stub.
export { Pressable } from "react-native";

export function Swipeable({
  children,
  renderRightActions,
  ref,
}: SwipeableProps) {
  React.useImperativeHandle(ref, () => ({ close: () => undefined }));
  return React.createElement(
    React.Fragment,
    null,
    renderRightActions?.(),
    children,
  );
}
