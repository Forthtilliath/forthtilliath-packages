import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Show } from "./show.js";

describe("Show", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders static children when `when` is truthy", () => {
    render(<Show when={true}>content</Show>);
    expect(screen.getByText("content")).toBeDefined();
  });

  it("renders the fallback when `when` is falsy", () => {
    render(
      <Show when={false} fallback="fallback">
        content
      </Show>,
    );
    expect(screen.queryByText("content")).toBeNull();
    expect(screen.getByText("fallback")).toBeDefined();
  });

  it("renders nothing when `when` is falsy and no fallback is given", () => {
    const { container } = render(<Show when={null}>content</Show>);
    expect(container.innerHTML).toBe("");
  });

  it("passes the `when` value to a render function", () => {
    const user = { name: "Ada" };
    render(<Show when={user}>{(u) => <p>Hello {u.name}</p>}</Show>);
    expect(screen.getByText("Hello Ada")).toBeDefined();
  });

  it("does not call the render function when `when` is falsy", () => {
    const renderChildren = vi.fn(() => "content");
    render(<Show when={undefined}>{renderChildren}</Show>);
    expect(renderChildren).not.toHaveBeenCalled();
  });
});
