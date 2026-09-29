import { describe, expect, it } from "vitest";

import { mergeSlotStyles } from "./mergeSlotStyles.js";

describe("mergeSlotStyles", () => {
  const defaults = {
    container: { padding: 8 },
    title: { fontSize: 16, color: "#111" },
  };

  it("pairs each default slot with its override", () => {
    const merged = mergeSlotStyles(defaults, {
      title: { color: "red" },
      iconColor: "blue",
    });
    expect(merged).toEqual({
      container: [{ padding: 8 }, undefined],
      title: [{ fontSize: 16, color: "#111" }, { color: "red" }],
    });
  });

  it("leaves every slot's override undefined without a styles prop", () => {
    expect(mergeSlotStyles(defaults, undefined)).toEqual({
      container: [{ padding: 8 }, undefined],
      title: [{ fontSize: 16, color: "#111" }, undefined],
    });
  });

  it("ignores override keys with no default slot", () => {
    const merged = mergeSlotStyles(defaults, { iconColor: "blue" });
    expect(Object.keys(merged)).toEqual(["container", "title"]);
  });
});
