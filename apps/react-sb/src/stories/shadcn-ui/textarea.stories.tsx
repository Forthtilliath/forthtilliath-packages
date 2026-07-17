import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import { Textarea } from "@forthtilliath/shadcn-ui/components/textarea";

/**
 * Displays a form textarea or a component that looks like a textarea.
 */
const meta = {
  title: "shadcn-ui/Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    placeholder: "Type your message here.",
    disabled: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the textarea.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the textarea.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Set `aria-invalid` to signal a validation error, showing the destructive
 * border and ring styles.
 */
export const Invalid: Story = {
  args: { "aria-invalid": true },
};

/**
 * Use the `Label` component to includes a clear, descriptive label above or
 * alongside the text area to guide users.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" />
    </div>
  ),
};

/**
 * Use a text element below the text area to provide additional instructions
 * or information to users.
 */
export const WithText: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea {...args} id="message-2" />
      <p className="text-sm text-slate-500">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
};

/**
 * Use the `Button` component to indicate that the text area can be submitted
 * or used to trigger an action.
 */
export const WithButton: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button type="submit">Send Message</Button>
    </div>
  ),
};
