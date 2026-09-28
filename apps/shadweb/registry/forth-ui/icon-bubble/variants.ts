import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const iconBubbleVariants = cva(
  "bg-primary/15 text-primary grid shrink-0 place-items-center rounded-full",
  {
    variants: {
      size: {
        sm: "size-7",
        default: "size-9",
        lg: "size-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/** Icon size (px) matching each bubble size. */
export const ICON_BUBBLE_ICON_SIZES = {
  sm: 14,
  default: 17,
  lg: 20,
} as const;

export type IconBubbleVariants = VariantProps<typeof iconBubbleVariants>;
