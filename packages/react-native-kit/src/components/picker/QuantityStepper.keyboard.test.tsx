import { act, type ComponentRef, createRef } from "react";
import { TextInput } from "react-native";
import { describe, expect, it, vi } from "vitest";

import { renderTree } from "../../__mocks__/renderTree.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { QuantityStepper } from "./QuantityStepper.js";

interface FieldProps {
  ref?: unknown;
  returnKeyType?: string;
  submitBehavior?: string;
  onChangeText: (t: string) => void;
  onSubmitEditing?: () => void;
}

function field(tree: ReturnType<typeof renderTree>) {
  return propsOf<FieldProps>(tree.root.findByType(TextInput));
}

describe("QuantityStepper keyboard chain", () => {
  it("keeps the default Enter key without onSubmitEditing", () => {
    const tree = renderTree(
      <QuantityStepper value={3} onChange={vi.fn()} label="Pain" />,
    );
    expect(field(tree).returnKeyType).toBeUndefined();
    expect(field(tree).submitBehavior).toBeUndefined();
    expect(field(tree).onSubmitEditing).toBeUndefined();
  });

  it("shows a next key and keeps the keyboard open with onSubmitEditing", () => {
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onSubmitEditing={vi.fn()}
      />,
    );
    expect(field(tree).returnKeyType).toBe("next");
    expect(field(tree).submitBehavior).toBe("submit");
  });

  it("takes a custom Enter key label", () => {
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        onSubmitEditing={vi.fn()}
        returnKeyType="done"
      />,
    );
    expect(field(tree).returnKeyType).toBe("done");
  });

  it("sends the typed draft before moving on", () => {
    const calls: string[] = [];
    const tree = renderTree(
      <QuantityStepper
        value={12}
        onChange={(n) => calls.push(`change ${String(n)}`)}
        label="Bans"
        min={10}
        onSubmitEditing={() => calls.push("submit")}
      />,
    );
    // "2" is below min: kept as a draft until the field is left.
    act(() => {
      field(tree).onChangeText("2");
    });
    act(() => {
      field(tree).onSubmitEditing?.();
    });
    expect(calls).toEqual(["change 10", "submit"]);
  });

  it("hands inputRef to the field", () => {
    const ref = createRef<ComponentRef<typeof TextInput>>();
    const tree = renderTree(
      <QuantityStepper
        value={3}
        onChange={vi.fn()}
        label="Pain"
        inputRef={ref}
      />,
    );
    expect(field(tree).ref).toBe(ref);
  });
});
