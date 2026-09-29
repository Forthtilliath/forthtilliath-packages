import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FocusOnMount } from "./focus-on-mount.js";

describe("FocusOnMount", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("takes focus on mount, as a labelled region", () => {
    render(
      <FocusOnMount label="Search results" className="results">
        <p>3 results</p>
      </FocusOnMount>,
    );
    const region = screen.getByRole("region", { name: "Search results" });

    expect(document.activeElement).toBe(region);
    expect(region.getAttribute("tabindex")).toBe("-1");
    expect(region.className).toBe("results");
  });

  it("focuses without scrolling the page", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    render(<FocusOnMount label="x">content</FocusOnMount>);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("doesn't steal focus back on re-render", () => {
    const { rerender } = render(<FocusOnMount label="x">a</FocusOnMount>);
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    rerender(<FocusOnMount label="x">b</FocusOnMount>);

    expect(document.activeElement).toBe(input);
    input.remove();
  });
});
