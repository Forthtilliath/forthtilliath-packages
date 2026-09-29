import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    },
    spacing: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-8",
      xl: "gap-12",
    },
  },
  defaultVariants: {
    cols: 12,
    spacing: "md",
  },
});

export type GridVariants = VariantProps<typeof gridVariants>;

export const gridItemVariants = cva("flex justify-center items-center", {
  variants: {
    cols: {
      default: "col-span-1",
      "2": "col-span-2",
      "3": "col-span-3",
      "4": "col-span-4",
      "5": "col-span-5",
      "6": "col-span-6",
      "7": "col-span-7",
      "8": "col-span-8",
      "9": "col-span-9",
      "10": "col-span-10",
      "11": "col-span-11",
      "12": "col-span-12",
      full: "col-span-full",
    },
    debug: {
      false: "",
      true: "relative",
    },
  },
  defaultVariants: {
    cols: "default",
    debug: false,
  },
});

export type GridItemVariants = VariantProps<typeof gridItemVariants>;

export const gridItemDebugVariants = cva(
  [
    "absolute inset-0 z-[999] pointer-events-none",
    "w-full h-full bg-red-500/10",
    "transition-transform duration-500 ease-in-out origin-top",
    "border-dashed border-red-500/30 border",
  ],
  {
    variants: {
      active: {
        true: "scale-y-100",
        false: "scale-y-0",
      },
    },
    defaultVariants: {
      active: true,
    },
  },
);
export type GridItemDebugVariants = VariantProps<typeof gridItemDebugVariants>;
