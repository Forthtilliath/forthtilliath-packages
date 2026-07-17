import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, within } from "storybook/test";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@forthtilliath/shadcn-ui/components/select";

/**
 * Displays a list of options for the user to pick from—triggered by a button.
 */
const meta: Meta<typeof Select> = {
  title: "shadcn-ui/Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    onValueChange: fn(),
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger title="Select" className="w-96">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="carrot" disabled>
            Carrot
          </SelectItem>
          <SelectItem value="courgette">Courgette</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
          <SelectItem value="pork">Pork</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the select.
 */
export const Default: Story = {};

/**
 * Use `size="sm"` on `SelectTrigger` for a more compact trigger button.
 */
export const Small: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger title="Select" size="sm" className="w-96">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const ShouldSelectOption: Story = {
  name: "when an option is selected, should be checked",
  tags: ["!dev", "!autodocs"],
  // Radix keeps `pointer-events: none` on the body for a moment while the
  // select content is opening/closing/animating, which trips user-event's
  // strict pointer-events check even though the click is perfectly valid
  // from a real user's perspective; use fireEvent to bypass that check
  // instead of racing the transition.
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const select = await canvasBody.findByRole("combobox");

    await step("open and select item", async () => {
      await fireEvent.click(select);
      await fireEvent.click(
        await canvasBody.findByRole("option", { name: /banana/i }),
      );
      await expect(select).toHaveTextContent("Banana");
    });

    await step("verify the selected option", async () => {
      await fireEvent.click(select);
      await expect(
        await canvasBody.findByRole("option", { name: /banana/i }),
      ).toHaveAttribute("data-state", "checked");
      await fireEvent.click(
        await canvasBody.findByRole("option", { name: /banana/i }),
      );
    });
  },
};
