import type { Mock } from "vitest";
import { vi } from "vitest";

// Wraps native camera/library pickers, unavailable under Vitest — a plain
// object of spies is enough for PhotoPicker's tests to control permission
// grants and picked-asset results per test.
export const requestCameraPermissionsAsync: Mock = vi.fn();
export const requestMediaLibraryPermissionsAsync: Mock = vi.fn();
export const launchCameraAsync: Mock = vi.fn();
export const launchImageLibraryAsync: Mock = vi.fn();
