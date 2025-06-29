import reactConfig from "@forthtilliath/eslint-config/react";
import storybookConfig from "@forthtilliath/eslint-config/storybook";
import type { Linter } from "eslint";

export default [...reactConfig, ...storybookConfig] as Linter.Config[];
