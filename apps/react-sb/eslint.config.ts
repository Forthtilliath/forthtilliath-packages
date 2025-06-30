import type { Linter } from "eslint";

import reactConfig from "@forthtilliath/eslint-config/react";
import storybookConfig from "@forthtilliath/eslint-config/storybook";

export default [...reactConfig, ...storybookConfig] as Linter.Config[];
