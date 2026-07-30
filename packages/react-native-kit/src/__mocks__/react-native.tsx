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
