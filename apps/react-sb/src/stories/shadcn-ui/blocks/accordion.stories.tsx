import type { Meta, StoryObj } from "@storybook/react-vite";
import { Contrast, HelpCircle, Palette, Zap } from "lucide-react";

import { Accordion } from "@forthtilliath/shadcn-ui/components/blocks/accordion";

import {
  baseItems,
  itemsWith,
  plusChevron,
  plusChevronTrigger,
} from "../../accordion-fixtures";

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
        defaultValue: { summary: "right" },
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
        type: { summary: "sm | default | lg" },
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
    items: baseItems,
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
    defaultValue: "item-0",
    items: itemsWith([
      { icon: <Contrast /> },
      { icon: <Palette /> },
      { icon: <Zap /> },
    ]),
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "item-0",
    items: itemsWith([
      { icon: <Contrast color="green" /> },
      { icon: <Palette color="red" />, disabled: true },
      { icon: <Zap color="green" /> },
    ]),
  },
};

export const Sizes: Story = {
  args: {
    variant: "outline",
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    variant: "outline",
    size: "lg",
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

export const FAQExample: Story = {
  args: {
    icon: <HelpCircle className="h-4 w-4" />,
  },
};

export const Subtitle: Story = {
  args: {
    defaultValue: "item-0",
    items: itemsWith([
      {
        subtitle: "Find out more about our accessibility features.",
        icon: <Contrast color="green" />,
      },
      {
        subtitle: "Explore the aesthetic uniformity",
        icon: <Palette color="purple" />,
      },
      {
        subtitle: "Animation customization options",
        icon: <Zap color="blue" />,
      },
    ]),
  },
};

export const Stylizable: Story = {
  args: {
    collapsible: true,
    variant: "box-contained",
    defaultValue: "item-0",
    classNameTrigger:
      "[&_[data-slot=title]]:no-underline [&_[data-slot=icon]]:group-hover:rotate-45 [&_[data-slot=icon]]:transition [&_[data-slot=icon]]:duration-100",
    classNameItem: "bg-purple-300/50",
    classNameContent: "ps-7",
    items: itemsWith([
      { icon: <Contrast size={16} /> },
      { icon: <Palette size={16} /> },
      { icon: <Zap size={16} /> },
    ]),
  },
};

export const CustomChevron: Story = {
  args: {
    customChevron: plusChevron,
    classNameTrigger: plusChevronTrigger,
  },
};

export const LeftCustomChevron: Story = {
  args: {
    chevronAlignment: "left",
    customChevron: plusChevron,
    classNameTrigger: plusChevronTrigger,
  },
};
