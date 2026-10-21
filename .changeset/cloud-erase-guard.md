---
"@forthtilliath/expo-backup": minor
"@forthtilliath/expo-backup-ui": minor
---

expo-backup: an automatic upload of empty data (`isEmpty`) no longer replaces a Google Drive backup that still holds data (or can't be read): it is refused with `cloud-erase-blocked`, and every upload stays refused until the user restores the cloud backup or calls the new `confirmCloudErase()`. expo-backup-ui explains the block and adds a "Replace the Drive backup" button, behind a confirmation.
