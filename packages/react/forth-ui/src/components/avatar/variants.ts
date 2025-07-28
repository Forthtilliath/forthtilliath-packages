import { cva } from "class-variance-authority";

export const statusVariants = cva("", {
  variants: {
    status: {
      online: "bg-green-500",
      offline: "bg-gray-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    },
    position: {
      "top-right": "absolute -right-0.5 -top-0.5",
      "bottom-right": "absolute -right-0.5 -bottom-0.5",
    },
  },
  defaultVariants: {  },
});