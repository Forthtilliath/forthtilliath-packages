import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Repeat } from "./repeat.js";
import { SlotOrCallback } from "./slot-or-callback.js";

describe("SlotOrCallback", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a React node as-is", () => {
    render(
      <SlotOrCallback>
        <p>Hello World</p>
      </SlotOrCallback>,
    );
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("calls a parameterless render function", () => {
    render(<SlotOrCallback>{() => <p>No args</p>}</SlotOrCallback>);
    expect(screen.getByText("No args")).toBeDefined();
  });

  it("passes `args` to the render function", () => {
    render(
      <SlotOrCallback args={["Ada", 36]}>
        {(name: string, age: number) => (
          <p>
            {name} is {age}
          </p>
        )}
      </SlotOrCallback>,
    );
    expect(screen.getByText("Ada is 36")).toBeDefined();
  });

  it("requires `args` when the render function expects parameters", () => {
    const element = (
      // @ts-expect-error `args` is required as soon as `children` takes parameters
      <SlotOrCallback>{(name: string) => name}</SlotOrCallback>
    );
    expect(element).toBeDefined();
  });
});

describe("Repeat", () => {
  afterEach(() => {
    cleanup();
  });

  it("repeats a static node `count` times", () => {
    render(
      <Repeat count={3}>
        <span>item</span>
      </Repeat>,
    );
    expect(screen.getAllByText("item")).toHaveLength(3);
  });

  it("passes the index to a render function", () => {
    render(<Repeat count={3}>{(index) => <span>item {index}</span>}</Repeat>);
    expect(screen.getByText("item 0")).toBeDefined();
    expect(screen.getByText("item 2")).toBeDefined();
  });
});
