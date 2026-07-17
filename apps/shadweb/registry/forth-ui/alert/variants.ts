import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// Tailwind's scanner needs literal class strings in source — no
// runtime-templated `bg-${color}-600` here, it wouldn't be picked up.
export const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm transition-colors has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        primary: "",
        success: "",
        warning: "",
        info: "",
        destructive: "",
      },
      look: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
      },
      size: {
        sm: "gap-x-2 px-3 py-2 text-xs [&>svg]:size-3.5",
        default: "",
        lg: "gap-x-4 px-5 py-4 text-base [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      look: "soft",
      size: "default",
    },
    compoundVariants: [
      // default (neutral) ignores `look` — none of the reference sources
      // show a "solid neutral" or "outline neutral" alert, only colored
      // ones vary by look.
      {
        variant: "primary",
        look: "solid",
        className: "bg-primary text-primary-foreground border-transparent",
      },
      {
        variant: "primary",
        look: "soft",
        className:
          "bg-primary/10 text-primary border-primary/20 [&>svg]:text-primary",
      },
      {
        variant: "primary",
        look: "outline",
        className: "text-primary border-primary/50 [&>svg]:text-primary",
      },
      {
        variant: "success",
        look: "solid",
        className: "bg-green-600 text-white border-transparent",
      },
      {
        variant: "success",
        look: "soft",
        className:
          "bg-green-50 text-green-700 border-green-200 [&>svg]:text-green-600 dark:bg-green-950 dark:text-green-300 dark:border-green-900 dark:[&>svg]:text-green-400",
      },
      {
        variant: "success",
        look: "outline",
        className:
          "text-green-700 border-green-300 [&>svg]:text-green-600 dark:text-green-300 dark:border-green-800 dark:[&>svg]:text-green-400",
      },
      {
        variant: "warning",
        look: "solid",
        className: "bg-amber-500 text-white border-transparent",
      },
      {
        variant: "warning",
        look: "soft",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 [&>svg]:text-amber-600 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900 dark:[&>svg]:text-amber-400",
      },
      {
        variant: "warning",
        look: "outline",
        className:
          "text-amber-700 border-amber-300 [&>svg]:text-amber-600 dark:text-amber-300 dark:border-amber-800 dark:[&>svg]:text-amber-400",
      },
      {
        variant: "info",
        look: "solid",
        className: "bg-sky-600 text-white border-transparent",
      },
      {
        variant: "info",
        look: "soft",
        className:
          "bg-sky-50 text-sky-700 border-sky-200 [&>svg]:text-sky-600 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900 dark:[&>svg]:text-sky-400",
      },
      {
        variant: "info",
        look: "outline",
        className:
          "text-sky-700 border-sky-300 [&>svg]:text-sky-600 dark:text-sky-300 dark:border-sky-800 dark:[&>svg]:text-sky-400",
      },
      {
        variant: "destructive",
        look: "solid",
        className: "bg-destructive text-white border-transparent",
      },
      {
        variant: "destructive",
        look: "soft",
        className:
          "bg-destructive/10 text-destructive border-destructive/20 [&>svg]:text-destructive",
      },
      {
        variant: "destructive",
        look: "outline",
        className:
          "text-destructive border-destructive/50 [&>svg]:text-destructive",
      },
    ],
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
