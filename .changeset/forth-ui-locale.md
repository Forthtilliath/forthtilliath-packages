---
"@forthtilliath/forth-ui": minor
---

Bilingual built-in labels (French / English):

- **`locale` prop (`"fr" | "en"`)** on every component with built-in text, plus a **`UiLocaleProvider`** (new `@forthtilliath/forth-ui/locale` entry point, with `UI_MESSAGES` and `useUiLocale`) to set it once for a whole tree. A component's own `locale` wins; its text props (`placeholder`, `emptyMessage`, `ariaLabel`, `cancelLabel`/`confirmLabel`…) still override individual strings.
- **Behavior change — French is now the default**, like `react-native-kit`: `aria-label`s ("Fermer", "Copier le code", "Chargement"…), default placeholders ("Sélectionner…", "Choisir une date"…), empty states ("Aucun résultat."), and the visible Pagination ("Précédent" / "Suivant") and ConfirmDialog ("Annuler" / "Continuer") buttons. Wrap the app in `<UiLocaleProvider locale="en">` to keep the previous English text.
- `Spinner`, `Avatar` and `QrCode` are now client components (`"use client"`), to read the locale context.
