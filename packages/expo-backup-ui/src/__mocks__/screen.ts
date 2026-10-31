import { Alert } from "react-native";
import { act, fireEvent, screen } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";
import { vi } from "vitest";

import type { AlertButton } from "./react-native.js";

/** Lets pending promises (and zero-delay timers) settle. */
export async function flush(): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

/** Taps the button named `label`, then lets its work settle. */
export async function press(label: string) {
  await fireEvent.press(screen.getByRole("button", { name: label }));
  await flush();
}

/** Every text on screen, one per line — for substring checks. */
export function allText(): string {
  const texts = screen.root?.queryAll((node) => node.type === "Text") ?? [];
  return texts
    .map((text) =>
      text.children.filter((child) => typeof child === "string").join(""),
    )
    .join("\n");
}

/** Host elements of `type` on screen (e.g. the native "Switch"). */
export function elementsOfType(type: string): TestInstance[] {
  return screen.root?.queryAll((node) => node.type === type) ?? [];
}

type AlertCall = [title: string, message?: string, buttons?: AlertButton[]];

/** Spies on Alert.alert; `tap(text)` presses a button of the last alert. */
export function spyOnAlerts() {
  const spy = vi.spyOn(Alert, "alert");
  return {
    spy,
    last: () => spy.mock.calls.at(-1) as unknown as AlertCall | undefined,
    async tap(text: string) {
      const call = spy.mock.calls.at(-1) as unknown as AlertCall | undefined;
      const button = call?.[2]?.find((candidate) => candidate.text === text);
      if (!button?.onPress)
        throw new Error(`no "${text}" button in the last alert`);
      await act(async () => {
        button.onPress?.();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
  };
}
