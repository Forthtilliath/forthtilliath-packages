import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  useHorizontalScroll,
  type UseHorizontalScrollOptions,
} from "./useHorizontalScroll.js";

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: () => void) {
    MockResizeObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.push(el);
  }

  disconnect() {
    this.disconnected = true;
  }

  trigger() {
    this.callback();
  }
}

function Harness(props: UseHorizontalScrollOptions) {
  const { scrollRef, innerRef, canScrollLeft, canScrollRight } =
    useHorizontalScroll<HTMLSpanElement>(props);
  return (
    <div ref={scrollRef} data-testid="scroll">
      <span ref={innerRef} data-testid="inner" />
      <output>{`${String(canScrollLeft)},${String(canScrollRight)}`}</output>
    </div>
  );
}

function setMetrics(
  el: HTMLElement,
  metrics: { scrollLeft: number; clientWidth: number; scrollWidth: number },
) {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(el, key, { configurable: true, value });
  }
}

function triggerResize() {
  act(() => {
    MockResizeObserver.instances[0]?.trigger();
  });
}

describe("useHorizontalScroll", () => {
  beforeEach(() => {
    MockResizeObserver.instances = [];
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("observes both the container and its content", () => {
    render(<Harness />);

    expect(MockResizeObserver.instances[0]?.observed).toEqual([
      screen.getByTestId("scroll"),
      screen.getByTestId("inner"),
    ]);
  });

  it("reports which directions can still be scrolled", () => {
    render(<Harness />);
    const scroll = screen.getByTestId("scroll");

    setMetrics(scroll, { scrollLeft: 0, clientWidth: 100, scrollWidth: 300 });
    triggerResize();
    expect(screen.getByRole("status").textContent).toBe("false,true");

    setMetrics(scroll, { scrollLeft: 100, clientWidth: 100, scrollWidth: 300 });
    triggerResize();
    expect(screen.getByRole("status").textContent).toBe("true,true");

    setMetrics(scroll, { scrollLeft: 200, clientWidth: 100, scrollWidth: 300 });
    triggerResize();
    expect(screen.getByRole("status").textContent).toBe("true,false");
  });

  it("scrolls by the configured step on arrow keys", () => {
    render(<Harness step={100} />);
    const scrollBy = vi.fn();
    screen.getByTestId("scroll").scrollBy = scrollBy;

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(scrollBy.mock.calls).toEqual([
      [{ left: 100, behavior: "smooth" }],
      [{ left: -100, behavior: "smooth" }],
    ]);
  });

  it("ignores arrow keys while a form field has focus", () => {
    render(
      <>
        <Harness />
        <input data-testid="field" />
      </>,
    );
    const scrollBy = vi.fn();
    screen.getByTestId("scroll").scrollBy = scrollBy;
    screen.getByTestId("field").focus();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("does not listen to the keyboard when disabled", () => {
    render(<Harness keyboard={false} />);
    const scrollBy = vi.fn();
    screen.getByTestId("scroll").scrollBy = scrollBy;

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Harness />);

    unmount();

    expect(MockResizeObserver.instances[0]?.disconnected).toBe(true);
  });
});
