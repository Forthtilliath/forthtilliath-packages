import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import type { Shape, Size, StatusLabel } from "./constants";
import { DEFAULT_SHAPE } from "./constants";

export const avatarVariants = cva("size-10", {
  variants: {
    ring: {
      false: "",
      true: "ring-2 ring-green-500 ring-offset-[3px] ring-offset-background",
    },
    shape: {
      square: "rounded-none",
      rounded: "rounded-md",
      circle: "",
    } satisfies Record<Shape, string>,
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-14",
      xl: "size-20",
      "2xl": "size-40",
      "3xl": "size-60",
      // @container ? for ring and border
    } satisfies Record<Size, string>,
  },
  defaultVariants: {
    ring: false,
    shape: DEFAULT_SHAPE,
    size: "md",
  },
});

export const statusVariants = cva("", {
  variants: {
    status: {
      online: "bg-green-500",
      offline: "bg-gray-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    } satisfies Record<StatusLabel, string>,
    position: {
      "top-right": "absolute right-0.25 top-0.25",
      "bottom-right": "absolute right-0.25 bottom-0.25",
      "top-left": "absolute left-0.25 top-0.25",
      "bottom-left": "absolute left-0.25 bottom-0.25",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
  compoundVariants: [
    {
      status: ["online", "offline", "away", "busy"],
      className: "border-background size-3/12 rounded-full border-2",
    },
  ],
});

export type StatusVariants = VariantProps<typeof statusVariants>;

export const fallbackVariants = cva("", {
  variants: {
    fallbackVariant: {
      default: "",
      amber: "bg-amber-500",
      blue: "bg-blue-500",
      cyan: "bg-cyan-500",
      emerald: "bg-emerald-500",
      fuchsia: "bg-fuchsia-500",
      gray: "bg-gray-500",
      green: "bg-green-500",
      indigo: "bg-indigo-500",
      lime: "bg-lime-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      rose: "bg-rose-500",
      slate: "bg-slate-500",
      sky: "bg-sky-500",
      teal: "bg-teal-500",
      violet: "bg-violet-500",
      yellow: "bg-yellow-500",

      "amber-full": "bg-amber-500/25 text-amber-500",
      "blue-full": "bg-blue-500/25 text-blue-500",
      "cyan-full": "bg-cyan-500/25 text-cyan-500",
      "emerald-full": "bg-emerald-500/25 text-emerald-500",
      "fuchsia-full": "bg-fuchsia-500/25 text-fuchsia-500",
      "gray-full": "bg-gray-500/25 text-gray-500",
      "green-full": "bg-green-500/25 text-green-500",
      "indigo-full": "bg-indigo-500/25 text-indigo-500",
      "lime-full": "bg-lime-500/25 text-lime-500",
      "orange-full": "bg-orange-500/25 text-orange-500",
      "pink-full": "bg-pink-500/25 text-pink-500",
      "purple-full": "bg-purple-500/25 text-purple-500",
      "red-full": "bg-red-500/25 text-red-500",
      "rose-full": "bg-rose-500/25 text-rose-500",
      "slate-full": "bg-slate-500/25 text-slate-500",
      "sky-full": "bg-sky-500/25 text-sky-500",
      "teal-full": "bg-teal-500/25 text-teal-500",
      "violet-full": "bg-violet-500/25 text-violet-500",
      "yellow-full": "bg-yellow-500/25 text-yellow-500",
    },
    shape: {
      square: "rounded-none",
      rounded: "rounded-lg",
      circle: "",
    } satisfies Record<Shape, string>,
  },
  defaultVariants: {
    fallbackVariant: "default",
    shape: DEFAULT_SHAPE,
  },
});

export type FallbackVariants = VariantProps<typeof fallbackVariants>;

export const tooltipTriggerVariants = cva("ring-background ring-2 hover:z-10", {
  variants: {
    shape: {
      square: "rounded-none",
      rounded: "rounded-md",
      circle: "rounded-full",
    } satisfies Record<Shape, string>,
  },
  defaultVariants: {
    shape: DEFAULT_SHAPE,
  },
});
