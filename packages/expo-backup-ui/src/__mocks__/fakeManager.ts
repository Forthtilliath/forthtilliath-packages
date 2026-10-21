import { type Mock, vi } from "vitest";

import type {
  BackupManager,
  BackupState,
  EncryptionMode,
} from "@forthtilliath/expo-backup";

export interface Data {
  items: string[];
}

const baseState: BackupState = {
  hydrated: true,
  cloudAccount: null,
  encryptionEnabled: false,
  lastBackupAt: null,
  lastCloudBackupAt: null,
  cloudPending: false,
  cloudError: null,
  cloudErrorDetail: null,
  cloudFailingSince: null,
  hasSafetyBackup: false,
};

type Spied<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? Mock<(...args: A) => R>
    : T[K];
};

export interface FakeManager {
  manager: Spied<BackupManager<Data>>;
  setState: (patch: Partial<BackupState>) => void;
}

/** A BackupManager whose every method is a spy, with a settable state. */
export function createFakeManager({
  encryption = "off",
  state = {},
}: {
  encryption?: EncryptionMode;
  state?: Partial<BackupState>;
} = {}): FakeManager {
  let current: BackupState = { ...baseState, ...state };
  const listeners = new Set<() => void>();
  const manager = {
    appId: "test",
    encryptionMode: encryption,
    getState: vi.fn(() => current),
    subscribe: vi.fn((listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }),
    start: vi.fn<BackupManager<Data>["start"]>(() => vi.fn()),
    notifyDataChanged: vi.fn(),
    connectCloud: vi.fn<BackupManager<Data>["connectCloud"]>(),
    resolveConflict: vi.fn<BackupManager<Data>["resolveConflict"]>(() =>
      Promise.resolve(),
    ),
    cancelConflict: vi.fn<BackupManager<Data>["cancelConflict"]>(() =>
      Promise.resolve(),
    ),
    syncNow: vi.fn<BackupManager<Data>["syncNow"]>(() => Promise.resolve(true)),
    confirmCloudErase: vi.fn<BackupManager<Data>["confirmCloudErase"]>(() =>
      Promise.resolve(true),
    ),
    fetchCloudBackup: vi.fn<BackupManager<Data>["fetchCloudBackup"]>(),
    disconnectCloud: vi.fn<BackupManager<Data>["disconnectCloud"]>(() =>
      Promise.resolve(),
    ),
    exportToFile: vi.fn<BackupManager<Data>["exportToFile"]>(() =>
      Promise.resolve(),
    ),
    pickBackupFile: vi.fn<BackupManager<Data>["pickBackupFile"]>(),
    restore: vi.fn<BackupManager<Data>["restore"]>(() => Promise.resolve()),
    undoLastRestore: vi.fn<BackupManager<Data>["undoLastRestore"]>(() =>
      Promise.resolve({ items: [] }),
    ),
    isEncryptionActive: vi.fn(
      () =>
        encryption === "required" ||
        (encryption === "optional" && current.encryptionEnabled),
    ),
    setEncryptionEnabled: vi.fn<BackupManager<Data>["setEncryptionEnabled"]>(
      () => Promise.resolve(),
    ),
    getRecoveryCode: vi.fn<BackupManager<Data>["getRecoveryCode"]>(() =>
      Promise.resolve("ABCDE-FGHJK"),
    ),
    addRecoveryCode: vi.fn<BackupManager<Data>["addRecoveryCode"]>(() =>
      Promise.resolve(),
    ),
  } satisfies BackupManager<Data>;

  return {
    manager,
    setState(patch: Partial<BackupState>) {
      current = { ...current, ...patch };
      for (const listener of listeners) listener();
    },
  };
}
