import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// Tailwind's scanner needs literal class strings in source — no
// runtime-templated `bg-${color}-600` here, it wouldn't be picked up.
export const bannerVariants = cva(
  "relative flex w-full items-center justify-center gap-x-3 px-4 py-2.5 text-sm [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-b",
        primary: "",
        success: "",
        warning: "",
        info: "",
        destructive: "",
      },
      look: {
        solid: "",
        soft: "",
        outline: "border-b bg-transparent",
      },
      inset: {
        false: "",
        true: "mx-4 mt-4 w-auto rounded-lg border",
      },
      sticky: {
        false: "",
        true: "sticky top-0 z-50",
      },
    },
    defaultVariants: {
      variant: "default",
      look: "solid",
      inset: false,
      sticky: false,
    },
    compoundVariants: [
      {
        variant: "primary",
        look: "solid",
        className: "bg-primary text-primary-foreground",
      },
      {
        variant: "primary",
        look: "soft",
        className: "bg-primary/10 text-primary",
      },
      {
        variant: "primary",
        look: "outline",
        className: "text-primary border-primary/50",
      },
      {
        variant: "success",
        look: "solid",
        className: "bg-green-600 text-white",
      },
      {
        variant: "success",
        look: "soft",
        className:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      },
      {
        variant: "success",
        look: "outline",
        className:
          "text-green-700 border-green-300 dark:text-green-300 dark:border-green-800",
      },
      {
        variant: "warning",
        look: "solid",
        className: "bg-amber-500 text-white",
      },
      {
        variant: "warning",
        look: "soft",
        className:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      },
      {
        variant: "warning",
        look: "outline",
        className:
          "text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-800",
      },
      {
        variant: "info",
        look: "solid",
        className: "bg-sky-600 text-white",
      },
      {
        variant: "info",
        look: "soft",
        className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      },
      {
        variant: "info",
        look: "outline",
        className:
          "text-sky-700 border-sky-300 dark:text-sky-300 dark:border-sky-800",
      },
      {
        variant: "destructive",
        look: "solid",
        className: "bg-destructive text-white",
      },
      {
        variant: "destructive",
        look: "soft",
        className: "bg-destructive/10 text-destructive",
      },
      {
        variant: "destructive",
        look: "outline",
        className: "text-destructive border-destructive/50",
      },
    ],
  },
);

export type BannerVariants = VariantProps<typeof bannerVariants>;
