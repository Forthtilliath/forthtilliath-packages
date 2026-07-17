import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const linkVariants = cva(
  "focus-visible:ring-ring/50 inline-flex items-center gap-1 rounded-xs outline-none transition-colors focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary",
        primary: "text-primary hover:text-primary/80",
        muted: "text-muted-foreground hover:text-foreground",
        destructive: "text-destructive hover:text-destructive/80",
      },
      underline: {
        none: "no-underline",
        hover: "no-underline hover:underline",
        always: "underline",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      underline: "hover",
      size: "default",
    },
  },
);

export type LinkVariants = VariantProps<typeof linkVariants>;
