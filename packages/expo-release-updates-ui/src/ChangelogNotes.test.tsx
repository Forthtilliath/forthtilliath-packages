import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import { ChangelogNotes } from "./ChangelogNotes.js";

describe("ChangelogNotes", () => {
  it("renders a heading as a distinct Text node", async () => {
    await render(<ChangelogNotes notes="### Added" />);
    expect(screen.getByText("Added")).toBeOnTheScreen();
  });

  it("renders a list item with a bullet and the item text", async () => {
    await render(<ChangelogNotes notes="- Export history to CSV." />);
    expect(screen.root?.type).toBe("View");
    expect(screen.getByText("•")).toBeOnTheScreen();
    expect(screen.root).toHaveTextContent("Export history to CSV.", {
      exact: false,
    });
  });

  it("renders bold segments with a different style than the surrounding text", async () => {
    await render(<ChangelogNotes notes="- **Broken widget**: fixed." />);
    expect(screen.getByText("Broken widget")).toHaveStyle({
      fontWeight: "700",
    });
    expect(screen.getByText(": fixed.")).not.toHaveStyle({
      fontWeight: "700",
    });
  });

  it("renders italic and code segments with their own style", async () => {
    await render(<ChangelogNotes notes="An *important* fix in `sync`" />);
    expect(screen.getByText("important")).toHaveStyle({ fontStyle: "italic" });
    expect(screen.getByText("sync")).toHaveStyle({ fontFamily: "monospace" });
    expect(screen.getByText("An ")).not.toHaveStyle({ fontStyle: "italic" });
  });

  it("renders a quote without its > marker", async () => {
    await render(<ChangelogNotes notes="> Back up before updating" />);
    expect(screen.getByText("Back up before updating")).toBeOnTheScreen();
    expect(screen.queryByText(/>/)).not.toBeOnTheScreen();
  });

  it("applies custom styles over the defaults, without dropping the rest of the default style", async () => {
    await render(
      <ChangelogNotes
        notes="### Added"
        styles={{ heading: { color: "red" } }}
      />,
    );
    expect(screen.getByText("Added")).toHaveStyle({
      fontSize: 13,
      fontWeight: "700",
      color: "red",
      marginTop: 8,
    });
  });

  it("renders nothing for empty notes", async () => {
    await render(<ChangelogNotes notes="" />);
    expect(screen.queryByText(/./)).not.toBeOnTheScreen();
  });
});
