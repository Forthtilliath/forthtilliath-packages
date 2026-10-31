import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { ColorDot } from "./ColorDot.js";

describe("ColorDot", () => {
  it("renders nothing when no color is given", async () => {
    await render(<ColorDot />);
    expect(screen.toJSON()).toBeNull();
  });

  it("renders nothing for an empty-string color", async () => {
    await render(<ColorDot color="" />);
    expect(screen.toJSON()).toBeNull();
  });

  it("renders a single View with the given background color", async () => {
    await render(<ColorDot color="#ef4444" />);
    expect(screen.root?.type).toBe("View");
    expect(screen.root?.children).toEqual([]);
    expect(screen.root).toHaveStyle({ backgroundColor: "#ef4444" });
  });

  it("defaults to a 10px circle", async () => {
    await render(<ColorDot color="#000000" />);
    expect(screen.root).toHaveStyle({ width: 10, height: 10, borderRadius: 5 });
  });

  it("stays a circle at a custom size", async () => {
    await render(<ColorDot color="#000000" size={24} />);
    expect(screen.root).toHaveStyle({
      width: 24,
      height: 24,
      borderRadius: 12,
    });
  });

  it("merges the custom style after the computed one", async () => {
    await render(
      <ColorDot
        color="#000000"
        size={12}
        style={{ marginRight: 8, borderWidth: 1 }}
      />,
    );
    expect(screen.root).toHaveStyle({
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#000000",
      marginRight: 8,
      borderWidth: 1,
    });
  });

  it("lets the custom style win on conflicting keys", async () => {
    await render(
      <ColorDot color="#000000" size={12} style={{ borderRadius: 2 }} />,
    );
    expect(screen.root).toHaveStyle({ borderRadius: 2 });
  });
});
