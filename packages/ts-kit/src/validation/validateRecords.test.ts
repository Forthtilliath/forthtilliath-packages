import { describe, expect, it } from "vitest";

import {
  inRange,
  isBoolean,
  isFiniteNumber,
  isInteger,
  isPositiveInteger,
  isString,
  maxLength,
  nullable,
  oneOf,
  optional,
  required,
} from "./rules.js";
import { RecordValidationError, validateRecords } from "./validateRecords.js";

const ratioSpec = {
  id: required(isPositiveInteger),
  label: required(maxLength(20)),
  gramsPerUnit: required(inRange(0, 200, { exclusiveMin: true })),
  unit: optional(oneOf("g", "oz")),
  note: optional(nullable(isString)),
};

function errorOf(fn: () => unknown): RecordValidationError {
  try {
    fn();
  } catch (error) {
    if (error instanceof RecordValidationError) return error;
    throw error;
  }
  throw new Error("expected a RecordValidationError");
}

describe("rules", () => {
  it("checks primitive types strictly", () => {
    expect(isFiniteNumber(1.5)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber("1")).toBe(false);
    expect(isInteger(-3)).toBe(true);
    expect(isPositiveInteger(0)).toBe(false);
    expect(isBoolean(0)).toBe(false);
  });

  it("bounds ranges, inclusive unless exclusiveMin", () => {
    expect(inRange(0, 10)(0)).toBe(true);
    expect(inRange(0, 10, { exclusiveMin: true })(0)).toBe(false);
    expect(inRange(0, 10)(10.1)).toBe(false);
  });

  it("caps string length and accepts null only through nullable", () => {
    expect(maxLength(3)("abcd")).toBe(false);
    expect(isString(null)).toBe(false);
    expect(nullable(isString)(null)).toBe(true);
  });
});

describe("validateRecords", () => {
  it("returns clean copies without unknown fields", () => {
    const [row] = validateRecords(
      [{ id: 1, label: "Lunch", gramsPerUnit: 10, injected: "x" }],
      ratioSpec,
    );
    expect(row).toEqual({ id: 1, label: "Lunch", gramsPerUnit: 10 });
  });

  it("does not copy a __proto__ key from the input", () => {
    const rows: unknown = JSON.parse(
      '[{"id":1,"label":"a","gramsPerUnit":1,"__proto__":{"admin":true}}]',
    );
    const [row] = validateRecords(rows, ratioSpec);
    expect(Object.getPrototypeOf(row)).toBe(Object.prototype);
  });

  it.each([
    ["negative", -10],
    ["zero", 0],
    ["a string", "10"],
    ["absurd", 5000],
  ])("rejects a %s value", (_label, gramsPerUnit) => {
    const error = errorOf(() =>
      validateRecords([{ id: 1, label: "Lunch", gramsPerUnit }], ratioSpec, {
        label: "ratios",
      }),
    );
    expect(error).toMatchObject({
      reason: "invalid",
      path: "ratios[0]",
      field: "gramsPerUnit",
    });
  });

  it("rejects a missing required field but allows a missing optional one", () => {
    expect(
      errorOf(() => validateRecords([{ id: 1, label: "Lunch" }], ratioSpec)),
    ).toMatchObject({
      reason: "missing",
      field: "gramsPerUnit",
    });
    expect(() =>
      validateRecords([{ id: 1, label: "Lunch", gramsPerUnit: 10 }], ratioSpec),
    ).not.toThrow();
  });

  it("rejects duplicates of the unique key", () => {
    const row = { id: 1, label: "Lunch", gramsPerUnit: 10 };
    const error = errorOf(() =>
      validateRecords([row, row], ratioSpec, { uniqueKey: "id" }),
    );
    expect(error).toMatchObject({
      reason: "duplicate",
      path: "records[1]",
      field: "id",
    });
  });

  it("rejects a value that is not a list of objects", () => {
    expect(errorOf(() => validateRecords({}, ratioSpec)).reason).toBe(
      "not-a-list",
    );
    expect(errorOf(() => validateRecords([null], ratioSpec)).reason).toBe(
      "not-an-object",
    );
    expect(errorOf(() => validateRecords([[1]], ratioSpec)).reason).toBe(
      "not-an-object",
    );
  });

  it("describes the error in its message", () => {
    const error = errorOf(() =>
      validateRecords([{ id: 0 }], ratioSpec, { label: "ratios" }),
    );
    expect(error.message).toBe('ratios[0]: "id" invalid');
    expect(error).toBeInstanceOf(Error);
  });
});
