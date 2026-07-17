import * as React from "react";

import type { ConfirmFn } from "./confirm-context";
import { ConfirmContext } from "./confirm-context";

/** Must be called from a descendant of `ConfirmDialogProvider`. */
export function useConfirm(): ConfirmFn {
  const confirm = React.use(ConfirmContext);
  if (confirm === null) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return confirm;
}
