import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// shadcn-ui's own Button only exposes size: default | sm | lg | icon.
// forth-ui owns the full size scale itself (applied via className on top
// of the underlying primitive) rather than trying to extend a cva that
// isn't ours to extend.
export const buttonSizeVariants = cva("", {
  variants: {
    size: {
      xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
      "icon-xs": "size-7",
      "icon-sm": "size-8",
      "icon-lg": "size-10",
    },
    shape: {
      default: "",
      pill: "rounded-full",
    },
  },
  defaultVariants: {
    size: "default",
    shape: "default",
  },
});

export type ButtonSizeVariants = VariantProps<typeof buttonSizeVariants>;
