import type React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperStep {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** The current step, 0-indexed. Steps before it are complete. */
  value: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * A numbered sequence of steps for a multi-stage flow (checkout, onboarding,
 * setup wizards), showing completed/current/upcoming state.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://originui.com/stepper
 * @see https://ktui.io/docs/stepper
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Stepper({
  steps,
  value,
  orientation = "horizontal",
  className,
}: StepperProps) {
  return (
    <ol
      data-slot="stepper"
      className={cn(
        "flex",
        orientation === "horizontal" ? "w-full flex-row" : "flex-col",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isComplete = index < value;
        const isCurrent = index === value;
        const isLast = index === steps.length - 1;

        return (
          <li
            // eslint-disable-next-line @eslint-react/no-array-index-key -- `label` is an arbitrary ReactNode with no guaranteed unique field
            key={index}
            className={cn(
              "flex",
              orientation === "horizontal"
                ? "flex-1 flex-col items-center"
                : "flex-row gap-3",
              !isLast && orientation === "horizontal" && "relative",
            )}
          >
            <div
              className={cn(
                "flex items-center",
                orientation === "horizontal" ? "w-full" : "flex-col",
              )}
            >
              <span
                data-state={
                  isComplete ? "complete" : isCurrent ? "current" : "upcoming"
                }
                className={cn(
                  "border-input text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  "data-[state=complete]:bg-primary data-[state=complete]:border-primary data-[state=complete]:text-primary-foreground",
                  "data-[state=current]:border-primary data-[state=current]:text-primary",
                )}
              >
                {isComplete ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  data-state={isComplete ? "complete" : "upcoming"}
                  className={cn(
                    "bg-border data-[state=complete]:bg-primary shrink-0",
                    orientation === "horizontal"
                      ? "mx-2 h-px flex-1"
                      : "my-1 ml-4 h-6 w-px",
                  )}
                />
              )}
            </div>
            <div
              className={cn(
                orientation === "horizontal" ? "mt-2 text-center" : "pb-6",
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {step.description !== undefined && (
                <p className="text-muted-foreground text-xs">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
