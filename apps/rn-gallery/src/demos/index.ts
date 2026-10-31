import type { ComponentType } from "react";

import { BottomSheetDemo } from "./BottomSheetDemo";
import { ButtonDemo } from "./ButtonDemo";
import { EmptyStateDemo } from "./EmptyStateDemo";
import { ReorderListDemo } from "./ReorderListDemo";
import { SectionDemo } from "./SectionDemo";
import { TextFieldDemo } from "./TextFieldDemo";
import { ToastDemo } from "./ToastDemo";

/** Each id is also the screenshot's file name (`docs/screenshots/<id>.png`). */
export const DEMOS: Record<string, ComponentType> = {
  button: ButtonDemo,
  "text-field": TextFieldDemo,
  "section-title": SectionDemo,
  "empty-state": EmptyStateDemo,
  toast: ToastDemo,
  "reorder-list": ReorderListDemo,
  "bottom-sheet-header": BottomSheetDemo,
};
