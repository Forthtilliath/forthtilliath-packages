import { AccessibilityInfo, View } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { flattenStyle, screenElements } from "../../__mocks__/screenQueries.js";

import { hideToast, showToast } from "./toast.js";
import { ToastHost } from "./ToastHost.js";

/** Lets the recommended-timeout promise resolve, then moves the clock. */
async function advance(ms: number) {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    vi.advanceTimersByTime(ms);
  });
}

async function show(
  message: string,
  options?: Parameters<typeof showToast>[1],
) {
  let id: number | null = null;
  await act(() => {
    id = showToast(message, options);
  });
  return id;
}

describe("ToastHost", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does nothing without a host", () => {
    expect(showToast("perdu")).toBeNull();
  });

  it("shows a message announced by TalkBack, hidden after 3.5 s", async () => {
    const onHide = vi.fn();
    await render(<ToastHost />);
    expect(await show("Partie enregistrée", { onHide })).toEqual(
      expect.any(Number),
    );
    expect(screen.getByText("Partie enregistrée")).toBeOnTheScreen();
    expect(screen.root).toHaveProp("accessibilityLiveRegion", "polite");

    await advance(3400);
    expect(screen.getByText("Partie enregistrée")).toBeOnTheScreen();
    await advance(100);
    expect(screen.queryByText("Partie enregistrée")).not.toBeOnTheScreen();
    expect(onHide).toHaveBeenCalledExactlyOnceWith("timeout");
  });

  it("keeps a toast with an action 5 s, the action closing it", async () => {
    const onPress = vi.fn();
    const onHide = vi.fn();
    await render(<ToastHost />);
    await show("« Marie » supprimée", {
      action: { label: "Annuler", onPress },
      onHide,
    });

    await advance(4900);
    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledExactlyOnceWith("action");
    expect(screen.queryByText("« Marie » supprimée")).not.toBeOnTheScreen();
  });

  it("lengthens the delay as Android's accessibility setting asks", async () => {
    const spy = vi
      .spyOn(AccessibilityInfo, "getRecommendedTimeoutMillis")
      .mockResolvedValue(10_000);
    await render(<ToastHost />);
    await show("Lent");
    expect(spy).toHaveBeenCalledWith(3500);
    await advance(9000);
    expect(screen.getByText("Lent")).toBeOnTheScreen();
    await advance(1000);
    expect(screen.queryByText("Lent")).not.toBeOnTheScreen();
    spy.mockRestore();
  });

  it("closes on a tap of the message", async () => {
    const onHide = vi.fn();
    await render(<ToastHost />);
    await show("Copié", { onHide });
    await fireEvent.press(screen.getByRole("button", { name: "Copié" }));
    expect(onHide).toHaveBeenCalledWith("dismissed");
    expect(screen.queryByText("Copié")).not.toBeOnTheScreen();
  });

  it("replaces the toast on screen, with a fresh delay", async () => {
    const first = vi.fn();
    await render(<ToastHost />);
    await show("Premier", { onHide: first, durationMs: 1000 });
    await advance(800);
    await show("Second", { durationMs: 1000 });
    expect(first).toHaveBeenCalledWith("replaced");
    expect(screen.getByText("Second")).toBeOnTheScreen();
    await advance(800);
    expect(screen.getByText("Second")).toBeOnTheScreen();
  });

  it("hides on hideToast() and on unmount", async () => {
    const onHide = vi.fn();
    const { unmount } = await render(<ToastHost />);
    await show("A", { onHide });
    await act(() => {
      hideToast();
    });
    expect(onHide).toHaveBeenLastCalledWith("hidden");
    expect(screen.queryByText("A")).not.toBeOnTheScreen();

    await show("B", { onHide });
    await unmount();
    expect(onHide).toHaveBeenLastCalledWith("hidden");
    expect(onHide).toHaveBeenCalledTimes(2);
  });

  it("sends toasts to the most recently mounted host", async () => {
    const { rerender } = await render(
      <View>
        <ToastHost bottomOffset={10} />
      </View>,
    );
    await rerender(
      <View>
        <ToastHost bottomOffset={10} />
        <ToastHost bottomOffset={99} />
      </View>,
    );
    await show("Dans la modale");
    const bars = screenElements("View").filter(
      (view) => flattenStyle(view.props.style).position === "absolute",
    );
    expect(bars.map((bar) => flattenStyle(bar.props.style).bottom)).toEqual([
      99,
    ]);
  });

  it("applies the offset, line limit, hint and style overrides", async () => {
    await render(
      <ToastHost
        bottomOffset={80}
        maxLines={1}
        locale="en"
        styles={{
          toast: { backgroundColor: "#222222" },
          message: { color: "#eeeeee" },
        }}
      />,
    );
    await show("Hello");
    expect(screen.root).toHaveStyle({
      bottom: 80,
      backgroundColor: "#222222",
      left: 16,
    });
    expect(screen.getByText("Hello")).toHaveProp("numberOfLines", 1);
    expect(screen.getByText("Hello")).toHaveStyle({
      color: "#eeeeee",
      fontSize: 15,
    });
    expect(screen.getByRole("button", { name: "Hello" })).toHaveProp(
      "accessibilityHint",
      "Hides the message",
    );
  });
});
