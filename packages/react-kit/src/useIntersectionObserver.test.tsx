import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useIntersectionObserver } from "./useIntersectionObserver.js";

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

class FakeIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  static instances: FakeIntersectionObserver[] = [];

  constructor(private readonly callback: ObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry]);
  }
}

function Target({ once }: { once?: boolean }) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    once,
  });
  return <div ref={ref}>{isIntersecting ? "visible" : "hidden"}</div>;
}

describe("useIntersectionObserver", () => {
  afterEach(() => {
    cleanup();
    FakeIntersectionObserver.instances = [];
    vi.unstubAllGlobals();
  });

  it("starts as not intersecting", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    render(<Target />);

    expect(screen.getByText("hidden")).toBeDefined();
  });

  it("updates once the observed element intersects", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    render(<Target />);

    act(() => {
      FakeIntersectionObserver.instances[0]?.trigger(true);
    });

    expect(screen.getByText("visible")).toBeDefined();
  });

  it("disconnects after the first intersection when `once` is set", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    render(<Target once />);
    const observer = FakeIntersectionObserver.instances[0];

    act(() => {
      observer?.trigger(true);
    });

    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });

  it("disconnects the observer on unmount", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const { unmount } = render(<Target />);
    const observer = FakeIntersectionObserver.instances[0];

    unmount();

    expect(observer?.disconnect).toHaveBeenCalledTimes(1);
  });
});
