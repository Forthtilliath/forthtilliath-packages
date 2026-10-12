/**
 * In-memory stand-ins for the native modules a device provides (files,
 * secure store, share sheet, file picker, app state). `resetDevice()`
 * simulates a brand-new phone; the fake Drive (see fakeDrive.ts) is separate
 * and survives it, like a real Google account.
 */
export const device = {
  files: new Map<string, string>(),
  secureStore: new Map<string, string>(),
  shared: [] as string[],
  sharingAvailable: true,
  /** Next file the picker returns; null = cancelled. */
  pickedContent: null as string | null,
  appStateListeners: new Set<(status: string) => void>(),
};

export function resetDevice() {
  device.files.clear();
  device.secureStore.clear();
  device.shared = [];
  device.sharingAvailable = true;
  device.pickedContent = null;
  device.appStateListeners.clear();
}

class FakeFile {
  uri: string;
  constructor(...parts: (string | { uri: string })[]) {
    this.uri = parts.map((p) => (typeof p === "string" ? p : p.uri)).join("/");
  }
  get exists() {
    return device.files.has(this.uri);
  }
  create() {
    device.files.set(this.uri, "");
  }
  write(content: string) {
    if (!device.files.has(this.uri))
      throw new Error(`write to missing file ${this.uri}`);
    device.files.set(this.uri, content);
  }
  delete() {
    device.files.delete(this.uri);
  }
  text() {
    const content = device.files.get(this.uri);
    return content === undefined
      ? Promise.reject(new Error(`missing file ${this.uri}`))
      : Promise.resolve(content);
  }
  static pickFileAsync() {
    if (device.pickedContent === null)
      return Promise.resolve({ canceled: true, result: null });
    const picked = new FakeFile("picked", "backup.json");
    device.files.set(picked.uri, device.pickedContent);
    return Promise.resolve({ canceled: false, result: picked });
  }
}

export const fileSystemModule = {
  File: FakeFile,
  Paths: { cache: { uri: "cache" }, document: { uri: "document" } },
};

export const secureStoreModule = {
  getItemAsync: (key: string) =>
    Promise.resolve(device.secureStore.get(key) ?? null),
  setItemAsync: (key: string, value: string) => {
    device.secureStore.set(key, value);
    return Promise.resolve();
  },
};

export const cryptoModule = {
  getRandomBytes: (length: number) =>
    globalThis.crypto.getRandomValues(new Uint8Array(length)),
};

export const sharingModule = {
  isAvailableAsync: () => Promise.resolve(device.sharingAvailable),
  shareAsync: (uri: string) => {
    device.shared.push(uri);
    return Promise.resolve();
  },
};

export const reactNativeModule = {
  AppState: {
    addEventListener: (_event: string, listener: (status: string) => void) => {
      device.appStateListeners.add(listener);
      return { remove: () => device.appStateListeners.delete(listener) };
    },
  },
  NativeModules: {} as Record<string, unknown>,
  TurboModuleRegistry: { get: () => null },
};

export function emitAppState(status: string) {
  for (const listener of device.appStateListeners) listener(status);
}
