import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const toggleSwitchTrackVariants = cva(
  [
    "relative shrink-0 rounded-full bg-foreground/20 transition-colors",
    "group-data-[state=checked]/toggle-switch:bg-primary",
    "group-focus-visible/toggle-switch:ring-2 group-focus-visible/toggle-switch:ring-primary",
    "group-focus-visible/toggle-switch:ring-offset-2 group-focus-visible/toggle-switch:ring-offset-background",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-8",
        default: "h-5 w-9",
        lg: "h-6 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const toggleSwitchThumbVariants = cva(
  "absolute size-4 rounded-full bg-white shadow transition-transform",
  {
    variants: {
      size: {
        sm: "top-0.5 left-0.5 group-data-[state=checked]/toggle-switch:translate-x-3",
        default:
          "top-0.5 left-0.5 group-data-[state=checked]/toggle-switch:translate-x-4",
        lg: "top-1 left-1 group-data-[state=checked]/toggle-switch:translate-x-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type ToggleSwitchSizeVariants = VariantProps<
  typeof toggleSwitchTrackVariants
>;
