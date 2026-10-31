"use client";

import React from "react";

/**
 * Debug state a {@link Grid} shares with its `GridItem`s.
 * @internal
 */
export const GridDebugContext = React.createContext<{
  /** If ``debug`` is enabled */
  debug?: boolean;
  isDebugActive: boolean;
}>({
  isDebugActive: false,
});

/**
 * Reads the debug state of the enclosing {@link Grid}.
 * @returns `debug` (the grid's prop) and `isDebugActive` (toggled with the
 *   debug key).
 * @internal
 */
export const useGridDebugContext = () => React.use(GridDebugContext);
