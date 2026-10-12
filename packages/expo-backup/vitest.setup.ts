import { vi } from "vitest";

// Native modules can't load under Node: every test gets the in-memory
// device of src/__mocks__/fakeDevice.ts instead.
vi.mock(
  "react-native",
  async () => (await import("./src/__mocks__/fakeDevice.js")).reactNativeModule,
);
vi.mock(
  "expo-file-system",
  async () => (await import("./src/__mocks__/fakeDevice.js")).fileSystemModule,
);
vi.mock(
  "expo-secure-store",
  async () => (await import("./src/__mocks__/fakeDevice.js")).secureStoreModule,
);
vi.mock(
  "expo-crypto",
  async () => (await import("./src/__mocks__/fakeDevice.js")).cryptoModule,
);
vi.mock(
  "expo-sharing",
  async () => (await import("./src/__mocks__/fakeDevice.js")).sharingModule,
);
