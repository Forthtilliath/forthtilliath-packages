"use client";

import { useFormStatus } from "react-dom";

import type { ButtonProps } from "../button";
import { Button } from "../button";

export type SubmitButtonProps = Omit<ButtonProps, "type" | "loading">;

/**
 * A submit `Button` that shows its own loading state automatically while
 * its parent `<form>` is submitting — via React's `useFormStatus`, so no
 * manual pending-state prop drilling is needed (unlike `Button`'s own
 * `loading`, which the caller controls explicitly).
 *
 * Must be rendered as a descendant of a `<form>` — `useFormStatus` reads
 * that nearest parent form's pending state.
 *
 * @see https://shuip.xyz/components/submit-button
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} {...props} />;
}
