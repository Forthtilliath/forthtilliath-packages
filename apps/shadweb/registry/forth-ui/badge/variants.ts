import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

// Tailwind's scanner needs literal class strings in source — no
// runtime-templated `bg-${color}-600` here, it wouldn't be picked up.
export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
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
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
        square: "rounded-sm",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px] [&>svg]:size-2.5",
        default: "",
        lg: "px-2.5 py-1 text-sm [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      look: "solid",
      shape: "rounded",
      size: "default",
    },
    compoundVariants: [
      // default/secondary ignore `look` — like Alert's neutral variant,
      // none of the reference sources show a "soft"/"outline" neutral
      // badge distinct from `outline` itself already being a variant
      // upstream. Only the semantic colors vary by look here.
      {
        variant: "primary",
        look: "solid",
        className: "bg-primary text-primary-foreground border-transparent",
      },
      {
        variant: "primary",
        look: "soft",
        className: "bg-primary/10 text-primary border-transparent",
      },
      {
        variant: "primary",
        look: "outline",
        className: "text-primary border-primary/50",
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
          "bg-green-50 text-green-700 border-transparent dark:bg-green-950 dark:text-green-300",
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
        className: "bg-amber-500 text-white border-transparent",
      },
      {
        variant: "warning",
        look: "soft",
        className:
          "bg-amber-50 text-amber-700 border-transparent dark:bg-amber-950 dark:text-amber-300",
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
        className: "bg-sky-600 text-white border-transparent",
      },
      {
        variant: "info",
        look: "soft",
        className:
          "bg-sky-50 text-sky-700 border-transparent dark:bg-sky-950 dark:text-sky-300",
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
        className: "bg-destructive text-white border-transparent",
      },
      {
        variant: "destructive",
        look: "soft",
        className: "bg-destructive/10 text-destructive border-transparent",
      },
      {
        variant: "destructive",
        look: "outline",
        className: "text-destructive border-destructive/50",
      },
    ],
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export const dotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    variant: {
      default: "bg-current",
      secondary: "bg-current",
      primary: "bg-primary",
      success: "bg-green-600 dark:bg-green-400",
      warning: "bg-amber-500 dark:bg-amber-400",
      info: "bg-sky-600 dark:bg-sky-400",
      destructive: "bg-destructive",
    } satisfies Record<NonNullable<BadgeVariants["variant"]>, string>,
  },
  defaultVariants: {
    variant: "default",
  },
});
