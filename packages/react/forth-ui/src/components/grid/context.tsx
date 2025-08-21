import React from "react";

export const GridDebugContext = React.createContext<{
  /** If ``debug`` is enabled */
  debug?: boolean;
  isDebugActive: boolean;
}>({
  isDebugActive: false,
});

export const useGridDebugContext = () => React.useContext(GridDebugContext);
