/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import type { ReactTestInstance } from "react-test-renderer";

// react-test-renderer types every TestInstance's `.props` as `any` — this
// cast boundary lets test files call `propsOf<{ onPress: () => void }>(...).onPress()`
// without an unsafe-call warning at every call site.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- single-use type parameter is the point of this assertion helper
export function propsOf<T>(instance: ReactTestInstance): T {
  return instance.props as T;
}
