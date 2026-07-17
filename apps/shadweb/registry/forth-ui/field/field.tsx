import * as React from "react";

import { cn } from "@/lib/utils";

interface FieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /**
   * `vertical` (label above the control, e.g. Input/Textarea/Select) or
   * `horizontal` (control beside the label, e.g. Checkbox/Switch).
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  className?: string;
  /** The form control — its `id`/`aria-describedby`/`aria-invalid` are wired up automatically. */
  children: React.ReactElement<FieldControlProps>;
}

/**
 * Wires a label, description and error message to a single form control —
 * consolidates the "Checkbox Field" / "Input Field" / "Radio Field" /
 * "Select Field" pattern (same label+control+description+error shape
 * applied to every control type) into one control-agnostic component,
 * independent of any form library.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://shuip.xyz/components/input-field
 * @see https://shuip.xyz/components/checkbox-field
 * @see https://shuip.xyz/components/radio-field
 * @see https://shuip.xyz/components/select-field
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Field({
  label,
  description,
  error,
  required = false,
  orientation = "vertical",
  className,
  children,
}: FieldProps) {
  const generatedId = React.useId();
  const descriptionId = React.useId();
  const errorId = React.useId();

  const describedBy =
    [
      description !== undefined ? descriptionId : null,
      error !== undefined ? errorId : null,
    ]
      .filter((value) => value !== null)
      .join(" ") || undefined;

  const controlId = children.props.id ?? generatedId;
  // cloneElement is required here (not `Slot`) since we're injecting
  // specific accessibility attributes (id/aria-describedby/aria-invalid)
  // onto an arbitrary single control, not merging arbitrary DOM props.
  // eslint-disable-next-line @eslint-react/no-clone-element
  const control = React.cloneElement(children, {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": error !== undefined,
  });

  const labelNode = label !== undefined && (
    <label htmlFor={controlId} className="text-sm leading-none font-medium">
      {label}
      {required && <span className="text-destructive"> *</span>}
    </label>
  );
  const descriptionNode = description !== undefined && (
    <p id={descriptionId} className="text-muted-foreground text-sm">
      {description}
    </p>
  );
  const errorNode = error !== undefined && (
    <p id={errorId} role="alert" className="text-destructive text-sm">
      {error}
    </p>
  );

  if (orientation === "horizontal") {
    return (
      <div
        data-slot="field"
        className={cn("flex items-start gap-2", className)}
      >
        {control}
        <div className="grid gap-1">
          {labelNode}
          {descriptionNode}
          {errorNode}
        </div>
      </div>
    );
  }

  return (
    <div data-slot="field" className={cn("grid gap-1.5", className)}>
      {labelNode}
      {control}
      {descriptionNode}
      {errorNode}
    </div>
  );
}
