import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@forthtilliath/forth-ui/components/password-input";

/**
 * A password `Input` with a show/hide visibility toggle, plus a companion
 * `PasswordStrengthMeter`.
 */
const meta = {
  title: "forth-ui/Forms/PasswordInput",
  component: PasswordInput,
  args: {
    className: "w-72",
    placeholder: "Enter your password",
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — click the eye icon to reveal the password.
 */
export const Default: Story = {};

function WithStrengthMeterExample() {
  const [password, setPassword] = React.useState("");
  return (
    <div className="grid w-72 gap-2">
      <PasswordInput
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Enter your password"
      />
      <PasswordStrengthMeter password={password} />
    </div>
  );
}

/**
 * Paired with `PasswordStrengthMeter` — type to see the score update.
 */
export const WithStrengthMeter: Story = {
  render: () => <WithStrengthMeterExample />,
};
