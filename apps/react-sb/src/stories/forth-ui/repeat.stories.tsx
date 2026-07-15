import type { Meta, StoryObj } from "@storybook/react-vite";

import { Repeat } from "@forthtilliath/forth-ui/components/repeat";

/**
 * Repeat a component a specified number of times.
 */
const meta: Meta<typeof Repeat> = {
  title: "forth-ui/Repeat",
  component: Repeat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      description: "The number of times to repeat the content.",
      control: {
        type: "range",
        min: 1,
        max: 10,
        step: 1,
      },
      type: { name: "number", required: true },
    },
    renderItem: {
      description:
        "Use the ``renderItem`` prop to specify the content of each item.",
      table: {
        type: {
          summary: "(index: number) => React.ReactNode",
        },
      },
      type: { required: true, name: "function" },
    },
    keyItem: {
      description: "Use the ``keyItem`` prop to specify the key of each item.",
      table: {
        type: {
          summary: "(index: number) => React.Key",
        },
      },
      type: { required: false, name: "function" },
    },
  },
  args: {
    count: 3,
    renderItem: () => <p>Message statique répété plusieurs fois</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Repeat>;

/**
 * Default repeat component.
 */
export const Default: Story = {
  args: {
    renderItem: () => <p>Message statique répété plusieurs fois</p>,
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          return source.replace(
            "renderItem={() => {}}",
            "renderItem={() => <p>Message statique répété plusieurs fois</p>}",
          );
        },
      },
    },
  },
};

/**
 * Use ``renderItem`` prop to specify the content of each item.
 */
export const WithCallback: Story = {
  args: {
    renderItem: (i: number) => (
      <p>Message dynamique répété plusieurs fois, index {i}</p>
    ),
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          return source.replace(
            "renderItem={() => {}}",
            [
              "renderItem={(i: number) => (",
              "    <p>Message dynamique répété plusieurs fois, index {i}</p>",
              "  )}",
            ].join("\n"),
          );
        },
      },
    },
  },
};

/**
 * Use ``keyItem`` prop to specify the key of each item.
 */
export const WithCustomKey: Story = {
  args: {
    keyItem: (i: number) => `key-${i.toString()}`,
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          return source
            .replace(
              "keyItem={() => {}}",
              "keyItem={(i: number) => `key-${i.toString()}`}",
            )
            .replace(
              "renderItem={() => {}}",
              [
                "renderItem={() => (",
                "    <p>Message statique répété plusieurs fois</p>",
                "  )}",
              ].join("\n"),
            );
        },
      },
    },
  },
};

function CustomComponent() {
  return <p>Message statique dans un component</p>;
}

/**
 * Use ``renderItem`` prop to render a custom component.
 *
 * ```tsx
 * function CustomComponent() {
 *   return <p>Message statique dans un component</p>;
 * }
 * ```
 */
export const WithComponent: Story = {
  args: {
    renderItem: () => <CustomComponent />,
  },
  parameters: {
    docs: {
      source: {
        transform: (source: string) => {
          return source.replace(
            "renderItem={() => {}}",
            "renderItem={() => <CustomComponent />}",
          );
        },
      },
    },
  },
};
