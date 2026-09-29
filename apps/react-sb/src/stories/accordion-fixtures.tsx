import type { ReactNode } from "react";
import { PlusIcon } from "lucide-react";

// Shared by the forth-ui and shadcn-ui-blocks Accordion stories: the three
// FAQ items most stories reuse, and the `+` chevron of the CustomChevron ones.

export const baseItems = [
  {
    title: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    title: "Is it styled?",
    content:
      "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    title: "Is it animated?",
    content:
      "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

interface ItemExtras {
  icon: ReactNode;
  subtitle?: string;
  disabled?: boolean;
}

/** The three base items, each completed with its own icon (and extras). */
export function itemsWith(extras: [ItemExtras, ItemExtras, ItemExtras]) {
  return baseItems.map((item, index) => ({ ...item, ...extras[index] }));
}

export const plusChevron = (
  <PlusIcon
    size={16}
    className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
    aria-hidden="true"
  />
);

/** Turns the `+` chevron into a `-` once the item is open. */
export const plusChevronTrigger =
  "[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0";
