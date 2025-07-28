import type { Meta, StoryObj } from "@storybook/react-vite";
import { Contrast, HelpCircle, Palette, PlusIcon, Zap } from "lucide-react";

// import { expect, waitFor } from "storybook/test";
import { Accordion } from "@forthtilliath/forth-ui/components/accordion";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/Accordion",
  component: Accordion,
  argTypes: {
    collapsible: {
      description: "Use the ``collapsible`` prop to allow all items to close.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    multiple: {
      description:
        "Set the ``type`` prop to ``multiple`` to enable opening multiple items at once.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    chevronAlignment: {
      description:
        "Use the ``chevronAlignment`` prop to change the alignment of the chevron.",
      options: ["left", "right"],
      control: {
        type: "inline-radio",
        labels: { left: "Left", right: "Right" },
      },
      table: {
        type: {
          summary: "left | right",
        },
        defaultValue: { summary: '"right"' },
      },
    },
    variant: {
      description: "Use the ``variant`` prop to change the visual style.",
      options: [
        "default",
        "outline",
        "box",
        "contained",
        "box-contained",
        "tabs",
        "highlight-active",
      ],
      control: { type: "select" },
      table: {
        type: {
          summary:
            "default | outline | box | contained | box-contained | tabs | highlight-active",
        },
        defaultValue: { summary: '"default"' },
      },
    },
    size: {
      description: "Use the ``size`` prop to change the size of the accordion.",
      options: ["sm", "default", "lg"],
      control: {
        type: "select",
        labels: { sm: "Small", lg: "Large", default: "Default" },
      },
      table: {
        type: { summary: "sm | default | lg" },
        defaultValue: { summary: '"default"' },
      },
    },
    items: {
      description: "Use the ``items`` prop to specify the accordion items.",
      control: { type: "object", disable: true },
      table: {
        type: { summary: "Item[]" },
        defaultValue: { summary: "Required" },
      },
    },
  },
  args: {
    collapsible: false,
    multiple: false,
    items: [
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
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default accordion story with default styles.
 *
 * Notes:
 * - The accordion is not collapsible by default.
 * - Only one item can be open at a time.
 * - Each item must have a title and a content.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant to create an outline styled accordion.
 * This variant displays a minimal outline style for the accordion items.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `box` variant to create a box styled accordion.
 * This style wraps items in a box-like appearance.
 */
export const Box: Story = {
  args: {
    variant: "box",
  },
};

/**
 * Use the `contained` variant for a filled style accordion.
 */
export const Contained: Story = {
  args: {
    variant: "contained",
  },
};

/**
 * Use the `box-contained` variant for a boxed and filled style.
 */
export const BoxContained: Story = {
  args: {
    variant: "box-contained",
  },
};

/**
 * Use the `tabs` variant for a tabbed style accordion.
 */
export const Tabs: Story = {
  args: {
    variant: "tabs",
    defaultValue: "item-0",
  },
};

/**
 * Use the `highlight-active` variant to highlight the active item.
 */
export const HighlightActive: Story = {
  args: {
    variant: "highlight-active",
    defaultValue: "item-0",
  },
};

/**
 * Accordion with items that include distinct icons.
 */
export const Icon: Story = {
  args: {
    defaultValue: "item-0",
    items: [
      {
        title: "Is it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: <Contrast />,
      },
      {
        title: "Is it styled?",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: <Palette />,
      },
      {
        title: "Is it animated?",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: <Zap />,
      },
    ],
  },
};

/**
 * Accordion with disabled items to demonstrate disabled state.
 */
export const Disabled: Story = {
  args: {
    defaultValue: "item-0",
    items: [
      {
        title: "Is it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: <Contrast color="green" />,
      },
      {
        title: "Is it styled?",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: <Palette color="red" />,
        disabled: true,
      },
      {
        title: "Is it animated?",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: <Zap color="green" />,
      },
    ],
  },
};

/**
 * Small size variant of the accordion.
 */
export const Sizes: Story = {
  args: {
    variant: "outline",
    size: "sm",
  },
};

/**
 * Use the `collapsible` prop to allow all items to close when clicked.
 */
export const Collapsible: Story = {
  args: {
    collapsible: true,
  },
};

/**
 * Enable opening multiple items simultaneously with `multiple` set to `true`.
 * The `defaultValue` prop must be an array of strings that match the value of the items.
 */
export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["item-0", "item-2"],
  },
};

/**
 * Hide the chevron icons in the accordion items.
 */
export const NoChevron: Story = {
  args: {
    hideChevron: true,
  },
};

/**
 * Example of an FAQ accordion with an icon indicating help used for all items.
 */
