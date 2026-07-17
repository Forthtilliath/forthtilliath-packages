"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Spinner } from "../spinner";

export interface LoadingState {
  text: string;
}

export interface MultiStepLoaderProps {
  /** The sequence of messages to display, one at a time. */
  loadingStates: LoadingState[];
  /** Whether the overlay is shown at all. */
  loading: boolean;
  /**
   * Milliseconds between each state transition.
   * @default 2000
   */
  duration?: number;
  /**
   * Restarts from the first state after reaching the last one.
   * @default true
   */
  loop?: boolean;
  /**
   * Controls which state is active by index, instead of advancing on a
   * timer — pairs with real progress you're already tracking (e.g. one
   * state per upload/step actually completing).
   */
  value?: number;
  className?: string;
}

/**
 * A full-screen overlay stepping through a sequence of loading messages —
 * for operations that take long enough that a single spinner reads as
 * stuck (multi-stage setup wizards, long uploads, batch processing).
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.aceternity.com/components/multi-step-loader
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function MultiStepLoader({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
  value,
  className,
}: MultiStepLoaderProps) {
  const [currentState, setCurrentState] = React.useState(0);
  const isControlled = value !== undefined;

  // Reset to the first state whenever `loading` flips, adjusted during
  // render (React's documented pattern for this) rather than in an effect,
  // which would cause an extra cascading render.
  const [prevLoading, setPrevLoading] = React.useState(loading);
  if (loading !== prevLoading) {
    setPrevLoading(loading);
    if (loading) {
      setCurrentState(0);
    }
  }

  React.useEffect(() => {
    if (!loading || isControlled) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentState((previous) => {
        if (previous === loadingStates.length - 1) {
          return loop ? 0 : previous;
        }
        return previous + 1;
      });
    }, duration);
    return () => {
      clearInterval(interval);
    };
  }, [loading, isControlled, duration, loop, loadingStates.length]);

  if (!loading) {
    return null;
  }

  const activeIndex = value ?? currentState;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        {loadingStates.map((state, index) => (
          <div
            key={state.text}
            className={cn(
              "flex items-center gap-2 text-sm",
              index < activeIndex && "text-muted-foreground line-through",
              index === activeIndex && "text-foreground font-medium",
              index > activeIndex && "text-muted-foreground/50",
            )}
          >
            {index < activeIndex ? (
              <CheckIcon className="size-4 text-green-600" />
            ) : index === activeIndex ? (
              <Spinner size="sm" />
            ) : (
              <span className="size-4" />
            )}
            {state.text}
          </div>
        ))}
      </div>
    </div>
  );
}
