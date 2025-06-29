import type { Meta, StoryObj } from "@storybook/react-vite";

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
// import { userEvent, within } from "storybook/test";

const meta = {
  title: "shadcn-ui/AlertDialog",
  component: AlertDialog,
  argTypes: {},
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
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

export const Default: Story = {};

// export const ShouldOpenClose: Story = {
//   name: "when alert dialog trigger is pressed, should open the dialog and be able to close it",
//   tags: ["!dev", "!autodocs"],
//   play: async ({ canvasElement, canvas, step }) => {
//     const canvasBody = within(canvasElement.ownerDocument.body);

//     await step("open the alert dialog", async () => {
//       await userEvent.click(
//         await canvas.getByRole("button", {
//           name: /open/i,
//         }),
//       );
//     });

//     await step("close the alert dialog", async () => {
//       await userEvent.click(
//         await canvasBody.getByRole("button", {
//           name: /cancel/i,
//         }),
//         { delay: 100 },
//       );
//     });
//   },
// };