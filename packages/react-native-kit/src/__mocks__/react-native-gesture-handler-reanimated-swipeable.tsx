/* eslint-disable react-refresh/only-export-components -- a test stub, never hot-reloaded */
import type * as React from "react";

// react-native-gesture-handler/ReanimatedSwipeable needs Reanimated's native
// runtime, unavailable under Vitest (and the package entry ships Flow syntax
// anyway, see ./react-native-gesture-handler.tsx). Tests alias it to this
// stub: it renders the right actions (with a spy-able close()) then the row.

export interface SwipeableMethods {
  close: () => void;
  openLeft: () => void;
  openRight: () => void;
  reset: () => void;
}

export interface SwipeableProps {
  children?: React.ReactNode;
  renderRightActions?: (
    progress: unknown,
    translation: unknown,
    swipeableMethods: SwipeableMethods,
  ) => React.ReactNode;
}

/** The `close()` handed to `renderRightActions`, shared so tests can assert on it. */
export const swipeableMethods: SwipeableMethods = {
  close: () => undefined,
  openLeft: () => undefined,
  openRight: () => undefined,
  reset: () => undefined,
};

export default function ReanimatedSwipeable({
  children,
  renderRightActions,
}: SwipeableProps) {
  return (
    <>
      {renderRightActions?.(0, 0, swipeableMethods)}
      {children}
    </>
  );
}
