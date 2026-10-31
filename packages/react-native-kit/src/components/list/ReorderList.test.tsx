import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { screenIcons, screenTexts } from "../../__mocks__/screenQueries.js";

import { ReorderList } from "./ReorderList.js";

interface Player {
  id: string;
  name: string;
}

const PLAYERS: Player[] = [
  { id: "a", name: "Alice" },
  { id: "b", name: "Bruno" },
  { id: "c", name: "Chloé" },
];

function Controlled({ onChange }: { onChange?: (players: Player[]) => void }) {
  const [players, setPlayers] = useState(PLAYERS);
  return (
    <ReorderList
      items={players}
      keyExtractor={(p) => p.id}
      getLabel={(p) => p.name}
      onChange={(next, move) => {
        onChange?.(next);
        expect(move.to - move.from).toBeOneOf([-1, 1]);
        setPlayers(next);
      }}
    />
  );
}

describe("ReorderList", () => {
  it("shows each item with its position and two chevrons", async () => {
    await render(<Controlled />);
    expect(screenTexts()).toEqual(["1", "Alice", "2", "Bruno", "3", "Chloé"]);
    expect(screenIcons()).toEqual([
      "chevron-up",
      "chevron-down",
      "chevron-up",
      "chevron-down",
      "chevron-up",
      "chevron-down",
    ]);
  });

  it("moves an item up and down", async () => {
    const onChange = vi.fn();
    await render(<Controlled onChange={onChange} />);
    await fireEvent.press(screen.getByRole("button", { name: "Monter Bruno" }));
    expect(screenTexts()).toEqual(["1", "Bruno", "2", "Alice", "3", "Chloé"]);

    await fireEvent.press(
      screen.getByRole("button", { name: "Descendre Bruno" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(PLAYERS);
  });

  it("disables ▲ on the first item and ▼ on the last", async () => {
    await render(<Controlled />);
    expect(screen.getByRole("button", { name: "Monter Alice" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Descendre Chloé" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Descendre Alice" }),
    ).toBeEnabled();
  });

  it("calls onMoveFeedback, speaks English, takes custom labels", async () => {
    const feedback = vi.fn();
    await render(
      <ReorderList
        items={PLAYERS}
        keyExtractor={(p) => p.id}
        getLabel={(p) => p.name}
        onChange={vi.fn()}
        onMoveFeedback={feedback}
        locale="en"
        labels={{ moveDown: (l) => `Lower ${l}` }}
      />,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Move Bruno up" }),
    );
    expect(feedback).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Lower Bruno" }),
    ).toBeOnTheScreen();
  });

  it("renders custom content and hides positions", async () => {
    await render(
      <ReorderList
        items={PLAYERS}
        keyExtractor={(p) => p.id}
        getLabel={(p) => p.name}
        onChange={vi.fn()}
        showPosition={false}
        renderItem={(p, i) => (
          <Text>{`${p.name.toUpperCase()}-${String(i)}`}</Text>
        )}
        styles={{ arrowColor: "#ff0000" }}
      />,
    );
    expect(screenTexts()).toEqual(["ALICE-0", "BRUNO-1", "CHLOÉ-2"]);
  });
});
