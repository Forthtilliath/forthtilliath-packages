import type { BackupScreenLabels } from "./labels.js";

export const frLabels: BackupScreenLabels = {
  cloudTitle: "Sauvegarde automatique",
  cloudHint:
    "Relie ton compte Google : tes données sont envoyées automatiquement sur ton Google Drive (dans un dossier privé réservé à l'app) après chaque modification. Pratique pour changer de téléphone sans rien perdre.",
  connectButton: "Connecter Google Drive",
  connectedTitle: "Sauvegarde automatique activée",
  connectedConfirm: (email) =>
    `Tes données sont désormais envoyées sur le Google Drive de ${email} après chaque modification.`,
  connectedButFailedTitle: "Compte relié, mais l'envoi a échoué",
  lastCloudBackup: (date) => `Dernier envoi : ${date}`,
  cloudPending: " · envoi en attente…",
  failingSince: (date) => `Les envois échouent depuis le ${date}.`,
  syncDoneTitle: "Sauvegarde envoyée",
  syncDoneMessage: "Tes données sont à jour sur Google Drive.",
  syncFailedTitle: "La sauvegarde n'a pas pu être envoyée",
  autoHint: "Envoi automatique après chaque modification.",
  syncNowButton: "Sauvegarder maintenant",
  restoreCloudButton: "Restaurer depuis Google Drive",
  disconnectButton: "Déconnecter",
  disconnectConfirmTitle: "Désactiver la sauvegarde automatique ?",
  disconnectConfirmMessage:
    "La dernière sauvegarde reste sur ton Google Drive, mais les prochaines modifications n'y seront plus envoyées.",
  conflictTitle: "Une sauvegarde existe déjà",
  conflictMessage: (description) =>
    `Ce compte Google contient déjà une sauvegarde (${description}). Laquelle garder ?`,
  conflictKeepDevice: "Ce téléphone",
  conflictKeepCloud: "Google Drive",
  noCloudBackupTitle: "Aucune sauvegarde",
  noCloudBackupMessage: "Rien n'a encore été envoyé sur Google Drive.",
  eraseCloudButton: "Remplacer la sauvegarde Drive",
  eraseCloudConfirmTitle: "Effacer la sauvegarde Google Drive ?",
  eraseCloudConfirmMessage:
    "La sauvegarde Google Drive sera remplacée par les données de ce téléphone, qui est vide. Ce qu'elle contient sera perdu.",
  eraseCloudConfirmButton: "Remplacer",

  fileTitle: "Sauvegarde manuelle",
  lastBackup: (date) => `Dernière sauvegarde : ${date}`,
  fileHint:
    "Un fichier à garder précieusement ou à transférer vers un autre téléphone.",
  fileHintEncrypted:
    "Un fichier chiffré : illisible sans la clé de ce téléphone, ou sa clé de secours.",
  exportButton: "Exporter mes données",
  importButton: "Importer une sauvegarde",
  undoButton: "Annuler la dernière restauration",
  undoConfirmTitle: "Annuler la dernière restauration ?",
  undoConfirmMessage:
    "Remet les données telles qu'elles étaient juste avant la dernière restauration. Ce qui a été fait depuis sera perdu.",
  undoneTitle: "Données d'avant la restauration remises en place.",

  restoreConfirmTitle: "Restaurer cette sauvegarde ?",
  restoreConfirmMessage: (description) =>
    `Sauvegarde : ${description}. Toutes les données actuelles seront remplacées (tu pourras annuler la restauration ensuite).`,
  restoreConfirmButton: "Restaurer",
  restoredTitle: "Restauration terminée",
  restoredMessage: "Les données ont été remplacées.",

  encryptionTitle: "Chiffrement",
  encryptionToggle: "Chiffrer mes sauvegardes",
  encryptionOptionalHint:
    "Les fichiers exportés et la copie Google Drive deviennent illisibles sans la clé de l'app. Rien à retenir : la clé est gardée sur ce téléphone et dans ton Google Drive.",
  encryptionRequiredHint:
    "Tes sauvegardes sont toujours chiffrées. Rien à retenir : la clé est gardée sur ce téléphone et dans ton Google Drive.",
  showRecoveryCodeButton: "Afficher la clé de secours",
  enterRecoveryCodeButton: "Saisir une clé de secours",
  recoveryCodeTitle: "Clé de secours",
  recoveryCodeHint:
    "Utile seulement sans Google Drive : note-la (ou garde-la dans un gestionnaire de mots de passe) pour relire tes fichiers exportés sur un autre téléphone. Ne la partage avec personne.",
  recoveryCodeInputTitle: "Saisir une clé de secours",
  recoveryCodeInputHint:
    "La clé de secours du téléphone qui a créé la sauvegarde (Réglages ▸ Sauvegarde ▸ Afficher la clé de secours).",
  recoveryCodePlaceholder: "XXXXX-XXXXX-…",
  recoveryCodeAdded: "Clé de secours ajoutée.",

  defaultDescription: "données de l'app",
  never: "jamais",
  cancel: "Annuler",
  confirm: "Valider",
  close: "Fermer",
  errorTitle: "Erreur",
  errorDetail: (detail) => `Détail technique : ${detail}`,
  errors: {
    "google-unavailable":
      "La sauvegarde Google Drive n'est pas disponible dans cette version de l'app. Utilise la sauvegarde manuelle (Exporter mes données).",
    "play-services-unavailable":
      "Les services Google Play sont indisponibles sur ce téléphone : la sauvegarde Google Drive ne peut pas fonctionner. Utilise la sauvegarde manuelle (Exporter mes données).",
    "oauth-misconfigured":
      "Google ne reconnaît pas cette version de l'app (client OAuth absent ou empreinte SHA-1 différente). Tu n'y peux rien : préviens le développeur de l'app.",
    "sign-in-failed":
      "La connexion à Google a échoué. Vérifie ta connexion internet, puis réessaie.",
    "reconnect-required":
      "Google n'autorise plus l'app à accéder à ton Drive (accès retiré ou expiré). Appuie sur « Déconnecter », puis reconnecte ton compte Google.",
    "drive-storage-full":
      "Ton espace de stockage Google est plein : la sauvegarde ne peut plus être envoyée. Libère de la place (Gmail, Drive et Photos partagent le même espace, voir one.google.com/storage), puis appuie sur « Sauvegarder maintenant ».",
    "drive-rate-limited":
      "Google Drive reçoit trop de demandes pour le moment. L'envoi sera retenté automatiquement plus tard.",
    "drive-blocked-by-admin":
      "L'administrateur de ce compte Google (travail, école…) interdit aux apps d'utiliser Drive. Déconnecte-le et relie plutôt un compte Google personnel.",
    "drive-api-disabled":
      "L'API Google Drive n'est pas activée dans le projet Google Cloud de l'app. Tu n'y peux rien : préviens le développeur de l'app.",
    "drive-permission-missing":
      "L'accès à Google Drive n'a pas été autorisé. Appuie sur « Déconnecter », puis reconnecte ton compte en cochant l'accès à Drive.",
    "drive-access-denied":
      "Google Drive a refusé l'envoi pour une raison inattendue. Si ça se reproduit, appuie sur « Déconnecter » puis reconnecte ton compte Google, et sinon préviens le développeur de l'app avec le détail technique.",
    "drive-unavailable":
      "Google Drive est momentanément indisponible. L'envoi sera retenté automatiquement.",
    network:
      "Pas de connexion internet. L'envoi sera retenté automatiquement une fois connecté.",
    "cloud-erase-blocked":
      "Ce téléphone n'a plus aucune donnée, mais ta sauvegarde Google Drive en contient encore : l'envoi automatique est suspendu pour ne pas l'effacer. Restaure-la, ou confirme que tu veux la remplacer.",
    "missing-key":
      "Cette sauvegarde est chiffrée avec une clé inconnue de ce téléphone. Saisis la clé de secours de l'appareil qui l'a créée.",
    "invalid-recovery-code":
      "Cette clé de secours contient une faute de frappe.",
    "recovery-code-mismatch":
      "Cette clé de secours est valide, mais ce n'est pas celle qui a chiffré ce fichier.",
    corrupted: "Cette sauvegarde est endommagée ou a été modifiée.",
    "newer-format":
      "Cette sauvegarde vient d'une version plus récente de l'app. Mets l'app à jour avant de l'importer.",
    "no-safety-backup": "Aucune restauration à annuler.",
    "sharing-unavailable":
      "Le partage de fichiers n'est pas disponible sur cet appareil.",
    "file-too-large":
      "Ce fichier est trop volumineux pour être une sauvegarde de l'app.",
    unknown: "Une erreur inattendue est survenue.",
  },
};
