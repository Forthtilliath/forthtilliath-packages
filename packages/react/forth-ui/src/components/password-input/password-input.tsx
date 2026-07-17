"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@forthtilliath/shadcn-ui/components/input";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

/**
 * A password `Input` with a show/hide visibility toggle.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui-x.junwen-k.dev/docs/components/password-input
 * @see https://ktui.io/docs/toggle-password
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input
        type={visible ? "text" : "password"}
        className="w-full pr-9"
        {...props}
      />
      <button
        type="button"
        onClick={() => {
          setVisible((prev) => !prev);
        }}
        aria-label={visible ? "Hide password" : "Show password"}
        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center px-3"
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}
