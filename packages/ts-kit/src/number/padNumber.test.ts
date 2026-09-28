import { describe, expect, it } from "vitest";

import { padNumber } from "./padNumber.js";

describe("padNumber", () => {
  it("pads to the width of the total", () => {
    expect(padNumber(1, 12)).toBe("01");
    expect(padNumber(12, 12)).toBe("12");
    expect(padNumber(7, 120)).toBe("007");
  });

  it("uses a width of 2 at least by default", () => {
    expect(padNumber(3, 5)).toBe("03");
  });

  it("accepts a custom minimum width", () => {
    expect(padNumber(3, 5, 1)).toBe("3");
    expect(padNumber(3, 5, 4)).toBe("0003");
  });
});
