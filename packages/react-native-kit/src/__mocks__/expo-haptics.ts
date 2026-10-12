import type { Mock } from "vitest";
import { vi } from "vitest";

// Wraps the native vibration motor, unavailable under Vitest — spies that
// resolve by default; tests make them reject to check failures are swallowed.
export const ImpactFeedbackStyle = { Light: "light" } as const;
export const NotificationFeedbackType = {
  Success: "success",
  Error: "error",
} as const;

export const impactAsync: Mock = vi.fn(() => Promise.resolve());
export const selectionAsync: Mock = vi.fn(() => Promise.resolve());
export const notificationAsync: Mock = vi.fn(() => Promise.resolve());
