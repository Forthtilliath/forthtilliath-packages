import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { expect } from "storybook/test";
import z from "zod/v4";

import { Field } from "@forthtilliath/shadcn-ui/components/blocks/field";
import { Form } from "@forthtilliath/shadcn-ui/components/blocks/form";

/**
 * Building forms with React Hook Form and Zod.
 */
const meta: Meta<typeof Form> = {
  title: "shadcn-ui-derived/Field",
  component: Form,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ProfileForm {...args} />,
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
});

const ProfileForm = (args: Story["args"]) => {
  function onSubmit(values: z.infer<typeof formSchema>) {
    action("onSubmit")(values);
  }
  return (
    <Form
      {...args}
      defaultValues={{
        username: "",
      }}
      schema={formSchema}
      onSubmit={onSubmit}
      className="space-y-8"
    >
      {({ register }) => (
        <Field
          label="Username"
          description="This is your public display name."
          {...register("username")}
        />
      )}
    </Form>
  );
};

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
        "mockuser"
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i })
      );
      await expect(
        canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        })
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
        "fail"
      );
    });

    await step("Click the submit button", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /submit/i })
      );
      await expect(
        canvas.queryByText(/username must be at least 6 characters/i, {
          exact: true,
        })
      ).toBeVisible();
    });
  },
};
