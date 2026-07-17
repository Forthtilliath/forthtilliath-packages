import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileIcon, FileTextIcon, TrashIcon } from "lucide-react";

import {
  FileList,
  FileListAction,
  FileListActions,
  FileListContent,
  FileListDescription,
  FileListDescriptionSeparator,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListProgress,
} from "@forthtilliath/forth-ui/components/file-list";

/**
 * Displays a list of files with details such as name, size, and upload
 * progress.
 */
const meta = {
  title: "forth-ui/Data Display/FileList",
  component: FileList,
  args: {
    className: "w-96",
  },
} satisfies Meta<typeof FileList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A mix of an in-progress upload and two completed files.
 */
export const Default: Story = {
  render: (args) => (
    <FileList {...args}>
      <FileListItem>
        <FileListHeader>
          <FileListIcon>
            <FileTextIcon />
          </FileListIcon>
          <FileListInfo>
            <FileListName>report-q3.pdf</FileListName>
            <FileListDescription>
              <span>1.2 MB</span>
              <FileListDescriptionSeparator />
              <span>Uploading&hellip; 45%</span>
            </FileListDescription>
          </FileListInfo>
          <FileListActions>
            <FileListAction aria-label="Cancel upload">
              <TrashIcon />
            </FileListAction>
          </FileListActions>
        </FileListHeader>
        <FileListContent>
          <FileListProgress value={45} />
        </FileListContent>
      </FileListItem>

      <FileListItem>
        <FileListHeader>
          <FileListIcon>
            <FileIcon />
          </FileListIcon>
          <FileListInfo>
            <FileListName>architecture-diagram.png</FileListName>
            <FileListDescription>
              <span>440 kB</span>
            </FileListDescription>
          </FileListInfo>
          <FileListActions>
            <FileListAction aria-label="Remove file">
              <TrashIcon />
            </FileListAction>
          </FileListActions>
        </FileListHeader>
      </FileListItem>
    </FileList>
  ),
};
