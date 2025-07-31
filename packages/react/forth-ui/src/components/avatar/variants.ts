import { cva, VariantProps } from "class-variance-authority";

export const statusVariants = cva("", {
  variants: {
    status: {
      default: "",
      online: "h-2.5 w-2.5 ring-2 ring-blue-50 rounded-full bg-green-500",
      offline: "h-2.5 w-2.5 ring-2 ring-blue-50 rounded-full bg-gray-500",
      away: "h-2.5 w-2.5 ring-2 ring-blue-50 rounded-full bg-yellow-500",
      busy: "h-2.5 w-2.5 ring-2 ring-blue-50 rounded-full bg-red-500",
    },
    position: {
      default: "",
      "top-right": "absolute right-0 -top-0",
      "bottom-right": "absolute right-0 bottom-0",
      "top-left": "absolute left-0 -top-0",
      "bottom-left": "absolute left-0 bottom-0",
    },
  },
  defaultVariants: {
    status: "default",
    position: "default",
  },
  compoundVariants: [
    {
      status: ["online", "offline", "away", "busy"],
      className: "absolute right-0 bottom-0",
    },
  ],
});

export type StatusVariants = VariantProps<typeof statusVariants>;
