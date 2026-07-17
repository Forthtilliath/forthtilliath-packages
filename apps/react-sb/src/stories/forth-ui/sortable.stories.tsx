import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GripVerticalIcon } from "lucide-react";

import { Sortable } from "@forthtilliath/forth-ui/components/sortable";

interface Task {
  id: string;
  label: string;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", label: "Design the landing page" },
  { id: "2", label: "Set up CI pipeline" },
  { id: "3", label: "Write onboarding docs" },
  { id: "4", label: "Ship v1.0" },
];

/**
 * A drag-to-reorder list, built on native HTML5 drag events.
 */
const meta = {
  title: "forth-ui/Sortable",
  component: Sortable,
  args: {
    items: [],
    onReorder: () => undefined,
    getKey: () => "",
    renderItem: () => null,
  },
} satisfies Meta<typeof Sortable>;

export default meta;

type Story = StoryObj<typeof meta>;

function SortableExample() {
  const [tasks, setTasks] = React.useState(INITIAL_TASKS);

  return (
    <Sortable
      items={tasks}
      onReorder={setTasks}
      getKey={(task) => task.id}
      className="w-80"
      renderItem={(task) => (
        <div className="bg-card flex items-center gap-2 rounded-md border p-3 text-sm">
          <GripVerticalIcon className="text-muted-foreground size-4" />
          {task.label}
        </div>
      )}
    />
  );
}

/**
 * Drag an item by its handle to reorder the list.
 */
export const Default: Story = {
  render: () => <SortableExample />,
};
