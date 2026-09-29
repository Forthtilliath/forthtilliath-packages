"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@forthtilliath/shadcn-ui/components/alert-dialog";
import { buttonVariants } from "@forthtilliath/shadcn-ui/components/button";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { type UiLocale, useUiMessages } from "../../locale/locale.js";

import type { ConfirmFn, ConfirmState } from "./confirm-context.js";
import { ConfirmContext } from "./confirm-context.js";

/**
 * Provides `useConfirm`, an imperative `await confirm({...})` alternative
 * to hand-wiring an `AlertDialog`'s open state for every yes/no
 * confirmation in an app — mount once near the root.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui-x.junwen-k.dev/docs/components/confirmer
 * @see https://shuip.xyz/components/confirmation-dialog
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function ConfirmDialogProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `UiLocaleProvider`'s. Explicit text props still win.
   */
  locale?: UiLocale;
}) {
  const messages = useUiMessages(locale);
  const [state, setState] = React.useState<ConfirmState | null>(null);
  // Kept apart from `state`, so the last options stay rendered while the
  // dialog animates out (clearing them left an empty, unnamed dialog).
  const [open, setOpen] = React.useState(false);

  const confirm = React.useCallback<ConfirmFn>((options) => {
    return new Promise((resolve) => {
      setState({ ...options, resolve });
      setOpen(true);
    });
  }, []);

  function settle(confirmed: boolean) {
    state?.resolve(confirmed);
    setOpen(false);
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            settle(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state?.title}</AlertDialogTitle>
            {state?.description !== undefined && (
              <AlertDialogDescription>
                {state.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {state?.cancelLabel ?? messages.confirmDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                settle(true);
              }}
              className={cn(
                state?.variant === "destructive" &&
                  buttonVariants({ variant: "destructive" }),
              )}
            >
              {state?.confirmLabel ?? messages.confirmDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext>
  );
}
