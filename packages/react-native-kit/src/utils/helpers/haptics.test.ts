import * as Haptics from "expo-haptics";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  errorFeedback,
  selectFeedback,
  successFeedback,
  tapFeedback,
} from "./haptics.js";

const impact = vi.mocked(Haptics.impactAsync);
const selection = vi.mocked(Haptics.selectionAsync);
const notification = vi.mocked(Haptics.notificationAsync);

describe("haptics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps each alias to its expo-haptics call", () => {
    tapFeedback();
    selectFeedback();
    successFeedback();
    errorFeedback();
    expect(impact).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    expect(selection).toHaveBeenCalledTimes(1);
    expect(notification.mock.calls).toEqual([
      [Haptics.NotificationFeedbackType.Success],
      [Haptics.NotificationFeedbackType.Error],
    ]);
  });

  it("swallows a failed vibration", async () => {
    const failure = () => Promise.reject(new Error("no haptics"));
    impact.mockImplementationOnce(failure);
    selection.mockImplementationOnce(failure);
    notification.mockImplementationOnce(failure);
    notification.mockImplementationOnce(failure);
    expect(() => {
      tapFeedback();
      selectFeedback();
      successFeedback();
      errorFeedback();
    }).not.toThrow();
    // Let the rejections settle: an unhandled one would fail the run.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
