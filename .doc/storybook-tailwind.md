# Storybook + Tailwind + thèmes

Setup réel dans `apps/react-sb/.storybook/` (à ne pas confondre avec des
essais antérieurs — ce fichier documente ce qui tourne aujourd'hui).

## CSS : build séparé, pas de plugin Vite Tailwind

Storybook sert un CSS **précompilé**, pas du Tailwind live via un plugin
Vite. `apps/react-sb/src/styles/globals.css` (source) importe **les
sources** : `@forthtilliath/shadcn-ui/styles/globals-static.css` (Tailwind +
`@theme`) + `themes/twitter.css`, les CSS de forth-ui dont les stories ont
besoin (`shiki.css`, `marquee.css`, par chemin relatif) et les siens
(`safelist.css`, `storybook.css`). Il n'importe **plus** le CSS publié de
forth-ui (depuis la PR #124) : ce dernier n'a pas de `@theme`, donc le
Tailwind de react-sb ne pouvait générer aucune couleur de thème et les
stories shadcn en dépendaient. Le script `build:tw` (Tailwind CLI, one-shot)
compile ça vers `.storybook/globals.css` (non versionné), chargé en `<link>`
par [`preview-body.html`](../apps/react-sb/.storybook/preview-body.html) :

```bash
pnpm run build:tw   # one-shot (lancé par predev / pretest / prebuild-storybook)
pnpm run dev:tw     # watch, à lancer en parallèle de `storybook dev`
```

## Thème clair/sombre : `@storybook/addon-themes`

[`decorators.ts`](../apps/react-sb/.storybook/decorators.ts) bascule la
classe `dark` sur `<html>` via `withThemeByClassName` — un seul axe
possible avec cet addon (son global `theme` est déjà pris).

```ts
export const twDecoratorHtml = withThemeByClassName<ReactRenderer>({
  themes: { light: "", dark: "dark" },
  defaultTheme: "light",
});
```

## Thème de couleur (palette) : décorateur custom, pas addon-themes

Pour un second sélecteur indépendant (palette tweakcn : blue, violet,
bubblegum, ...), `addon-themes` ne suffit pas — il ne gère qu'un seul axe.
[`color-themes.ts`](../apps/react-sb/.storybook/color-themes.ts) importe
le CSS brut de chaque fichier de thème via `import.meta.glob(..., {
query: "?raw" })` (fonctionnalité Vite), et un décorateur injecte le texte
du thème sélectionné dans un `<style>` non-layé au clic sur le toolbar.

Point piégeux réglé : `globals.css` compilé déclare déjà `--background`,
`--primary`, etc. en `:root`/`.dark` non-layés lui aussi (et même en
double — `globals-static.css` importe `themes/default.css`
inconditionnellement, puis `twitter.css` gagne par ordre de source). Se
reposer sur "mon `<style>` est ajouté après, donc il gagne" est trop
fragile (dépend de détails de service du dev server Vite). La solution
robuste : forcer `!important` sur chaque déclaration `--var: ...;`
injectée (`forceImportant()` dans `color-themes.ts`) — ça gagne quel que
soit le layer/la spécificité/l'ordre.

`preview.ts` déclare `colorTheme` comme global Storybook séparé
(`globalTypes` + `initialGlobals`), indépendant du `theme` d'addon-themes.
