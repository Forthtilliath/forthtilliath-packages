---
"@forthtilliath/eslint-config": minor
---

**Breaking:** variant- and option-specific plugins are now optional peer dependencies instead of regular dependencies, so a project only installs what its variant uses (a React Native app went from 579 to 280 installed packages: no more `angular-eslint` + Angular CLI, `turbo`, `eslint-plugin-jsx-a11y`...).

To upgrade, install the plugins of your variant as devDependencies (see the README's install table):

- `/react`: `@eslint-react/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh`
- `/react-native`: the `/react` list + `eslint-plugin-react-native`
- `/nextjs`: the `/react` list + `@next/eslint-plugin-next`
- `/storybook`: the `/react` list + `eslint-plugin-storybook`
- `/angular`: `angular-eslint`
- options: `eslint-plugin-turbo` (`turbo`, on by default), `eslint-plugin-jsx-a11y` (`a11y`, on by default for React/Next.js/Storybook), `eslint-plugin-i18next` (`i18n`), `eslint-plugin-testing-library` + `eslint-plugin-jest-dom` (`testingLibrary`).

A missing plugin fails with an error naming the package to install or the option to turn off.
