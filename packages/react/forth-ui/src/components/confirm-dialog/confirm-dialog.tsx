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

import type { ConfirmFn, ConfirmState } from "./confirm-context";
import { ConfirmContext } from "./confirm-context";

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
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<ConfirmState | null>(null);

  const confirm = React.useCallback<ConfirmFn>((options) => {
    return new Promise((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  function settle(confirmed: boolean) {
    state?.resolve(confirmed);
    setState(null);
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      <AlertDialog
        open={state !== null}
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
              {state?.cancelLabel ?? "Cancel"}
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
              {state?.confirmLabel ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext>
  );
}
