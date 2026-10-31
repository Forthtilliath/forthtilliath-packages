import type { UiLocale } from "./locale";

/** Every built-in label of forth-ui, grouped by component. */
export interface UiMessages {
  /** Alert and Banner close button. */
  dismiss: string;
  /** Status names read by screen readers on an Avatar's status dot. */
  avatar: { online: string; offline: string; away: string; busy: string };
  /** Accessible name of a removable Badge's remove button. */
  badge: { remove: string };
  /** Accessible name of the "…" button revealing collapsed Breadcrumb items. */
  breadcrumb: { showHidden: string };
  /** CodeBlock's copy button, before and after copying. */
  codeBlock: { copy: string; copied: string };
  /** ColorPicker's trigger and hexadecimal input. */
  colorPicker: { choose: string; hex: string };
  /** Combobox and MultiSelect. */
  combobox: { placeholder: string };
  /** Placeholder of the CommandPalette search field. */
  commandPalette: { placeholder: string };
  /** Default buttons of a ConfirmDialog. */
  confirmDialog: { cancel: string; confirm: string };
  /** DatePicker's trigger while no date is chosen. */
  datePicker: { placeholder: string };
  /** Accessible name of the button removing a file from a Dropzone's list. */
  dropzone: { removeFile: string };
  /** Combobox, MultiSelect and CommandPalette. */
  emptyResults: string;
  /** Accessible name of the button clearing an ImageInput. */
  imageInput: { remove: string };
  /** ModeToggle's trigger and its three choices. */
  modeToggle: { toggle: string; light: string; dark: string; system: string };
  /** Navbar's mobile menu button and the menu's accessible name. */
  navbar: { toggleMenu: string; menu: string };
  /** NotificationCenter's panel title and empty state. */
  notificationCenter: { title: string; empty: string };
  /** Accessible names of NumberInput's − and + buttons. */
  numberInput: { decrement: string; increment: string };
  /** Pagination's links: visible texts and accessible names. */
  pagination: {
    first: string;
    previous: string;
    previousLabel: string;
    next: string;
    nextLabel: string;
    last: string;
  };
  /** Accessible names of PasswordInput's show / hide button. */
  passwordInput: { show: string; hide: string };
  /** Accessible name of a QrCode, from its encoded value. */
  qrCode: { label: (value: string) => string };
  /** Accessible name of each Rating star, from its value. */
  rating: { stars: (count: number) => string };
  /** Snippet's copy button, before and after copying. */
  snippet: { copy: string; copied: string };
  /** Text read by screen readers on a Spinner. */
  spinner: { loading: string };
  /** TagsInput's placeholder and the accessible name of its field. */
  tagsInput: { placeholder: string; label: string };
}

/** forth-ui's built-in labels, per locale. */
export const UI_MESSAGES: Record<UiLocale, UiMessages> = {
  fr: {
    dismiss: "Fermer",
    avatar: {
      online: "En ligne",
      offline: "Hors ligne",
      away: "Absent",
      busy: "Occupé",
    },
    badge: { remove: "Retirer" },
    breadcrumb: { showHidden: "Afficher les éléments masqués du fil d'Ariane" },
    codeBlock: { copy: "Copier le code", copied: "Copié" },
    colorPicker: { choose: "Choisir une couleur", hex: "Code hexadécimal" },
    combobox: { placeholder: "Sélectionner…" },
    commandPalette: { placeholder: "Saisir une commande ou rechercher…" },
    confirmDialog: { cancel: "Annuler", confirm: "Continuer" },
    datePicker: { placeholder: "Choisir une date" },
    dropzone: { removeFile: "Retirer le fichier" },
    emptyResults: "Aucun résultat.",
    imageInput: { remove: "Supprimer l'image" },
    modeToggle: {
      toggle: "Changer de thème",
      light: "Clair",
      dark: "Sombre",
      system: "Système",
    },
    navbar: { toggleMenu: "Afficher ou masquer le menu", menu: "Menu" },
    notificationCenter: {
      title: "Notifications",
      empty: "Aucune notification",
    },
    numberInput: { decrement: "Diminuer", increment: "Augmenter" },
    pagination: {
      first: "Aller à la première page",
      previous: "Précédent",
      previousLabel: "Aller à la page précédente",
      next: "Suivant",
      nextLabel: "Aller à la page suivante",
      last: "Aller à la dernière page",
    },
    passwordInput: {
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
    },
    qrCode: { label: (value) => `QR code : ${value}` },
    rating: {
      stars: (count) => `${count.toString()} étoile${count > 1 ? "s" : ""}`,
    },
    snippet: { copy: "Copier", copied: "Copié" },
    spinner: { loading: "Chargement" },
    tagsInput: { placeholder: "Ajouter un tag…", label: "Ajouter un tag" },
  },
  en: {
    dismiss: "Dismiss",
    avatar: {
      online: "Online",
      offline: "Offline",
      away: "Away",
      busy: "Busy",
    },
    badge: { remove: "Dismiss" },
    breadcrumb: { showHidden: "Show hidden breadcrumb items" },
    codeBlock: { copy: "Copy code", copied: "Copied" },
    colorPicker: { choose: "Choose color", hex: "Hex color code" },
    combobox: { placeholder: "Select…" },
    commandPalette: { placeholder: "Type a command or search…" },
    confirmDialog: { cancel: "Cancel", confirm: "Continue" },
    datePicker: { placeholder: "Pick a date" },
    dropzone: { removeFile: "Remove file" },
    emptyResults: "No results found.",
    imageInput: { remove: "Remove image" },
    modeToggle: {
      toggle: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    navbar: { toggleMenu: "Toggle menu", menu: "Menu" },
    notificationCenter: { title: "Notifications", empty: "No notifications" },
    numberInput: { decrement: "Decrement", increment: "Increment" },
    pagination: {
      first: "Go to first page",
      previous: "Previous",
      previousLabel: "Go to previous page",
      next: "Next",
      nextLabel: "Go to next page",
      last: "Go to last page",
    },
    passwordInput: { show: "Show password", hide: "Hide password" },
    qrCode: { label: (value) => `QR code encoding: ${value}` },
    rating: {
      stars: (count) => `${count.toString()} star${count > 1 ? "s" : ""}`,
    },
    snippet: { copy: "Copy", copied: "Copied" },
    spinner: { loading: "Loading" },
    tagsInput: { placeholder: "Add tag…", label: "Add a tag" },
  },
};
