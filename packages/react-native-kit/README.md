# @forthtilliath/react-native-kit

Small React Native building blocks — components, hooks, and a framework-agnostic util — with no opinion on your app's theme, distributed one file per export (grouped under `components/{form,layout,feedback,list,overlay,picker,theme,settings}/`, `hooks/`, `utils/{helpers,files,calendar}/`) so consumers only pull in what they use. Update-checking UI (`ChangelogNotes`, `UpdateAvailableBanner`, `useUpdateCheck`) lives in the sibling `@forthtilliath/expo-release-updates-ui` package instead.

## Install

```bash
npm install @forthtilliath/react-native-kit react react-native
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/react-native-kit": "workspace:*"
  }
}
```

`react` and `react-native` are the only required peer dependencies — install them in the consuming app if not already present. Every other peer dependency is **optional**, needed only if you import the components that use them: `@expo/vector-icons` (`Thumbnail`, `PickerModal`, `SwipeableRow`, `ReorderList`, the settings screens…), `expo-file-system` (`pickTextFile`, app files), `expo-image-picker` (`PhotoPicker`), `expo-speech-recognition` (`VoiceSearchButton`/`PickerModal`), `react-native-gesture-handler` (`DragHandle`, `SwipeableRow`), `react-native-reanimated` (`SwipeableRow`) and `@forthtilliath/expo-release-updates-ui` (`UpdateSettingsScreen`). Package managers no longer install them for you, so a native module (and the Android permissions it declares, e.g. `CAMERA` for `expo-image-picker`) only ends up in your APK if you add it yourself.

## Usage

Each component is its own module — import the file you need directly:

```ts
import { PhotoPicker } from "@forthtilliath/react-native-kit/components/picker/PhotoPicker";
```

