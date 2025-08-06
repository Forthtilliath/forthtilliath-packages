import type { Preview } from "@storybook/react-vite";

// To be able to use all classes inside stories className inputs
import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

import { twDecoratorHtml } from "./decorators";

// Add background for previews
import "@forthtilliath/shadcn-ui/globals-static.css";
// Add global styles
import "@forthtilliath/forth-ui/styles/globals.css";

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
