import { cva, VariantProps } from "class-variance-authority";

import { statusLabels } from "./constants";

export const statusVariants = cva("", {
  variants: {
    status: {
      online: "bg-green-500",
      offline: "bg-gray-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    } satisfies Record<keyof typeof statusLabels, string>,
    position: {
      "top-right": "absolute right-0 top-0",
      "bottom-right": "absolute right-0 bottom-0",
      "top-left": "absolute left-0 top-0",
      "bottom-left": "absolute left-0 bottom-0",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
  compoundVariants: [
    {
      status: ["online", "offline", "away", "busy"],
      className: [
        // "h-2.5 w-2.5 ring-2 ring-blue-50 rounded-full",
        "border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2",
      ],
    },
  ],
});

export type StatusVariants = VariantProps<typeof statusVariants>;
