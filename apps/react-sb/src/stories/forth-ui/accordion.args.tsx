import type { Meta } from "@storybook/react-vite";

import type { Accordion } from "@forthtilliath/forth-ui/components/accordion";

export const accordionArgTypes = {
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
} satisfies Meta<typeof Accordion>["argTypes"];
