import type { Preview } from "@storybook/react-vite";

import { twDecoratorHtml } from "./decorators";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // To not have conflicts with decorators which setup the theme
    backgrounds: { disable: true },
  },
  tags: ["autodocs"],
  decorators: [twDecoratorHtml],
};

export default preview;
