import * as React from "react";

export interface ConfirmOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button destructively for irreversible actions. */
  variant?: "default" | "destructive";
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export interface ConfirmState extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

export const ConfirmContext = React.createContext<ConfirmFn | null>(null);
