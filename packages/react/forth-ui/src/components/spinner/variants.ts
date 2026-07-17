import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const spinnerSizeVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type SpinnerSizeVariants = VariantProps<typeof spinnerSizeVariants>;
