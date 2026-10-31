import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { flattenStyle, screenElements } from "../../__mocks__/screenQueries.js";

import { BottomSheet } from "./BottomSheet.js";

/** The backdrop: the only pressable view, without a label (a tap closes). */
function backdrop() {
  const [view] = screenElements("View").filter((v) => "onPress" in v.props);
  if (!view) throw new Error("expected the backdrop");
  return view;
}

describe("BottomSheet", () => {
  it("renders its children in a scroll view when visible", async () => {
    await render(
      <BottomSheet visible onClose={vi.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    const [scroll] = screenElements("ScrollView");
    expect(scroll).toHaveTextContent("Content");
  });

  it("renders nothing when hidden", async () => {
    await render(
      <BottomSheet visible={false} onClose={vi.fn()}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    expect(screen.toJSON()).toBeNull();
  });

  it("closes on a backdrop tap and on Android's back button", async () => {
    const onClose = vi.fn();
    await render(
      <BottomSheet visible onClose={onClose}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    await fireEvent.press(backdrop());
    const [modal] = screenElements("Modal");
    if (!modal) throw new Error("expected the modal");
    await fireEvent(modal, "requestClose");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("adds the bottom inset as a spacer under the content", async () => {
    await render(
      <BottomSheet visible onClose={vi.fn()} bottomInset={34}>
        <Text>Content</Text>
      </BottomSheet>,
    );
    const heights = screenElements("View").map(
      (view) => flattenStyle(view.props.style).height,
    );
    expect(heights).toContain(34);
  });

  it("keeps the sheet's shape when overriding its background", async () => {
    await render(
      <BottomSheet
        visible
        onClose={vi.fn()}
        styles={{ sheet: { backgroundColor: "#222222" } }}
      >
        <Text>Content</Text>
      </BottomSheet>,
    );
    const [scroll] = screenElements("ScrollView");
    expect(scroll?.parent).toHaveStyle({
      maxHeight: "85%",
      borderTopLeftRadius: 16,
      paddingBottom: 24,
      backgroundColor: "#222222",
    });
  });
});
