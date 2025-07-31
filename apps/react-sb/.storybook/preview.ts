import type { Preview } from "@storybook/react-vite";

// To be able to use all classes inside stories className inputs
import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

import "@forthtilliath/shadcn-ui/globals.css";
import "@forthtilliath/shadcn-ui/themes/default.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  tags: ["autodocs"],
};

export default preview;
