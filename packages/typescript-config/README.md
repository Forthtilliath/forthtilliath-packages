# @forthtilliath/typescript-config

Shared `tsconfig.json` bases for every package/app in this monorepo:
`strict: true`, `noUncheckedIndexedAccess`, ES2022 target, NodeNext module
resolution.

## Install

```json
{
  "devDependencies": {
    "@forthtilliath/typescript-config": "workspace:*"
  }
}
```

## Usage

```json
// A plain TypeScript library (packages/lib, packages/types, packages/eslint-config)
{
  "extends": "@forthtilliath/typescript-config/base.json"
}
```

```json
// A React library or Vite app (packages/react/*, apps/react-sb)
{
  "extends": "@forthtilliath/typescript-config/react.json"
}
```

```json
// A Next.js app (apps/web)
{
  "extends": "@forthtilliath/typescript-config/nextjs.json"
}
```

```json
// An Angular app/library
{
  "extends": "@forthtilliath/typescript-config/angular.json"
}
```

`react.json` and `angular.json` both extend `base.json` directly (each
targets a different framework, neither needs the other's settings);
`nextjs.json` extends `react.json` (adds the `next` TS plugin, `.next/types`
inclusion, and the `@/*` path alias).

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

Packages typically add their own `compilerOptions` on top for `outDir`/
`rootDir`, and their own `include`/`exclude` — this package only supplies the
shared defaults, not a full ready-to-use config.

## Scripts

None — this package ships raw `.json` files, no build step.
