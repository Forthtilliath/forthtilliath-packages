/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import * as React from "react";
import { act, create } from "react-test-renderer";

// Minimal renderHook, local to this package: no @testing-library/react-native
// dependency (which would drag in assumptions about the real react-native
// package our tests already can't load — see src/__mocks__/react-native.tsx).
// `callback` is called again on every render, so it should read from the
// caller's own mutable closure (e.g. a `let` reassigned before `rerender()`)
// to exercise a hook with changing arguments across renders.
export function renderHook<T>(callback: () => T) {
  const result: { current: T } = { current: undefined as unknown as T };

  function TestComponent() {
    result.current = callback();
    return null;
  }

  let tree: ReturnType<typeof create>;
  act(() => {
    tree = create(React.createElement(TestComponent));
  });

  return {
    result,
    rerender: () => {
      act(() => {
        tree.update(React.createElement(TestComponent));
      });
    },
    unmount: () => {
      act(() => {
        tree.unmount();
      });
    },
  };
}