export const FAQExample: Story = {
  args: {
    icon: <HelpCircle className="h-4 w-4" />,
  },
};

/**
 * Accordion items include subtitles to offer more detailed context.
 */
export const Subtitle: Story = {
  args: {
    defaultValue: "item-0",
    items: [
      {
        title: "Is it accessible?",
        subtitle: "Find out more about our accessibility features.",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: <Contrast color="green" />,
      },
      {
        title: "Is it styled?",
        subtitle: "Explore the aesthetic uniformity",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: <Palette color="purple" />,
      },
      {
        title: "Is it animated?",
        subtitle: "Animation customization options",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: <Zap color="blue" />,
      },
    ],
  },
};

/**
 * This story demonstrates deep customization of styles for the accordion component.
 */
export const Stylizable: Story = {
  args: {
    collapsible: true,
    variant: "box-contained",
    defaultValue: "item-0",
    classNameTrigger:
      "[&_[data-slot=title]]:no-underline [&_[data-slot=icon]]:group-hover:rotate-45 [&_[data-slot=icon]]:transition [&_[data-slot=icon]]:duration-100",
    classNameItem: "bg-purple-300/50",
    classNameContent: "ps-7",
    items: [
      {
        title: "Is it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: <Contrast size={16} />,
      },
      {
        title: "Is it styled?",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: <Palette size={16} />,
      },
      {
        title: "Is it animated?",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: <Zap size={16} />,
      },
    ],
  },
};

/**
 *
 */
/**
 * The right chevron icon can be customized using the `customChevron` prop.
 * Note that you can still style the chevron icon using the `classNameTrigger` prop if needed.
 */
export const CustomChevron: Story = {
  args: {
    customChevron: (
      <PlusIcon
        size={16}
        className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
        aria-hidden="true"
      />
    ),
    classNameTrigger:
      "[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0",
  },
};

/**
 * You can also pass a custom chevron icon and position it to the left using `chevronAlignment="left"`.
 */
export const LeftCustomChevron: Story = {
  args: {
    chevronAlignment: "left",
    customChevron: (
      <PlusIcon
        size={16}
        className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
        aria-hidden="true"
      />
    ),
    classNameTrigger:
      "[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0",
  },
};

// Nested Accordions ? https://www.hextaui.com/docs/ui/components/accordion#nested-accordions

// export const ShouldOnlyOpenOne: Story = {
//   name: "when accordions are clicked, should open only one item at a time",
//   args: {
//     type: "single",
//   },
//   tags: ["!dev", "!autodocs"],
//   play: async ({ canvas, userEvent }) => {
//     const accordions = canvas.getAllByRole("button");

//     // Open the tabs one at a time
//     for (const trigger of accordions) {
//       await userEvent.click(trigger);
//       await waitFor(async () => {
//         const content = await canvas.findAllByRole("region");
//         return expect(content.length).toBe(1);
//       });
//     }

//     // Close the last opened tab
//     const lastTrigger = accordions[accordions.length - 1];
//     if (!lastTrigger) throw new Error("No trigger found");
//     await userEvent.click(lastTrigger);
//     await waitFor(async () => {
//       const content = canvas.queryByRole("region");
//       return expect(content).toBeFalsy();
//     });
//   },
// };

// export const ShouldOpenAll: Story = {
//   name: "when accordions are clicked, should open all items one at a time",
//   args: {
//     type: "multiple",
//   },
//   tags: ["!dev", "!autodocs"],
//   play: async ({ canvas, userEvent }) => {
//     const accordions = canvas.getAllByRole("button");

//     // Open all tabs one at a time
//     for (let i = 0; i < accordions.length; i++) {
//       await userEvent.click(accordions[i] as HTMLButtonElement);
//       await waitFor(async () => {
//         const content = await canvas.findAllByRole("region");
//         return expect(content.length).toBe(i + 1);
//       });
//     }

//     // Close all tabs one at a time
//     for (let i = accordions.length - 1; i > 0; i--) {
//       await userEvent.click(accordions[i] as HTMLButtonElement);
//       await waitFor(async () => {
//         const content = await canvas.findAllByRole("region");
//         return expect(content.length).toBe(i);
//       });
//     }

//     // Close the last opened tab
//     await userEvent.click(accordions[0] as HTMLButtonElement);
//     await waitFor(async () => {
//       const content = canvas.queryByRole("region");
//       return expect(content).toBeFalsy();
//     });
//   },
// };

// https://www.heroui.com/docs/components/accordion
// https://github.com/heroui-inc/heroui/blob/canary/packages/components/accordion/src/accordion-item.tsx
// https://originui.com/accordion
