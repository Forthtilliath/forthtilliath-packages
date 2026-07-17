import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "storybook/internal/test";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@forthtilliath/shadcn-ui/components/alert-dialog";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

/**
 * A modal dialog that interrupts the user with important content and expects
 * a response, such as confirming a destructive action.
 */
const meta = {
  title: "shadcn-ui/Overlays/AlertDialog",
  component: AlertDialog,
  argTypes: {},
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the alert dialog, triggered by a button.
 */
export const Default: Story = {};

/**
 * Interaction test verifying the dialog opens on trigger click and closes
 * when the cancel button is clicked.
 */
export const ShouldOpenClose: Story = {
  name: "when alert dialog trigger is pressed, should open the dialog and be able to close it",
  tags: ["!dev", "!autodocs"],
  play: async ({ userEvent, canvas, step, canvasElement }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open the alert dialog", async () => {
      // NOTE: `AlertDialogTrigger` wraps a `<Button>` without `asChild`,
      // so Radix renders a real `<button>` around the inner `<Button>`'s
      // own `<button>`, producing two accessible elements named
      // "Show Dialog". Both share the same click behavior, so we target
      // the first (outer, actual Radix trigger) match. See report for the
      // underlying story markup issue.
      const [trigger] = canvas.getAllByRole("button", {
        name: /show dialog/i,
      });
      if (!trigger) throw new Error("No trigger found");
      await userEvent.click(trigger);
    });

    await step("close the alert dialog", async () => {
      await userEvent.click(
        canvasBody.getByRole("button", { name: /cancel/i }),
      );
    });
  },
};
