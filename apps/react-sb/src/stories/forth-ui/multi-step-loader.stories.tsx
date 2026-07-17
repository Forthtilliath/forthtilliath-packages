import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MultiStepLoader } from "@forthtilliath/forth-ui/components/multi-step-loader";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

const LOADING_STATES = [
  { text: "Uploading files" },
  { text: "Scanning for viruses" },
  { text: "Processing images" },
  { text: "Generating thumbnails" },
  { text: "Done!" },
];

/**
 * A full-screen overlay stepping through a sequence of loading messages —
 * for operations that take long enough that a single spinner reads as
 * stuck.
 */
const meta = {
  title: "forth-ui/MultiStepLoader",
  component: MultiStepLoader,
  args: {
    loadingStates: LOADING_STATES,
    loading: true,
    duration: 1000,
    loop: false,
  },
} satisfies Meta<typeof MultiStepLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Shown directly via the `loading` control — toggle it in the Controls
 * panel below.
 */
export const Default: Story = {};

/**
 * A more realistic usage: triggered by a button, advancing on its own
 * timer, dismissed by the caller once the real work finishes.
 */
export const Triggered: Story = {
  render: (args) => {
    function TriggeredDemo() {
      const [loading, setLoading] = useState(false);
      return (
        <div>
          <Button
            onClick={() => {
              setLoading(true);
            }}
          >
            Start upload
          </Button>
          <MultiStepLoader {...args} loading={loading} value={undefined} />
          {loading && (
            <Button
              variant="outline"
              className="fixed top-4 right-4 z-50"
              onClick={() => {
                setLoading(false);
              }}
            >
              Close
            </Button>
          )}
        </div>
      );
    }
    return <TriggeredDemo />;
  },
  args: {
    loading: false,
  },
};
