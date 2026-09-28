import { describe, expect, it } from "vitest";

import { createColumnStorage } from "./createColumnStorage.js";

const NAME = { key: "name", label: "Name", visible: true };
const EMAIL = { key: "email", label: "Email", visible: true };
const PHONE = { key: "phone", label: "Phone", visible: false };
const DEFAULTS = [NAME, EMAIL, PHONE];

const storage = createColumnStorage(DEFAULTS);

describe("createColumnStorage", () => {
  it("serializes only key and visibility", () => {
    expect(storage.serialize(DEFAULTS)).toBe(
      '[{"key":"name","visible":true},{"key":"email","visible":true},{"key":"phone","visible":false}]',
    );
  });

  it("round-trips order and visibility", () => {
    const columns = [
      { ...PHONE, visible: true },
      { ...NAME, visible: false },
      EMAIL,
    ];
    expect(storage.deserialize(storage.serialize(columns))).toEqual(columns);
  });

  it("drops unknown keys and appends missing columns in default order", () => {
    const raw =
      '[{"key":"old","visible":true},{"key":"email","visible":false}]';
    expect(storage.deserialize(raw)).toEqual([
      { key: "email", label: "Email", visible: false },
      { key: "name", label: "Name", visible: true },
      { key: "phone", label: "Phone", visible: false },
    ]);
  });

  it("ignores duplicate keys and keeps the default visibility when missing", () => {
    const raw = '[{"key":"phone"},{"key":"phone","visible":true}]';
    expect(storage.deserialize(raw).map((c) => [c.key, c.visible])).toEqual([
      ["phone", false],
      ["name", true],
      ["email", true],
    ]);
  });

  it("falls back to the defaults on invalid input", () => {
    expect(storage.deserialize("not json")).toEqual(DEFAULTS);
    expect(storage.deserialize('{"key":"name"}')).toEqual(DEFAULTS);
    expect(storage.deserialize("[null]")).toEqual(DEFAULTS);
  });

  it("returns a copy of the defaults", () => {
    expect(storage.deserialize("not json")).not.toBe(DEFAULTS);
  });
});
