import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@forthtilliath/forth-ui/components/button";
import {
  ConfirmDialogProvider,
  useConfirm,
} from "@forthtilliath/forth-ui/components/confirm-dialog";

/**
 * Provides `useConfirm`, an imperative `await confirm({...})` alternative
 * to hand-wiring an `AlertDialog`'s open state.
 */
const meta = {
  title: "forth-ui/Overlays/ConfirmDialog",
  component: ConfirmDialogProvider,
  args: {
    children: null,
  },
} satisfies Meta<typeof ConfirmDialogProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

function DeleteButton() {
  const confirm = useConfirm();
  const [result, setResult] = React.useState<string | null>(null);

  async function handleClick() {
    const confirmed = await confirm({
      title: "Delete this item?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "destructive",
    });
    setResult(confirmed ? "Confirmed" : "Cancelled");
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="destructive"
        onClick={() => {
          void handleClick();
        }}
      >
        Delete item
      </Button>
      {result !== null && (
        <span className="text-muted-foreground text-sm">{result}</span>
      )}
    </div>
  );
}

/**
 * Click the button — `confirm()` resolves `true`/`false` once the dialog
 * closes.
 */
export const Default: Story = {
  render: () => (
    <ConfirmDialogProvider>
      <DeleteButton />
    </ConfirmDialogProvider>
  ),
};
