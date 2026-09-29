import type { UiLocale } from "./locale.js";

/** Every built-in label of forth-ui, grouped by component. */
export interface UiMessages {
  /** Alert and Banner close button. */
  dismiss: string;
  avatar: { online: string; offline: string; away: string; busy: string };
  badge: { remove: string };
  breadcrumb: { showHidden: string };
  codeBlock: { copy: string; copied: string };
  colorPicker: { choose: string; hex: string };
  /** Combobox and MultiSelect. */
  combobox: { placeholder: string };
  commandPalette: { placeholder: string };
  confirmDialog: { cancel: string; confirm: string };
  datePicker: { placeholder: string };
  dropzone: { removeFile: string };
  /** Combobox, MultiSelect and CommandPalette. */
  emptyResults: string;
  imageInput: { remove: string };
  navbar: { toggleMenu: string };
  notificationCenter: { title: string; empty: string };
  numberInput: { decrement: string; increment: string };
  pagination: {
    first: string;
    previous: string;
    previousLabel: string;
    next: string;
    nextLabel: string;
    last: string;
  };
  passwordInput: { show: string; hide: string };
  qrCode: { label: (value: string) => string };
  rating: { stars: (count: number) => string };
  snippet: { copy: string; copied: string };
  spinner: { loading: string };
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
    navbar: { toggleMenu: "Afficher ou masquer le menu" },
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
    navbar: { toggleMenu: "Toggle menu" },
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