This is the recommended way to import: Metro (React Native's bundler) doesn't reliably tree-shake, so pulling from a single deep-import path keeps peer dependencies you don't use (`expo-image-picker`, `expo-speech-recognition`, `react-native-gesture-handler`...) out of your bundle entirely, rather than merely unused.

A root barrel is also available for convenience — but since it imports every module, Metro will fail to resolve any optional peer dependency you haven't installed. Use it only if you have them all:

```ts
import { PhotoPicker, useSubmitGuard } from "@forthtilliath/react-native-kit";
```

**Avoid the barrel under Jest (or any other CommonJS `require` consumer).** `export * from` re-exports are evaluated eagerly on `require()` — unlike Metro's ESM bundling, there's no tree-shaking to skip the unused ones. Requiring the barrel from _any_ file, even one that only wants a framework-agnostic util like `getMostRecentIds`, pulls in every component's module graph, including native-module imports (`expo-speech-recognition` via `VoiceSearchButton`/`PickerModal`) that don't exist in a Jest environment — this throws `Cannot find native module '...'` at require time, not just at runtime for an unrendered component. Deep imports only ever load the one module you asked for, so they don't have this problem in any environment.

### Languages (`locale`)

Every component with built-in copy (labels, hints, accessibility labels, default sections…) ships it in **French** (default) and **English**. Pick the language:

- per component, with a `locale` prop: `<UndoToast locale="en" … />`;
- or once for a whole tree — handy for a bilingual app — with `KitLocaleProvider`:

```tsx
import { KitLocaleProvider } from "@forthtilliath/react-native-kit/i18n/KitLocaleProvider";

<KitLocaleProvider locale={userLanguage /* "fr" | "en" */}>
  <App />
</KitLocaleProvider>;
```

A component's own `locale` prop wins over the provider, and its `labels` prop still overrides individual strings on top of either. The locale also drives `VoiceSearchButton`'s speech-recognition language (`fr-FR` / `en-US`) and `UpdateSettingsScreen`'s date format, unless `lang` / `dateLocale` are passed. `confirmDestructive`, being a plain function, can't read the provider: pass it `{ locale }`.

### `<Thumbnail photoUri={...} placeholderIcon="..." />`

List-row thumbnail: the photo if there is one, otherwise a placeholder icon.

```tsx
import { Thumbnail } from "@forthtilliath/react-native-kit/components/list/Thumbnail";

<Thumbnail
  photoUri={container.photoUri}
  placeholderIcon="cube-outline"
  size={48}
/>;
```

### `<SwipeableRow onDelete={...} deleteLabel="...">`

Swipe a list row left to reveal a delete button, on top of a tap to edit it. Built on react-native-gesture-handler's `ReanimatedSwipeable`, so it needs `react-native-reanimated` installed. The text under the trash icon defaults to "Supprimer" ("Delete" in English), overridable with `deleteText`.

```tsx
import { SwipeableRow } from "@forthtilliath/react-native-kit/components/list/SwipeableRow";

<SwipeableRow
  onDelete={() => remove(item.id)}
  deleteLabel={`Delete ${item.name}`}
>
  <ItemRow item={item} />
</SwipeableRow>;
```

### `<ColorDot color={...} />`

A small round color swatch — the coloured bullet next to a category, a team, a
tag, or a status. **Renders `null` when `color` is `undefined`**, so a list row
can bind an optional color field without guarding it at the call site.

```tsx
import { ColorDot } from "@forthtilliath/react-native-kit/components/list/ColorDot";

<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
  <ColorDot color={category.color} />
  <Text>{category.name}</Text>
</View>;
```

| Prop    | Type                   | Default | Notes                                                             |
| ------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| `color` | `string \| undefined`  | —       | Any RN color string. `undefined` → renders nothing.               |
| `size`  | `number`               | `10`    | Diameter in px; always a full circle (`borderRadius = size / 2`). |
| `style` | `StyleProp<ViewStyle>` | —       | Merged **after** the computed style, so it wins on conflicts.     |

```tsx
// Bigger, with a subtle ring, and some trailing space:
<ColorDot
  color={team.color}
  size={16}
  style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.15)", marginRight: 6 }}
/>
```

### `<UndoToast message={...} onAction={...} />`

A bottom-of-screen snackbar for **undoing an action that already happened** —
the counterpart to a delete that runs immediately with no confirmation dialog
(for instance a `SwipeableRow` swipe). Presentational only: it does not time
itself out, animate, or stack — the host owns the "pending undo" state, the
commit timer, and any enter/exit animation, which keeps this component free of
timer or animation-library opinions.

```tsx
import { UndoToast } from "@forthtilliath/react-native-kit/components/list/UndoToast";

{
  recentlyDeleted && (
    <UndoToast
      message={`"${recentlyDeleted.name}" deleted`}
      onAction={restoreLast}
    />
  );
}
```

| Prop          | Type              | Default                           | Notes                                                                               |
| ------------- | ----------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| `message`     | `string`          | —                                 | Past tense; single line, truncated with an ellipsis.                                |
| `actionLabel` | `string`          | `"Annuler"` (`"Undo"` in English) | The tappable label on the right.                                                    |
| `locale`      | `KitLocale`       | `"fr"`                            | Language of the default `actionLabel` (see [Languages](#languages-locale)).         |
| `onAction`    | `() => void`      | —                                 | Reverse the change here. The host then hides the toast.                             |
| `styles`      | `UndoToastStyles` | —                                 | Per-slot overrides (`toast` / `message` / `action`), each merged after its default. |

Full pattern — commit for good after 5s, localized label, re-themed:

```tsx
const [pending, setPending] = useState<Employee | null>(null);

function remove(employee: Employee) {
  setEmployees((list) => list.filter((e) => e.id !== employee.id));
  setPending(employee);
}

useEffect(() => {
  if (!pending) return;
  const id = setTimeout(() => {
    db.deleteEmployee(pending.id); // point of no return
    setPending(null);
  }, 5000);
  return () => clearTimeout(id);
}, [pending]);

{
  pending && (
    <UndoToast
      message={`« ${pending.name} » supprimé`}
      actionLabel="Annuler"
      onAction={() => {
        setEmployees((list) => [...list, pending]);
        setPending(null);
      }}
      styles={{
        toast: { backgroundColor: colors.inverseSurface },
        message: { color: colors.inverseOnSurface },
        action: { color: colors.inversePrimary },
      }}
    />
  );
}
```

### `<VoiceSearchButton onResult={...} />`

Microphone button to dictate a search instead of typing it. Safe to mount more than one at a time (e.g. a name field plus a search picker on the same screen) — only the instance that started listening reacts to its result.

```tsx
import { VoiceSearchButton } from "@forthtilliath/react-native-kit/components/picker/VoiceSearchButton";

<VoiceSearchButton onResult={setQuery} />;
```

Recognizes French by default (`fr-FR`, or `en-US` with `locale="en"`); pass `lang` for any other BCP 47 language.

### `<PhotoPicker photoUri={...} onChange={...} savePhoto={...} photoLabel="..." />`

Photo picker (camera or library) with a preview and a remove link. `savePhoto` is injected rather than hard-coded, so where/how the picked image gets persisted is entirely up to the caller.

Only the camera asks for a permission: the library opens the system photo picker, which needs none — the app can block `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES` (e.g. `android.blockedPermissions` in `app.json`).

```tsx
import { PhotoPicker } from "@forthtilliath/react-native-kit/components/picker/PhotoPicker";

<PhotoPicker
  photoUri={container.photoUri}
  onChange={(uri) => setPhotoUri(uri)}
  savePhoto={(sourceUri) => saveContainerPhoto(sourceUri)}
  photoLabel="of the container"
/>;
```

- `renderPreview(photoUri, saving)` replaces the square preview and the "Add a photo" placeholder (e.g. a round avatar with initials and a small camera badge); the press, permission and action sheet stay the same.
- While `savePhoto` runs, the picker ignores presses (`saving` is `true`, `accessibilityState.busy`).
- `onOpen()` fires when a press opens the camera/library choice — the place for a haptic tick (`onOpen={tapFeedback}`).
- A failure (camera, picker or `savePhoto` rejecting) goes to `onError(error)`; without it, an alert says the photo was not saved (`labels.saveErrorTitle` / `saveErrorMessage`).

### `<PickerModal visible title items onSelect onClose />`

Full-screen picker: search (typed or dictated via `VoiceSearchButton`), optional sections, and "add" actions always visible above the results.

```tsx
import {
  PickerModal,
  type PickerItem,
} from "@forthtilliath/react-native-kit/components/picker/PickerModal";

<PickerModal
  visible={pickerVisible}
  title="Choose a container"
  items={containers.map((c): PickerItem => ({
    id: c.id,
    label: c.name,
    imageUri: c.photoUri,
  }))}
  onSelect={(item) => setContainerId(item.id)}
  onClose={() => setPickerVisible(false)}
  extraActions={[
    {
      label: "Add a new container",
      onPress: () => router.push("/containers/new"),
    },
  ]}
/>;
```

Groups results into sections via each item's `group` (e.g. food groups, ingredients vs recipes) — ignored while searching, where the best global matches are shown instead. Pass `filterItems` for custom ranking (e.g. `rankByNameMatch` from this same package's `utils/`) instead of the default case-insensitive substring match.

For all 5 components above, styling and (where relevant) copy work the same way as `ChangelogNotes`: an optional `styles` prop (all fields optional, neutral defaults) and, for `PhotoPicker`/`PickerModal`, an optional `labels` prop over the built-in French or English copy (see [Languages](#languages-locale)).

### `useSubmitGuard()`

Prevents a second call while a first one is still pending — e.g. a double-tap on a "Save" button before it's had time to disable, which would otherwise create duplicate submissions.

```tsx
import { useSubmitGuard } from "@forthtilliath/react-native-kit/hooks/useSubmitGuard";

const { isSaving, guard } = useSubmitGuard();

<Pressable
  disabled={isSaving}
  onPress={() =>
    guard(async () => {
      await save();
    })
  }
>
  <Text>{isSaving ? "Saving…" : "Save"}</Text>
</Pressable>;
```

### `useDebouncedChange(values, delayMs, callback)`

Calls `callback` `delayMs` after the last change among `values`, ignoring renders where any value is still `undefined` (not loaded yet) and the very first render where they're all defined (no trigger on mount). A new change before the delay elapses resets the timer — a real debounce, not a throttle.

```tsx
import { useDebouncedChange } from "@forthtilliath/react-native-kit/hooks/useDebouncedChange";

useDebouncedChange([settingsData, itemsData], 5 * 60 * 1000, () => {
  runAutoBackup();
});
```

### `usePressRepeat(timings?)`

Repeats an action while a button is held, faster and faster: `start(action)` runs it at once, then every 180 ms after 450 ms, every 60 ms after 1.2 s of repeating (all four timings overridable); `stop()` ends it, and so does unmounting.

```tsx
import { usePressRepeat } from "@forthtilliath/react-native-kit/hooks/usePressRepeat";

const repeat = usePressRepeat();

<Pressable
  onPressIn={() => repeat.start(() => setCount((n) => n + 1))}
  onPressOut={repeat.stop}
/>;
```

### `useViewShare(options?)`

Shares as an image a view rendered only for the capture (a scoreboard, a summary card): `share()` sets `capturing` to `true`, waits two frames for the screen to mount and draw the view attached to `ref`, then calls `shareViewAsImage`. A failure shows an alert with the error's message (French or English titles, `errorTitle` / `errorMessage` to override), or goes to `onError(error)`. A second `share()` while one runs is ignored. Takes `shareViewAsImage`'s options (`dialogTitle`…).

```tsx
import { useViewShare } from "@forthtilliath/react-native-kit/hooks/useViewShare";

const ranking = useViewShare({ dialogTitle: "Partager le classement" });

<Button title="Partager" onPress={() => void ranking.share()} />;
{
  ranking.capturing ? (
    <View ref={ranking.ref} collapsable={false} style={offScreen}>
      <RankingCard />
    </View>
  ) : null;
}
```

### `confirmDestructive(title, onConfirm, options?)`

Generic destructive-action confirmation (title + message + Cancel/Confirm), for anything irreversible (delete, reset...). Ships with French defaults, or English ones with `{ locale: "en" }` (`message`, `cancelLabel`, `confirmLabel` all overridable).

```ts
import { confirmDestructive } from "@forthtilliath/react-native-kit/utils/helpers/confirmDestructive";

confirmDestructive("Delete this item?", () => deleteItem(id), {
  locale: "en",
  confirmLabel: "Remove",
});
```

### `useEffectiveColorScheme(preference)`

Resolves a `"light" | "dark" | "system"` theme preference against the device's color scheme: `"system"` follows the device, `"light"`/`"dark"` override it regardless of what the device is set to.

```tsx
import { useEffectiveColorScheme } from "@forthtilliath/react-native-kit/hooks/useEffectiveColorScheme";

const scheme = useEffectiveColorScheme(themePreference); // "light" | "dark"
const colors = scheme === "dark" ? darkColors : lightColors;
```

### `<ThemeToggle value onChange />`

3-way segmented control for a light/dark/system theme preference.

```tsx
import { ThemeToggle } from "@forthtilliath/react-native-kit/components/theme/ThemeToggle";

<ThemeToggle value={themePreference} onChange={setThemePreference} />;
```

### `<ThemeOptionList value onChange />`

Same light/dark/system data contract as `ThemeToggle`, but rendered as a list of full-width rows (icon + label + checkmark on the active one) instead of a segmented control.

```tsx
import { ThemeOptionList } from "@forthtilliath/react-native-kit/components/theme/ThemeOptionList";

<ThemeOptionList value={themePreference} onChange={setThemePreference} />;
```

### `<BackgroundPicker options value onChange />` + `findBackground(options, id)`

Radio group of background swatches, each drawing the page and a card in the colours on offer (`{ id, label, page, card, cardBorder? }`), the chosen one outlined with a check mark. `onChange` receives the whole option (extra fields kept: the full palette to apply). `findBackground` reads a saved id back, falling back to the first option (the original background) for an unknown id. Check each palette's text contrast in a test with `contrastRatio` from `@forthtilliath/ts-kit/color/contrastRatio`.

```tsx
import { BackgroundPicker } from "@forthtilliath/react-native-kit/components/theme/BackgroundPicker";
import { findBackground } from "@forthtilliath/react-native-kit/components/theme/findBackground";

const background = findBackground(DARK_BACKGROUNDS, settings.background);

<BackgroundPicker
  options={DARK_BACKGROUNDS}
  value={background.id}
  onChange={(option) => {
    selectFeedback();
    saveBackground(option.id);
  }}
/>;
```

### `<ThemePreferenceProvider load save>` + `useThemePreference()` / `useResolvedScheme()`

Holds the light/dark/system preference in a context: loaded once on mount through `load`, changed from anywhere with `useThemePreference().setPreference`, persisted through `save`. Storage-agnostic. A choice made before `load` resolves isn't overwritten by the stored value. `useResolvedScheme()` returns the scheme actually applied (`"light" | "dark"`), to pick the palette.

```tsx
import { ThemePreferenceProvider } from "@forthtilliath/react-native-kit/components/theme/ThemePreferenceProvider";
import { useResolvedScheme } from "@forthtilliath/react-native-kit/components/theme/themePreferenceContext";

<ThemePreferenceProvider
  load={async () => (await getSettings()).theme}
  save={async (theme) => saveSettings({ ...(await getSettings()), theme })}
>
  <App />
</ThemePreferenceProvider>;

const colors = Colors[useResolvedScheme()];
```

### Forms, layout and feedback

The everyday building blocks most apps rewrote on their own (buttons, fields, section titles, empty lists, toasts…). Each screenshot shows the component twice: with its neutral defaults, then in an app's dark palette through `colors` / `styles` — produced by [`apps/rn-gallery`](../../apps/rn-gallery#readme).

Theming follows one rule everywhere: a `colors` object for the few colors a component derives its variants from, and a `styles` prop whose slots are each merged **after** their default (overriding `button.borderRadius` keeps the rest of the slot). Wrap them once per app in thin adapters that pass your palette:

```tsx
// ui/Button.tsx — the app's own Button, 5 lines
import {
  Button as KitButton,
  type ButtonProps,
} from "@forthtilliath/react-native-kit/components/form/Button";

export function Button(props: ButtonProps) {
  const c = useColors();
  return (
    <KitButton
      colors={{
        primary: c.primary,
        onPrimary: c.onPrimary,
        secondary: c.card,
        onSecondary: c.text,
        border: c.border,
        danger: c.danger,
        onDanger: c.onPrimary,
      }}
      {...props}
    />
  );
}
```

#### `<Button label onPress />`

![Button: five variants, three sizes, loading and disabled states, icons](docs/screenshots/button.png)

Five variants, three sizes, an optional icon, a loading state — and **no double submission**: when `onPress` returns a promise, the button shows a spinner and ignores presses until it settles (a ref also blocks a second tap arriving before the re-render). A rejection goes to `onError`; without it, it stays unhandled as it would have without the button.

```tsx
import { Button } from "@forthtilliath/react-native-kit/components/form/Button";

<Button label="Enregistrer" onPress={async () => { await save(); router.back(); }} onError={showError} />
<Button label="Supprimer" variant="danger" onPress={() => confirmDestructive("Supprimer ?", remove)} />
<Button label="Suivant" iconPosition="end" icon={(color) => <Ionicons name="arrow-forward" size={20} color={color} />} />
// A gradient background (Android draws SVG gradients badly inside a button):
<Button label="Jouer" background={<Image source={gradient} style={StyleSheet.absoluteFill} resizeMode="stretch" />} />
```

| Prop                                                                                    | Type                                                           | Default     | Notes                                                                                                    |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `label`                                                                                 | `string`                                                       | —           | Also its spoken name, unless `accessibilityLabel` is set.                                                |
| `onPress`                                                                               | `() => void \| Promise<unknown>`                               | —           | A returned promise turns the button busy until it settles.                                               |
| `onError`                                                                               | `(error) => void`                                              | —           | Receives a rejection of `onPress`'s promise.                                                             |
| `variant`                                                                               | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"primary"` |                                                                                                          |
| `size`                                                                                  | `"sm" \| "md" \| "lg"`                                         | `"md"`      | 36 / 48 / 56 dp high. 48 dp is Android's minimum touch target: give `sm` a `hitSlop` if it stands alone. |
| `disabled`, `loading`                                                                   | `boolean`                                                      | `false`     | Both ignore presses; `loading` shows a spinner and is announced as busy.                                 |
| `icon`                                                                                  | `ReactNode \| (color) => ReactNode`                            | —           | The function form receives the label color of the current variant.                                       |
| `iconPosition`                                                                          | `"start" \| "end"`                                             | `"start"`   |                                                                                                          |
| `fullWidth`                                                                             | `boolean`                                                      | `false`     | `alignSelf: "stretch"`.                                                                                  |
| `background`                                                                            | `ReactNode`                                                    | —           | Drawn under the label, filling the button, clipped to its corners.                                       |
| `colors`                                                                                | `ButtonColors`                                                 | neutral     | `primary`, `onPrimary`, `secondary`, `onSecondary`, `border`, `danger`, `onDanger`.                      |
| `styles`                                                                                | `ButtonStyles`                                                 | —           | Slots `button`, `pressed`, `disabled`, `content`, `label`.                                               |
| `accessibilityLabel`, `accessibilityHint`, `maxFontSizeMultiplier`, `hitSlop`, `testID` |                                                                |             | Passed through.                                                                                          |

#### `<TextField label />` and `<IntegerField label value onChange />`

![TextField with hint, error and required marker; IntegerField with a negative value](docs/screenshots/text-field.png)

`TextField` is a `TextInput` with its label, an optional hint and an error: the label is its spoken name (" \*" and "obligatoire" / "required" with `required`), the hint or the error its spoken hint, and the error is **announced by TalkBack as soon as it appears** (`accessibilityLiveRegion`). The border thickens on focus and turns red on error. Every other `TextInput` prop goes through — set `maxLength` on every free-text field.

`IntegerField` types like plain text: a lone "-" before a negative number stays (instead of becoming 0), an emptied field stays empty while typing, pasted junk is cleaned (`1 250 pts` → 1250). Each valid value within `min`…`max` goes to `onChange`; on blur, an out-of-range value is clamped and an unfinished one shows the last valid value again. The keyboard is `numeric` when negatives are allowed (`min < 0`; Android's `number-pad` has no minus key), `number-pad` otherwise. Built on `sanitizeIntegerInput` / `parseIntegerInput` from `@forthtilliath/ts-kit`.

```tsx
import { IntegerField } from "@forthtilliath/react-native-kit/components/form/IntegerField";
import { TextField } from "@forthtilliath/react-native-kit/components/form/TextField";

<TextField label="Nom du joueur" value={name} onChangeText={setName} maxLength={30} required
  error={name.trim() ? null : "Le nom est obligatoire."} />
<IntegerField label="Points de merveille" value={points} onChange={setPoints} min={-30} max={99} />
```

| Prop (`TextField`) | Type              | Notes                                                                                                              |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `label`            | `string`          | Shown above, read as the input's name (the visible label itself is hidden from TalkBack).                          |
| `hint`             | `string`          | Under the input; its spoken hint.                                                                                  |
| `error`            | `string \| null`  | Replaces the hint, red border, announced when it appears. Falsy = no error.                                        |
| `required`         | `boolean`         | " \*" after the label, ", obligatoire" (", required") after the spoken name.                                       |
| `inputRef`         | `Ref<TextInput>`  | Focus it, or chain fields with `onSubmitEditing`.                                                                  |
| `locale`           | `"fr" \| "en"`    | Language of the spoken "required".                                                                                 |
| `colors`           | `TextFieldColors` | `text`, `label`, `placeholder`, `background`, `border` (keep ≥ 3:1 with the background), `borderFocused`, `error`. |
| `styles`           | `TextFieldStyles` | Slots `container`, `label`, `input`, `inputFocused`, `inputError`, `hint`, `error`.                                |

`IntegerField` takes the same props (except `value`/`onChangeText`/`keyboardType`), plus `value: number`, `onChange(value)`, `min` (`-Infinity`) and `max` (`Infinity`); `maxLength` defaults to 17 (beyond, a number is no longer exact).

#### `<SectionTitle title />` and `<Section title>…</Section>`

![SectionTitle with aside, rule and leading mark; Section around a SegmentedToggle](docs/screenshots/section-title.png)

A section heading in small grey capitals, announced as a header. `aside` shows a summary on the right ("4 sélectionnés"; a string or any node), `rule` draws a line to the right edge, `leading` a decorative mark before the title (hidden from screen readers), `uppercase={false}` keeps the case. `Section` is the same title followed by its content, spaced by `gap` (8).

```tsx
import { Section } from "@forthtilliath/react-native-kit/components/layout/Section";
import { SectionTitle } from "@forthtilliath/react-native-kit/components/layout/SectionTitle";

<SectionTitle title="Merveilles" rule leading={<View style={diamond} />} styles={{ title: { color: c.gold } }} />
<Section title="Durée" aside={durationLabel} titleStyles={{ title: { color: c.muted } }}>
  <SegmentedToggle options={DURATIONS} value={duration} onChange={setDuration} />
</Section>
```

Style slots (`styles` on `SectionTitle`, `titleStyles` on `Section`): `container`, `title`, `aside`, `rule`. `Section` also takes `style` for its own block.

#### `<EmptyState message />`

![EmptyState with icon, title, message and action](docs/screenshots/empty-state.png)

What an empty list shows: an icon in a circle (hidden from screen readers), an optional title (a header), the explanation, and the action that fills the list — a kit `Button`, so `action` takes all of its props.

```tsx
import { EmptyState } from "@forthtilliath/react-native-kit/components/feedback/EmptyState";

<FlatList
  data={players}
  ListEmptyComponent={
    <EmptyState
      icon={<Ionicons name="people-outline" size={36} color={c.muted} />}
      title="Aucun joueur"
      message="Ajoute les joueurs une fois : ils seront proposés à chaque partie."
      action={{
        label: "Créer un joueur",
        onPress: () => router.push("/players/new"),
        fullWidth: true,
        colors: buttonColors,
      }}
    />
  }
/>;
```

Style slots: `container`, `iconWrap`, `title`, `message`.

#### `showToast(message, options?)` + `<ToastHost />`

![ToastHost: a plain toast, and an undo toast in an app's colors](docs/screenshots/toast.png)

Short messages at the bottom of the screen, called from anywhere — a store action, an event handler — without passing state around. Mount a `ToastHost` at the root of the app (it survives navigation: an undo offered on a screen you just left stays), and another inside each `Modal` that needs one: **the most recently mounted host receives the toasts**. One toast at a time (a new one replaces it), announced to TalkBack explicitly (a view that just appeared isn't always read), faded in and out (instantly when Android animations are removed), closed by a tap.

The delay (3.5 s, or 5 s with an action) goes through Android's accessibility **"Time to take action"** setting: users who asked for more time get it.

```tsx
import { showToast } from "@forthtilliath/react-native-kit/components/feedback/toast";
import { ToastHost } from "@forthtilliath/react-native-kit/components/feedback/ToastHost";

// app/_layout.tsx, last child so it draws on top
<ToastHost
  bottomOffset={insets.bottom + TAB_BAR_HEIGHT}
  styles={{
    toast: { backgroundColor: c.text },
    message: { color: c.background },
  }}
/>;

showToast("Partie enregistrée");

// Undo after an immediate delete: commit for good unless the user undid it.
removePlayer(player.id);
showToast(`« ${player.name} » supprimé`, {
  action: { label: "Annuler", onPress: () => restorePlayer(player) },
  onHide: (reason) => {
    if (reason !== "action") deletePhoto(player.photoUri);
  },
});
```

| `showToast` option | Type                 | Notes                                                                                                                                   |
| ------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `action`           | `{ label, onPress }` | A button on the right; pressing it calls `onPress` then closes the toast.                                                               |
| `durationMs`       | `number`             | 3500, or 5000 with an `action` — lengthened by the accessibility setting.                                                               |
| `onHide`           | `(reason) => void`   | Once, with `"timeout"`, `"action"`, `"dismissed"` (tapped), `"replaced"` (a newer toast) or `"hidden"` (`hideToast()`, host unmounted). |

`showToast` returns the toast's id, or `null` when no host is mounted (nothing shown). `hideToast()` closes the toast of every host.

| `ToastHost` prop        | Type              | Default | Notes                                                                   |
| ----------------------- | ----------------- | ------- | ----------------------------------------------------------------------- |
| `bottomOffset`          | `number`          | `24`    | Add the bottom safe-area inset, a tab bar, a floating button to clear.  |
| `maxLines`              | `number`          | `3`     | Longer messages end with an ellipsis.                                   |
| `fadeMs`                | `number`          | `200`   | 0 when Android animations are removed.                                  |
| `locale`, `dismissHint` |                   |         | Spoken hint of the message ("Masque le message" / "Hides the message"). |
| `styles`                | `ToastHostStyles` | —       | Slots `toast`, `message`, `action`.                                     |

`UndoToast` stays available for a host that manages its own state; `ToastHost` replaces the hand-written "pending undo + timer + bar" pattern.

#### `<ReorderList items keyExtractor getLabel onChange />`

![ReorderList with positions and arrows, then with avatars in an app's colors](docs/screenshots/reorder-list.png)

Reorders a list with ▲ / ▼ buttons instead of drag and drop: usable with TalkBack and inside a `ScrollView`, no gesture library. Each arrow is named after its item ("Monter Marie" / "Move Marie up"), the first ▲ and last ▼ are disabled, and since rows are keyed, the screen-reader focus follows the item it just moved. `onChange` receives the reordered copy (and `{ from, to }`). Needs `@expo/vector-icons`.

```tsx
import { ReorderList } from "@forthtilliath/react-native-kit/components/list/ReorderList";

<ReorderList
  items={players}
  keyExtractor={(p) => p.id}
  getLabel={(p) => p.name}
  onChange={(next) => setPlayerOrder(next.map((p) => p.id))}
  onMoveFeedback={selectFeedback}
  renderItem={(p) => <PlayerChip player={p} />}
  styles={{ row: { backgroundColor: c.card }, arrowColor: c.text }}
/>;
```

Also: `showPosition` (`true`), `locale`, `labels` (`moveUp(label)`, `moveDown(label)`), style slots `list`, `row`, `position`, `label`, `arrow`, `arrowDisabled` and `arrowColor`.

#### `<BottomSheet title subtitle headerAction showHandle showCloseButton>`

![BottomSheet header: grab bar, title, subtitle, action and close button](docs/screenshots/bottom-sheet-header.png)

`BottomSheet` can draw its own header — grab bar, title (a header), subtitle, a text action and a × close button — **above** the scrolling content, so it stays visible. All optional and off by default: existing sheets don't change. The header alone is exported as `BottomSheetHeader` (`components/overlay/BottomSheetHeader`) for sheets built by hand.

```tsx
<BottomSheet
  visible={open}
  onClose={close}
  bottomInset={insets.bottom}
  title="Filtres"
  subtitle={`${count} jeux correspondent`}
  headerAction={{ label: "Réinitialiser", onPress: resetFilters }}
  showHandle
  showCloseButton
  headerStyles={{
    title: { color: c.text },
    action: { color: c.primary },
    close: { backgroundColor: c.primarySoft },
  }}
>
  <Filters />
</BottomSheet>
```

`closeLabel` names the × button ("Fermer" / "Close", `locale`). Header style slots: `handle`, `header`, `title`, `subtitle`, `action`, `close`, `closeIcon`.

#### `<Reveal index>`

Fades its content in while sliding it up, delayed by `index × staggerMs` (90) — to reveal a ranking one row after the other. Runs on the native thread, once; `emphasis` adds a slight bounce and zoom (the winner). When the user asked Android to remove animations, the content is shown right away.

```tsx
import { Reveal } from "@forthtilliath/react-native-kit/components/layout/Reveal";

{
  ranking.map((entry, index) => (
    <Reveal key={entry.id} index={index} emphasis={index === 0}>
      <RankingRow entry={entry} />
    </Reveal>
  ));
}
```

Also: `durationMs` (260), `distance` (16 dp), `style`.

#### `useReducedMotion()`

`true` when the user asked for fewer animations (Android: Accessibility ▸ Remove animations), updated live. Native transitions follow that setting on their own; `Animated` ones don't — skip or shorten them.

```tsx
import { useReducedMotion } from "@forthtilliath/react-native-kit/hooks/useReducedMotion";

const reducedMotion = useReducedMotion();
Animated.timing(scale, {
  toValue: 1,
  duration: reducedMotion ? 0 : 250,
  useNativeDriver: true,
}).start();
```

#### `usePersistHydrated(stores)`

`true` once every store has been read back from storage. Until then a persisted store holds its **initial** state: wait for this before acting on saved values (a "last checked" date, a dismissed version, a setting), or the app acts as if nothing was saved. Takes any store with Zustand's `persist` API (`hasHydrated`, `onFinishHydration`), without depending on Zustand. Keep the array stable (a module constant).

```tsx
import { usePersistHydrated } from "@forthtilliath/react-native-kit/hooks/usePersistHydrated";

const STORES = [useSettingsStore, useUpdateStore] as const;

const hydrated = usePersistHydrated(STORES);
<UpdateNotifier enabled={hydrated} {...updateProps} />;
```

#### `createThemedStyles(usePalette, factory)` + `createPaletteMemo(usePalette, factory)`

`StyleSheet.create` in the colors of the current theme, declared once at module level: the returned hook builds **one style sheet per palette**, the first time it's used, then shares it between every instance and every render — instead of a `useMemo(() => StyleSheet.create(…), [colors])` in each mounted component. `createPaletteMemo` does the same for any value (chart colors, icon colors…). The cache is keyed by the palette object: keep palettes as constants.

```tsx
import {
  createThemedStyles,
  type NamedStyles,
} from "@forthtilliath/react-native-kit/components/theme/createThemedStyles";
import { useResolvedScheme } from "@forthtilliath/react-native-kit/components/theme/themePreferenceContext";

// ui/theme.ts — once per app
export const useColors = () =>
  useResolvedScheme() === "dark" ? darkColors : lightColors;
export const themedStyles = <T extends NamedStyles<T>>(
  factory: (c: Palette) => T,
) => createThemedStyles(useColors, factory);

// any component
const useStyles = themedStyles((c) => ({
  card: { backgroundColor: c.card, borderColor: c.border, borderWidth: 1 },
  title: { color: c.text, fontWeight: "700" },
}));

function Card() {
  const styles = useStyles();
  return <View style={styles.card}>…</View>;
}
```

#### `pickTextFile(options?)`

Opens the system file picker (local files, Drive, Downloads…) and reads the chosen text file straight from its `content://` URI — no copy, **no storage permission**. The size is checked **before** reading (a huge file is refused without being loaded into memory), and the length again after, for providers that report no size. Returns `null` if the user cancels, `{ ok: true, text, name }`, or `{ ok: false, reason: "too-large" | "unreadable", error }` with a message ready to show. Needs `expo-file-system` (SDK 54+).

Pair it with `parseUntrustedJson` from `@forthtilliath/ts-kit` for a complete import that never applies anything half-checked:

```ts
import { parseUntrustedJson } from "@forthtilliath/ts-kit/security/parseUntrustedJson";
import { pickTextFile } from "@forthtilliath/react-native-kit/utils/files/pickTextFile";

const picked = await pickTextFile({ maxBytes: 2_000_000 });
if (!picked) return; // cancelled
if (!picked.ok) return Alert.alert("Import impossible", picked.error);
const result = parseUntrustedJson(picked.text, backupSchema, {
  maxLength: 2_000_000,
});
if (!result.ok) return Alert.alert("Import impossible", result.error);
await restore(result.data);
```

| Option      | Type                            | Default                                                                                                                   |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `mimeTypes` | `string[]`                      | `["application/json", "text/plain", "application/octet-stream"]` (a `.json` may be any of them depending on the provider) |
| `maxBytes`  | `number`                        | `5_000_000`                                                                                                               |
| `locale`    | `"fr" \| "en"`                  | `"fr"`                                                                                                                    |
| `labels`    | `{ tooLarge(max), unreadable }` | French or English messages                                                                                                |

### Overlays and pickers

Every component below has neutral default colors and a `styles` prop whose slots are each merged **after** their default (a partial override keeps the rest of the slot) — pass the app's palette there.

| Component                                                               | Import path                         | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<BottomSheet visible onClose bottomInset?>`                            | `components/overlay/BottomSheet`    | Modal sliding up from the bottom, content scrollable past 85 % of the screen. Pass `useSafeAreaInsets().bottom` as `bottomInset` with Android edge-to-edge. Optional header (title, action, close button): see [above](#bottomsheet-title-subtitle-headeraction-showhandle-showclosebutton).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `<OptionsModal visible onClose options onSelect>`                       | `components/picker/OptionsModal`    | Centered popup listing `{ value, label }` options; a tap selects and closes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `<SelectField label valueLabel options onSelect>`                       | `components/picker/SelectField`     | Native-looking "select": captioned button + `OptionsModal` (styled through `styles.optionsModal`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `<SegmentedToggle options value onChange label?>`                       | `components/picker/SegmentedToggle` | Row of equal-width buttons, one active (Calendar / List…), announced as a radio group; each option may carry a smaller `hint` line under its label.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `<QuantityStepper value onChange label min? max?>`                      | `components/picker/QuantityStepper` | Whole-number counter `min…max` (`0…999`, negatives allowed with a negative `min`, `-Infinity`/`Infinity` for no bound): −/+ buttons moving by `step` (1; disabled at the bounds, `longPressStep` to jump on long press, or `repeatOnHold` to repeat faster and faster while held) and a numeric field; `onStep(value)` fires on each −/+ change (e.g. `onStep={tapFeedback}`), not on typing; `maxFontSizeMultiplier` caps the system font scaling of −, + and the field; `inputRef` + `onSubmitEditing` chain steppers on the keyboard's Enter key (typed value sent first, keyboard kept open, `returnKeyType` "next" by default); screen-reader labels in French or English (`a11yLabels` to override). |
| `<SwitchRow label description? value onChange>`                         | `components/settings/SwitchRow`     | Settings line "label + description + switch", the whole row pressable and read as one switch; `colors` for the track and thumb.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `<SettingsCard title icon?>` + `SettingsCardStatus`, `SettingsCardHint` | `components/settings/SettingsCard`  | Settings card: icon + title header, then free content — status lines (small icon + text, `iconColor` per state) and a quieter hint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `<CheckboxGroup options values onChange label?>`                        | `components/picker/CheckboxGroup`   | Wrapping chips that each check and uncheck independently (extensions, tags…), each announced as a checkbox.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `<MonthDayGrid days selected onToggle>`                                 | `components/picker/MonthDayGrid`    | Monday-first month grid whose days toggle on and off (holidays, days off…); `YYYY-MM-DD` days.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `<AddButton label onPress>`                                             | `components/list/AddButton`         | Dashed "+ Add …" button closing a list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `<DragHandle onPressIn accessibilityLabel>`                             | `components/list/DragHandle`        | "⠿" grip for `react-native-draggable-flatlist` rows (gesture-handler's `Pressable`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `<ErrorFallback error retry>`                                           | `components/feedback/ErrorFallback` | Readable crash screen with a retry button, for Expo Router's `ErrorBoundary`; texts in French or English (`labels` to override).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

`SwipeableRow` also takes `fullSwipeToDelete`: swiping past half the row deletes right away (the row slides out over a full-width delete band) instead of revealing a button — pair it with an `UndoToast`.

> `useUpdateCheck`, `<UpdateAvailableBanner>` and `<ChangelogNotes>` moved to
> [`@forthtilliath/expo-release-updates-ui`](../expo-release-updates-ui#readme) —
> install that package alongside this one if you need them.

### Settings screens (`components/settings/`)

The building blocks of a typical app "Settings" tab — menu, theme, update check, backup, about, contact, privacy — factored out so each new app stops rewriting the same ~7 screens from scratch. Expo Router (or any file-based router) still needs one physical route file per screen in your app; these just give each route file almost nothing left to write beyond rendering the matching component. None of them add new peer dependencies beyond what's already listed above.

```tsx
// app/(tabs)/settings/index.tsx
import { router } from "expo-router";
import { SettingsMenu } from "@forthtilliath/react-native-kit/components/settings/SettingsMenu";

export default function SettingsMenuScreen() {
  return (
    <SettingsMenu
      items={[
        // `key` doubles as the lookup into a built-in default icon/label
        // pairing for the 6 sections above — no `emoji`/`icon` needed here.
        {
          key: "backup",
          title: "Sauvegarde",
          hint: "Exporter / importer tes données",
          onPress: () => router.push("/settings/backup"),
        },
        {
          key: "theme",
          title: "Thème",
          hint: "Clair, sombre, ou automatique",
          onPress: () => router.push("/settings/theme"),
        },
        {
          key: "update",
          title: "Mise à jour",
          onPress: () => router.push("/settings/update"),
        },
        {
          key: "about",
          title: "À propos",
          onPress: () => router.push("/settings/about"),
        },
        {
          key: "contact",
          title: "Contact",
          onPress: () => router.push("/settings/contact"),
        },
        {
          key: "privacy",
          title: "Confidentialité",
          onPress: () => router.push("/settings/privacy"),
        },
        // An app-specific section: no default exists for an arbitrary key,
        // so `emoji`/`icon` (and `hint`, if you want one) are yours to set.
        {
          key: "profile",
          emoji: "🙋",
          title: "Mon nom",
          onPress: () => router.push("/settings/profile"),
        },
      ]}
    />
  );
}
```

`SettingsMenu` doesn't depend on expo-router (or any other navigator) itself — each item carries its own `onPress`, so it works the same with any navigation setup.

Two independent style knobs, both usable on their own:

- **Icon flavor** — each item can set its own `emoji` (naturally multicolor) or `icon` (an `Ionicons` glyph, name in `styles.iconColor`) to override its default; `defaultIconKind` (`"emoji"` by default, or `"icon"`) picks which flavor of the _default_ table applies to items that don't set either.
- **Hints** — set `showHints={false}` to hide every item's `hint` at once, for a denser, icon-only-style menu.

```tsx
<SettingsMenu
  items={[
    {
      key: "backup",
      title: "Sauvegarde",
      onPress: () => router.push("/settings/backup"),
    },
  ]}
  defaultIconKind="icon"
  showHints={false}
  styles={{
    row: { backgroundColor: colors.primary, borderWidth: 0 },
    iconColor: "#fff",
    title: { color: "#fff" },
  }}
/>
```

Pass `groups` instead of `items` to render rows under optional section headers (e.g. separating app-specific settings from the standard ones) — the two are mutually exclusive:

```tsx
<SettingsMenu
  groups={[
    {
      title: "Réglages de calcul",
      items: [
        {
          key: "ratio",
          emoji: "🧮",
          title: "Ratio glucidique",
          onPress: () => router.push("/settings/ratio"),
        },
      ],
    },
    {
      // No `title` renders the group with no header at all, e.g. for a
      // leading group of app-specific items above the standard ones.
      items: [
        {
          key: "backup",
          title: "Sauvegarde",
          onPress: () => router.push("/settings/backup"),
        },
      ],
    },
  ]}
/>
```

#### `<ThemeSettingsScreen value onChange />`

Same light/dark/system data contract as `ThemeToggle`/`ThemeOptionList`. Two visuals, picked via `variant`: `"emoji"` (default) — emoji + label + a plain-text `✓` on the active row — or `"icon"` — `Ionicons` glyphs in one shared color (`styles.iconColor`/`iconColorActive`) + an `Ionicons` checkmark, matching `SettingsMenu`'s `defaultIconKind="icon"` look. `showHint={false}` hides the hint above the list.

```tsx
import { ThemeSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/ThemeSettingsScreen";

<ThemeSettingsScreen value={themePreference} onChange={setThemePreference} />;

// Or, matching an icon-flavored SettingsMenu:
<ThemeSettingsScreen
  value={themePreference}
  onChange={setThemePreference}
  variant="icon"
/>;
```

#### `<UpdateSettingsScreen currentVersion checkForUpdate compareVersions downloadAndInstallApk />`

The full "check for update" screen: installed version, a manual check button, the available-update box (changelog + install button) or an up-to-date/error message, download progress, and — if `fetchReleaseHistory` is passed — a list of past releases. Checks automatically once on mount. Renders release notes via `@forthtilliath/expo-release-updates-ui`'s `ChangelogNotes`, and pairs naturally with that package's `useUpdateCheck`/`UpdateAvailableBanner` (same `checkForUpdate`/`compareVersions` you already pass those), but takes plain functions so it isn't tied to that package's exact shape. `@forthtilliath/expo-release-updates-ui` is an optional peer dependency: install it to use this screen. `downloadAndInstallApk(apkUrl, onProgress, apkSha256)` receives the release's `apkSha256` (from `fetchLatestRelease`): pass it on as `expectedSha256`.

```tsx
import { UpdateSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/UpdateSettingsScreen";

import {
  compareVersions,
  downloadAndInstallApk,
  fetchLatestRelease,
  fetchReleaseHistory,
} from "@/lib/appUpdate";

<UpdateSettingsScreen
  currentVersion={Constants.expoConfig?.version ?? "?"}
  checkForUpdate={fetchLatestRelease}
  compareVersions={compareVersions}
  downloadAndInstallApk={downloadAndInstallApk}
  fetchReleaseHistory={fetchReleaseHistory}
/>;
```

`checkForUpdate` receives `{ includePrereleases }` (`false` by default). Pass `onIncludePrereleasesChange` to show a "Recevoir les versions de test" switch: the app stores the choice, hands it back as `includePrereleases`, and the screen checks again on each change (an older check that answers late is ignored). Hand the value on to `fetchLatestRelease({ …, includePrereleases, requireVerifiedApk: true })`, to `fetchReleaseHistory({ …, includePrereleases })` (the history is fetched again when that function changes), and to the launch check (`UpdateNotifier`) too. Style it with `styles.prereleaseSwitch` / `styles.prereleaseSwitchColors` (`SwitchRow`'s slots).

```tsx
<UpdateSettingsScreen
  checkForUpdate={({ includePrereleases }) =>
    fetchLatestRelease({
      owner,
      repo,
      includePrereleases,
      requireVerifiedApk: true,
    })
  }
  includePrereleases={includePrereleases}
  onIncludePrereleasesChange={setIncludePrereleases}
  {...otherProps}
/>
```

#### `<BackupSettingsScreen onExport onImport reminder? />`

Export/import buttons plus an optional reminder-notification switch. Deliberately just a shell: what actually gets exported/imported is entirely app-specific (your own database tables), so `onExport`/`onImport` are required — this package can't have a sensible default for "how do I export my schema". Import asks for confirmation first (via `confirmDestructive`, from `utils/helpers/`) since it replaces existing data; `onImport` itself doesn't need to.

```tsx
import { BackupSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/BackupSettingsScreen";

<BackupSettingsScreen
  onExport={shareBackup}
  onImport={pickAndImportBackup}
  reminder={{
    enabled: reminderEnabled,
    onToggle: handleToggleReminder,
    intervalDays: BACKUP_REMINDER_INTERVAL_DAYS,
  }}
/>;
```

Omit `reminder` entirely for an app with no backup-reminder notifications.

Three more knobs for apps whose backup section doesn't fit the compact 2-button shell: an `info` box above everything (e.g. "last auto-backup: ..."), `layout="sections"` for a titled, full-width, stacked layout instead of side-by-side buttons, and `icons` for a leading `Ionicons` glyph on either button.

```tsx
<BackupSettingsScreen
  onExport={shareBackup}
  onImport={pickAndImportBackup}
  info={{ label: "Dernière sauvegarde auto", value: lastAutoBackupLabel }}
  layout="sections"
  icons={{ export: "cloud-upload-outline", import: "cloud-download-outline" }}
/>
```

#### `<AboutSettingsScreen appName version description developerName? sections? />`

App name, version, one or more description paragraphs, and an optional "developed by" credit. `appName`/`version` are required rather than defaulted internally (keeps this package framework-agnostic) — pass `Constants.expoConfig?.name`/`.version` from the caller.

```tsx
import { AboutSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/AboutSettingsScreen";

<AboutSettingsScreen
  appName={Constants.expoConfig?.name ?? "My App"}
  version={Constants.expoConfig?.version ?? "?"}
  description="A personal tool to do the thing."
  developerName="Your Name"
/>;
```

Omit `developerName` for an app with no credit line to show. Pass `sections` for extra titled blocks after the description — e.g. a medical/legal disclaimer:

```tsx
<AboutSettingsScreen
  appName="GlucoDose"
  version="1.2.0"
  description="Un outil personnel de calcul de dose."
  sections={[
    {
      title: "Avertissement médical",
      paragraphs: ["Cet outil ne remplace pas un avis médical professionnel."],
    },
  ]}
/>
```

#### `<ContactSettingsScreen email actions? emailIcon? />`

A `mailto:` button plus a short "how to report a bug" hint.

```tsx
import { ContactSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/ContactSettingsScreen";

<ContactSettingsScreen email="you@example.com" />;
```

Pass `actions` for extra rows below the email one (share the app, a donation link...) — switches the whole section from the single bordered button to a rows layout, email included:

```tsx
<ContactSettingsScreen
  email="you@example.com"
  actions={[
    { icon: "share-outline", label: "Partager l'app", onPress: shareApp },
    { icon: "star-outline", label: "Noter l'app", onPress: openStoreListing },
  ]}
/>
```

#### `<PrivacySettingsScreen sections? />`

Ships with the standard "everything stays on this device" three sections (no data collected, local storage only, sharing is opt-in) as the default — the right fit for most of these small personal-data apps. Pass your own `sections` to fully replace it for an app with different data handling (e.g. one that syncs to a server).

```tsx
import { PrivacySettingsScreen } from "@forthtilliath/react-native-kit/components/settings/PrivacySettingsScreen";

// Zero-config, uses the default copy:
<PrivacySettingsScreen />;

// Or fully custom:
<PrivacySettingsScreen
  sections={[
    {
      title: "What we collect",
      paragraphs: ["Only what you enter, synced to your account."],
    },
  ]}
/>;
```

For all 7 components above, styling works the same way as `ChangelogNotes`: an optional `styles` prop (all fields optional, neutral defaults), and where relevant an optional `labels` prop over the built-in French or English copy (see [Languages](#languages-locale)).

### Utils (`utils/helpers/`)

- `confirmDestructive` — wraps React Native's `Alert`, so it isn't framework-agnostic (see its own section above).
- `tapFeedback()`, `selectFeedback()`, `successFeedback()`, `errorFeedback()` (`utils/helpers/haptics`) — semantic aliases over `expo-haptics` (light impact, selection tick, success / error notification). Fire-and-forget: a failed vibration never throws. Needs `expo-haptics`.
- `mergeSlotStyles(defaultStyles, styles)` — merges a component's per-slot `styles` overrides onto its defaults as `[default, override]` style arrays, so overriding one property of a slot keeps the rest of its default. Every component of this package uses it; handy for your own components following the same `styles` convention.
- `shareFile(uri, { mimeType, dialogTitle?, locale? })` — opens the native share sheet for a local file; throws a user-facing `Error` (French, or English with `locale: "en"`) when the device can't share. Needs `expo-sharing`.
- `shareTextFile(filename, content, options)` — writes the text to a file in the cache (replacing any previous one), then `shareFile`s it: `.ics`, `.csv`, JSON exports… Needs `expo-file-system` and `expo-sharing`.
- `shareViewAsImage(ref, { dialogTitle?, locale? })` (`utils/helpers/shareViewAsImage`) — captures a view as a PNG and shares it (scoreboard, schedule…); `ref` is a `RefObject<ComponentRef<typeof View> | null>`, as `useRef<ComponentRef<typeof View>>(null)` gives. Needs `react-native-view-shot` and `expo-sharing`; the capture library is loaded on demand, so a binary built without it only fails this call, with a user-facing `Error`.
- `isNativeModuleAvailable(name)` — whether a native module is compiled into this binary (either architecture): check it before loading a library that crashes on import without its module.

### Calendar (`utils/calendar/`)

Write an app's events to its **own** calendar on the phone — a local account the user can hide in one tap, never their personal calendars. Needs `expo-calendar` (and its config plugin's permission text).

```ts
import { syncDedicatedCalendar } from "@forthtilliath/react-native-kit/utils/calendar/syncDedicatedCalendar";
import { toCalendarEventDetails } from "@forthtilliath/react-native-kit/utils/calendar/toCalendarEventDetails";

const result = await syncDedicatedCalendar({
  calendar: { name: "my-app", title: "My App", color: "#293897" },
  from: new Date(2026, 6, 1),
  to: new Date(2026, 7, 1),
  events: shifts.map((s) =>
    toCalendarEventDetails({
      title: s.code,
      date: s.date,
      start: s.start,
      end: s.end,
    }),
  ),
});
if (result.status === "denied") explainPermission();
```

- `syncDedicatedCalendar({ calendar, from, to, events })` — asks for the permission, finds the calendar by its internal `name` (creating it on first use), deletes its events in `[from, to)`, writes the new ones: a new sync replaces the previous one, no duplicates. Returns `{ status: "denied" }` or `{ status: "done", count }`.
- `toCalendarEventDetails({ title, notes?, date, start?, end? }, timeZone?)` — converts a day + optional `HH:MM` hours to what `createEvent` expects. An `end` at or before `start` ends the next day (night shift); without hours the event lasts all day, set at UTC midnight in `"UTC"` — otherwise Android shows it a day off depending on the device's time zone.

### App files (`utils/files/`)

Files the app keeps for good (photos, avatars…): pickers return URIs in a cache folder the OS may empty at any time, so anything worth keeping is copied into a sub-folder of the app's documents. Needs `expo-file-system`.

```ts
import {
  deleteFileQuietly,
  persistFile,
} from "@forthtilliath/react-native-kit/utils/files/appFiles";

const photoUri = await persistFile(pickedUri, {
  directory: "foods",
  prefix: "food",
});
// later, when the photo is replaced or its entity deleted:
deleteFileQuietly(oldPhotoUri);
```

- `getAppDirectory(name)` — the persistent sub-folder `name` of documents, created on first use.
- `persistFile(sourceUri, { directory, prefix })` — copies a temporary file there as `<prefix>-<timestamp>.<ext>` and returns the copy's URI.
- `getFileExtension(uri, fallback = "jpg")` — extension of a URI, query string ignored.
- `fileExists(uri)` — `false` for a malformed URI instead of throwing.
- `deleteFileQuietly(uri)` — best-effort deletion: an absent file, `null` or a failure never throws.
- `pruneAppDirectory(name, keep)` — deletes the folder's files whose URI isn't in `keep` (orphaned photos after an edit or an import); returns how many were deleted.
- `readFileBase64(uri)` / `writeBase64File(base64, { directory, prefix, extension? })` — embed a photo in a JSON backup, then recreate it on restore (random file names: a restore writes many files in the same millisecond). `readFileBase64` returns `null` for a file already gone.
- `saveImageThumbnail(sourceUri, { directory, prefix, width?, quality? })` (`utils/files/imageThumbnail`) — shrinks a picked photo to a JPEG thumbnail (256 px wide, quality 0.8 by default) kept in the folder: small enough to embed in backups. Needs `expo-image-manipulator`.

`expo-sharing`, `expo-file-system`, `expo-calendar`, `expo-haptics`, `expo-image-manipulator` and `react-native-view-shot` are **optional** peer dependencies: only install those your app uses, and deep-import these helpers.

The framework-agnostic helpers that used to live here (`getPeriodStartMs`, `getMostRecentIds`, `nextInCycle`, `normalizeForSearch`, `rankByNameMatch`, `escapeCsvField`, `formatCsvNumber`, `escapeHtml`) moved to [`@forthtilliath/ts-kit`](../ts-kit#readme) — no React Native dependency on them, so they're usable from Node/web too. They're still re-exported from this package's root barrel for convenience:

```ts
import {
  getPeriodStartMs,
  getMostRecentIds,
} from "@forthtilliath/react-native-kit";
```

Prefer importing straight from `ts-kit` (deep import, see its README) if you don't otherwise need this package.

## Scripts

```bash
pnpm run dev            # tsc --watch -> dist/
pnpm run build          # tsc -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run test:watch     # vitest
```

Built to `dist/` (see the `exports` field in `package.json`), so run `pnpm run build` (or `dev`) after source changes for consumers to see them.

### Testing note

`react-native`'s package entry uses Flow syntax that `@babel/parser`'s flow plugin can't parse (`as Cast` casts aren't supported there), so Vitest can never load the real package directly. Tests alias `react-native` to a minimal stub (`src/__mocks__/react-native.tsx`) instead — see that file for details. `react-native-gesture-handler` ships the same kind of Flow syntax, and `@expo/vector-icons` has its own unrelated ESM-resolution issue under Vite/Rollup — both are stubbed the same way (`src/__mocks__/react-native-gesture-handler.tsx`, `src/__mocks__/expo-vector-icons.tsx`). `react-native-gesture-handler/ReanimatedSwipeable` needs Reanimated's native runtime, so it gets its own stub too (`src/__mocks__/react-native-gesture-handler-reanimated-swipeable.tsx`). `expo-speech-recognition` and `expo-image-picker` wrap native modules unavailable under Vitest regardless, so they're mocked with plain spies (`src/__mocks__/expo-speech-recognition.tsx`, `src/__mocks__/expo-image-picker.ts`).
