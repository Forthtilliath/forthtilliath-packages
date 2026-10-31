import * as React from "react";

/**
 * What {@link ConfirmFn} asks: the dialog's texts and the confirm button's
 * style.
 */
export interface ConfirmOptions {
  /** Question asked, e.g. "Delete this project?". */
  title: React.ReactNode;
  /** Consequences, under the title. */
  description?: React.ReactNode;
  /** Confirm button. Defaults to the locale's. */
  confirmLabel?: string;
  /** Cancel button. Defaults to the locale's. */
  cancelLabel?: string;
  /** Styles the confirm button destructively for irreversible actions. */
  variant?: "default" | "destructive";
}

/**
 * Opens the confirmation dialog; resolves to `true` when confirmed, `false`
 * when cancelled or dismissed. Returned by `useConfirm`.
 */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/**
 * The dialog currently open, with the function settling its promise.
 * @internal
 */
export interface ConfirmState extends ConfirmOptions {
  /** Settles the promise returned by the {@link ConfirmFn} call. */
  resolve: (confirmed: boolean) => void;
}

/**
 * Provides the {@link ConfirmFn} of the nearest `ConfirmDialogProvider`; read
 * it with `useConfirm`.
 * @internal
 */
export const ConfirmContext = React.createContext<ConfirmFn | null>(null);
