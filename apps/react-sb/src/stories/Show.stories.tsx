import { Show, type ShowProps } from "@forthtilliath/react-ui/show";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Show> = {
  title: "Ui/Show",
  component: Show,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    when: { control: "boolean" },
  },
  render: ({ when, fallback, children }: ShowProps) => (
    <Show when={when} fallback={fallback}>
      {children}
    </Show>
  ),
};

export default meta;
type Story = StoryObj<typeof Show>;

export const Default: Story = {
  args: {
    when: true,
    fallback: <div>Pas d&apos;élément à afficher</div>,
    children: (
      <div>
        <p>Liste des éléments disponibles</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    ),
  },
};
