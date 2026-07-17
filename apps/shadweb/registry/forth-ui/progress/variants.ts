import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// shadcn-ui's own Progress hardcodes the indicator's color with no prop to
// override it — targeted here via its `data-slot="progress-indicator"`
// attribute from the outer className instead of forking the primitive.
export const progressVariants = cva("", {
  variants: {
    variant: {
      default: "",
      primary: "bg-primary/20 [&>[data-slot=progress-indicator]]:bg-primary",
      success:
        "bg-green-600/20 [&>[data-slot=progress-indicator]]:bg-green-600",
      warning:
        "bg-amber-500/20 [&>[data-slot=progress-indicator]]:bg-amber-500",
      info: "bg-sky-600/20 [&>[data-slot=progress-indicator]]:bg-sky-600",
      destructive:
        "bg-destructive/20 [&>[data-slot=progress-indicator]]:bg-destructive",
    },
    size: {
      sm: "h-1.5",
      default: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ProgressVariants = VariantProps<typeof progressVariants>;
