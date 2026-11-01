import { describe, expect, it } from "vitest";

import { pngsToIco } from "./pngsToIco.js";

const png = (...bytes: number[]) => new Uint8Array(bytes);

describe("pngsToIco", () => {
  it("writes the header, one entry per image, then the data", () => {
    const first = png(1, 2, 3);
    const second = png(4, 5);
    const ico = pngsToIco([
      { size: 16, png: first },
      { size: 32, png: second },
    ]);
    const view = new DataView(ico.buffer);

    expect(ico.length).toBe(6 + 2 * 16 + 5);
    expect(view.getUint16(0, true)).toBe(0);
    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);

    // First entry
    expect(view.getUint8(6)).toBe(16);
    expect(view.getUint8(7)).toBe(16);
    expect(view.getUint16(10, true)).toBe(1);
    expect(view.getUint16(12, true)).toBe(32);
    expect(view.getUint32(14, true)).toBe(3);
    expect(view.getUint32(18, true)).toBe(38);

    // Second entry
    expect(view.getUint8(22)).toBe(32);
    expect(view.getUint32(30, true)).toBe(2);
    expect(view.getUint32(34, true)).toBe(41);

    expect([...ico.slice(38)]).toEqual([1, 2, 3, 4, 5]);
  });

  it("writes 256 px as 0", () => {
    const view = new DataView(pngsToIco([{ size: 256, png: png(0) }]).buffer);

    expect(view.getUint8(6)).toBe(0);
    expect(view.getUint8(7)).toBe(0);
  });

  it("rejects an empty list", () => {
    expect(() => pngsToIco([])).toThrow(RangeError);
  });

  it("rejects sizes out of range", () => {
    for (const size of [0, 257, 1.5, Number.NaN]) {
      expect(() => pngsToIco([{ size, png: png(0) }])).toThrow(RangeError);
    }
  });
});
