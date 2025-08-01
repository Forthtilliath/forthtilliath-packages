import { cva } from "class-variance-authority";

export const accordionRootVariants = cva("max-w-lg my-4 w-full text-foreground", {
  variants: {
    variant: {
      default: "space-y-2",
      outline: "space-y-2",
      box: "",
      contained: "space-y-2",
      "box-contained": "",
      tabs: "space-y-2",
      "highlight-active": "space-y-2",
    },
    size: {
      sm: "text-sm",
      default: "text-[15px]",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "px-4 border rounded-md last:border-b",
      box: "px-4 border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md",
      contained: "px-4 border-none rounded-md bg-secondary",
      "box-contained":
        "px-4 last:border-none first:rounded-t-md last:rounded-b-md bg-muted",
      tabs: "px-4 border-none rounded-md data-[state=open]:bg-secondary",
      "highlight-active":
        "px-4 data-[state=open]:border-b-2 data-[state=open]:border-indigo-600 dark:data-[state=open]:border-indigo-500",
    },
    size: {
      sm: "px-2",
      default: "",
      lg: "px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const accordionTriggerVariants = cva(
  "hover:no-underline group items-center",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        box: "",
        contained: "",
        "box-contained": "",
        tabs: "data-[state=closed]:py-2",
        "highlight-active":
          "data-[state=open]:text-indigo-600 dark:data-[state=open]:text-indigo-500",
      },
      size: {
        sm: "py-3 text-sm [&_[data-slot=subtitle]]:text-xs",
        default: "py-4 text-[15px] [&_[data-slot=subtitle]]:text-sm",
        lg: "py-5 text-lg [&_[data-slot=subtitle]]:text-base",
      },
      disabled: {
        false: "",
        true: "opacity-50",
      },
      chevronAlignment: {
        right: "",
        left: "flex-row-reverse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
      chevronAlignment: "right",
    },
  }
);

export const accordionContentVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "",
      box: "",
      contained: "",
      "box-contained": "",
      tabs: "",
      "highlight-active": "",
    },
    size: {
      sm: "pb-3 text-sm",
      default: "pb-4 text-[15px]",
      lg: "pb-5 text-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
