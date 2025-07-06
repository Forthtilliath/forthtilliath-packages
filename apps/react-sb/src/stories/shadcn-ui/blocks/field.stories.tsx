import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { expect } from "storybook/test";
import z from "zod/v4";

import { Field } from "@forthtilliath/shadcn-ui/components/blocks/field";
import { Form } from "@forthtilliath/shadcn-ui/components/blocks/form";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
});

/**
 * Building forms with React Hook Form and Zod.
 */
const meta: Meta<typeof Field> = {
  title: "shadcn-ui-blocks/Field",
  tags: ["autodocs"],
  component: Field,
  argTypes: {},
  args: {
    label: "Username",
    description: "This is your public display name.",
    //! Even if decorators send it, i have to use it for testing
    name: "username",
  },
  decorators: [
    (Story) => {
      function onSubmit(values: z.infer<typeof formSchema>) {
        action("onSubmit")(values);
      }
      return (
        <Form
          defaultValues={{ username: "" }}
          schema={formSchema}
          onSubmit={onSubmit}
          className="space-y-8"
        >
          {({ register }) => (
            <>
              <Story {...register("username")} />
              <Button type="submit">Submit</Button>
            </>
          )}
        </Form>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the form.
 */
export const Default: Story = {};

export const ShouldSucceedOnSubmit: Story = {
  name: "when typing a valid username, should not show an error message",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step, userEvent }) => {
    await step("Type a valid username", async () => {
      await userEvent.type(
        await canvas.findByRole("textbox", { name: /username/i }),
        "mockuser",
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i }),
      );
      await expect(
        canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        }),
      ).toBeNull();
    });
  },
};

export const ShouldWarnOnSubmit: Story = {
  name: "when typing a short username, should show an error message",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step, userEvent }) => {
    await step("Type a short username", async () => {
      await userEvent.type(
        await canvas.findByRole("textbox", { name: /username/i }),
        "fail",
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i }),
      );
      await expect(
        canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        }),
      ).toBeVisible();
    });
  },
};
