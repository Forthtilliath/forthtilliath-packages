import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@forthtilliath/shadcn-ui/components/dialog";

const meta = {
  title: "shadcn-ui/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <DialogClose className="hover:underline">Cancel</DialogClose>
          <DialogClose className="bg-primary text-primary-foreground rounded px-4 py-2">
            Continue
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShouldOpenCloseWithContinue: Story = {
  name: "when clicking Continue button, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step, userEvent }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /continue/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  },
};

export const ShouldOpenCloseWithCancel: Story = {
  name: "when clicking Cancel button, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step, userEvent }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /cancel/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  },
};

export const ShouldOpenCloseCross: Story = {
  name: "when clicking Close icon, should close the dialog",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step, userEvent }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("Open the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /open/i })
      );
      const dialog = await canvasBody.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute("data-state", "open");
    });

    await step("Close the dialog", async () => {
      await userEvent.click(
        await canvasBody.findByRole("button", { name: /close/i })
      );
      await expect(await canvasBody.findByRole("dialog")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });
  },
};
