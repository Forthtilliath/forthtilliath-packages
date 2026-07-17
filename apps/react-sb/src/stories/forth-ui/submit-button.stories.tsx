import type { Meta, StoryObj } from "@storybook/react-vite";

import { SubmitButton } from "@forthtilliath/forth-ui/components/submit-button";

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * A submit `Button` that shows its own loading state automatically while
 * its parent `<form>` is submitting, via React's `useFormStatus`. Must be
 * rendered inside a `<form>`.
 */
const meta = {
  title: "forth-ui/Forms/SubmitButton",
  component: SubmitButton,
  args: {
    children: "Submit",
  },
  render: (args) => (
    <form
      action={async () => {
        await sleep(2000);
      }}
    >
      <SubmitButton {...args} />
    </form>
  ),
} satisfies Meta<typeof SubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click submit — the button shows a spinner for the 2s mock action.
 */
export const Default: Story = {};
