// @vitest-environment jsdom
import { useRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { getTabbableElements, useFocusTrap } from "./useFocusTrap.js";

function Dialog({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  if (!open) return null;
  return (
    <div ref={ref} role="dialog">
      <button type="button">first</button>
      <button type="button" tabIndex={-1}>
        skipped
      </button>
      <button type="button" disabled>
        disabled
      </button>
      <button type="button">last</button>
    </div>
  );
}

function App({ open }: { open: boolean }) {
  return (
    <>
      <button type="button">opener</button>
      <Dialog open={open} />
    </>
  );
}

const tab = (shiftKey = false) => {
  fireEvent.keyDown(document, { key: "Tab", shiftKey });
};

describe("useFocusTrap", () => {
  afterEach(cleanup);

  it("focuses the first tabbable element on activation", () => {
    render(<App open />);

    expect(document.activeElement).toBe(screen.getByText("first"));
  });

  it("wraps Tab from the last element to the first, and back", () => {
    render(<App open />);
    screen.getByText("last").focus();

    tab();
    expect(document.activeElement).toBe(screen.getByText("first"));

    tab(true);
    expect(document.activeElement).toBe(screen.getByText("last"));
  });

  it("pulls back focus that escaped the container", () => {
    render(<App open />);
    screen.getByText("opener").focus();

    tab();
    expect(document.activeElement).toBe(screen.getByText("first"));
  });

  it("restores focus to the previously focused element on release", () => {
    const { rerender } = render(<App open={false} />);
    screen.getByText("opener").focus();

    rerender(<App open />);
    expect(document.activeElement).toBe(screen.getByText("first"));

    rerender(<App open={false} />);
    expect(document.activeElement).toBe(screen.getByText("opener"));
  });

  it("does nothing while inactive", () => {
    render(<App open={false} />);
    screen.getByText("opener").focus();

    tab();
    expect(document.activeElement).toBe(screen.getByText("opener"));
  });
});

describe("getTabbableElements", () => {
  afterEach(cleanup);

  it("skips disabled and tabindex=-1 elements", () => {
    render(<App open />);

    const labels = getTabbableElements(screen.getByRole("dialog")).map(
      (el) => el.textContent,
    );
    expect(labels).toEqual(["first", "last"]);
  });
});
