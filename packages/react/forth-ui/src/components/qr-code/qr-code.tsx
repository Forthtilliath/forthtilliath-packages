import type React from "react";
import { create } from "qrcode";

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface QrCodeProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  "viewBox"
> {
  /** The data to encode. */
  value: string;
  /**
   * Error correction level — higher values tolerate more damage/occlusion
   * at the cost of a denser code.
   * @default "M"
   */
  robustness?: "L" | "M" | "Q" | "H";
  /** @default "currentColor" */
  foreground?: string;
  /** @default "transparent" */
  background?: string;
}

/**
 * Generates a QR code from a string, rendered as SVG (no canvas — works in
 * Server Components too).
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/qr-code
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function QrCode({
  value,
  robustness = "M",
  foreground = "currentColor",
  background = "transparent",
  className,
  ...props
}: QrCodeProps) {
  const { modules } = create(value, { errorCorrectionLevel: robustness });
  const size = modules.size;

  const cells: React.ReactNode[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules.get(row, col)) {
        cells.push(
          <rect
            key={`${row.toString()}-${col.toString()}`}
            x={col}
            y={row}
            width={1}
            height={1}
          />,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size.toString()} ${size.toString()}`}
      role="img"
      aria-label={`QR code encoding: ${value}`}
      className={cn("size-32", className)}
      {...props}
    >
      <rect width={size} height={size} fill={background} />
      <g fill={foreground}>{cells}</g>
    </svg>
  );
}
