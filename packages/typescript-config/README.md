# @forthtilliath/typescript-config

Shared `tsconfig.json` bases: `strict: true`, `noUncheckedIndexedAccess`,
ES2022 target, NodeNext module resolution — plus React, Next.js and Angular
presets on top.

## Install

```bash
npm install -D @forthtilliath/typescript-config
```

Within this monorepo:

```json
{
  "devDependencies": {
    "@forthtilliath/typescript-config": "workspace:*"
  }
}
```

## Usage

```json
// A plain TypeScript library (packages/ts-kit, packages/eslint-config...)
{
  "extends": "@forthtilliath/typescript-config/base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

```json
// A React library or Vite app (packages/react/*, apps/react-sb)
{
  "extends": "@forthtilliath/typescript-config/react.json",
  "include": ["src"]
}
```

```json
// A Next.js app (apps/web)
{
  "extends": "@forthtilliath/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.mts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

```json
// An Angular app/library
{
  "extends": "@forthtilliath/typescript-config/angular.json",
  "include": ["src/**/*.ts"]
}
```

| Preset         | Extends      | Adds                                                                                                                                                                                   |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base.json`    | —            | `strict`, `noUncheckedIndexedAccess`, `isolatedModules`, ES2022, NodeNext, declarations                                                                                                |
| `react.json`   | `base.json`  | `jsx: react-jsx`, bundler resolution                                                                                                                                                   |
| `nextjs.json`  | `react.json` | The compiler options `create-next-app` generates (`next` TS plugin, `allowJs`, `noEmit`, `incremental`, ESNext + DOM libs), plus `noImplicitOverride` and `noFallthroughCasesInSwitch` |
| `angular.json` | `base.json`  | Angular CLI's generated settings (see below)                                                                                                                                           |

### `include`, `exclude` and `paths` stay in your project

The presets only carry `compilerOptions`. File lists and path aliases belong
in the consuming project's own tsconfig:

- a relative path in a tsconfig resolves against the file that declares it,
  so written here it would point inside
  `node_modules/@forthtilliath/typescript-config/`;
- TypeScript 5.5's `${configDir}` fixes that for `tsc`, but not for the tools
  that actually resolve imports at build/test time — Turbopack ignores a
  `${configDir}` `paths` alias (every `@/…` import fails to resolve) and
  `vite-tsconfig-paths` (Vitest) ignores a `${configDir}` `include` (the
  alias is never applied to the matched files).

### Angular

`angular.json` mirrors the Angular CLI's own generated tsconfig:
`experimentalDecorators` (paired with `useDefineForClassFields: false`, the
combination that keeps decorated property initializers working, e.g.
`@Input()`), `"module": "preserve"` + `"moduleResolution": "bundler"` for the
esbuild-based build system (Angular 17+), a few extra strict flags
(`noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`) the CLI enables by
default — kept scoped to this preset rather than added to `base.json`, since
that would newly apply them to every existing package instead of just future
Angular ones — and `angularCompilerOptions.strictTemplates` (checked by
`ngc`, not `tsc`, but read from this same file), which is what actually
catches a typo'd property or wrong-typed binding in a `.html` template
instead of failing silently at runtime.

## Scripts

None — this package ships raw `.json` files, no build step.
