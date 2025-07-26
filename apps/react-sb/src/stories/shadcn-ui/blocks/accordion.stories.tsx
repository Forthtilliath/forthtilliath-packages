import type { Meta, StoryObj } from "@storybook/react-vite";
import { Contrast, Palette, Zap } from "lucide-react";

// import { expect, waitFor } from "storybook/test";
import { Accordion } from "@forthtilliath/shadcn-ui/components/blocks/accordion";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "shadcn-ui-blocks/Accordion",
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
        type: { summary: "select" },
        defaultValue: { summary: "default" },
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
        type: { summary: "sm, default, lg" },
        defaultValue: { summary: "default" },
      },
    },
    items: {
      description: "Use the ``items`` prop to specify the accordion items.",
      control: { type: "object", disable: true },
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

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Box: Story = {
  args: {
    variant: "box",
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
  },
};

export const BoxContained: Story = {
  args: {
    variant: "box-contained",
  },
};

export const Tabs: Story = {
  args: {
    variant: "tabs",
    defaultValue: "item-0",
  },
};

export const HighlightActive: Story = {
  args: {
    variant: "highlight-active",
    defaultValue: "item-0",
  },
};

export const Icon: Story = {
  args: {
    variant: "default",
    defaultValue: "item-0",
    items: [
      {
        title: "eeeeIs it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: Contrast,
      },
      {
        title: "Is it styled?",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: Palette,
      },
      {
        title: "Is it animated?",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: Zap,
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    variant: "default",
    defaultValue: "item-0",
    items: [
      {
        title: "Is it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
        icon: Contrast,
      },
      {
        title: "Is it styled?",
        content:
          "Yes. It comes with default styles that matches the other components' aesthetic.",
        icon: Palette,
        disabled: true,
      },
      {
        title: "Is it animated?",
        content:
          "Yes. It's animated by default, but you can disable it if you prefer.",
        icon: Zap,
      },
    ],
  },
};

export const Sizes: Story = {
  args: {
    variant: "outline",
    size: "sm",
  },
};

/**
 * Use the ``collapsible`` prop to allow all items to close.
 */
export const Collapsible: Story = {
  args: {
    collapsible: true,
  },
};

/**
 * Set the ``type`` prop to ``multiple`` to enable opening multiple items at once.
 */
export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export const NoChevron: Story = {
  args: {
    hideChevron: true,
  },
};

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
