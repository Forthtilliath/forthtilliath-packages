import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseUntrustedJson } from "./parseUntrustedJson.js";
import type { StandardSchemaV1 } from "./standardSchema.js";

const schema = z.object({
  name: z.string().min(1).max(40),
  players: z
    .array(z.object({ name: z.string().max(30), score: z.number().int() }))
    .max(12),
});

describe("parseUntrustedJson", () => {
  it("returns the validated data, unknown keys stripped by the schema", () => {
    const result = parseUntrustedJson(
      JSON.stringify({ name: "Skyjo", players: [], extra: "ignored" }),
      schema,
    );
    expect(result).toEqual({ ok: true, data: { name: "Skyjo", players: [] } });
  });

  it("refuses an empty text", () => {
    expect(parseUntrustedJson("   ", schema)).toMatchObject({
      ok: false,
      reason: "empty",
      error: "Le contenu est vide.",
    });
  });

  it("refuses a text over maxLength before parsing it", () => {
    const result = parseUntrustedJson("x".repeat(11), schema, {
      maxLength: 10,
    });
    expect(result).toMatchObject({ ok: false, reason: "too-long" });
  });

  it("refuses malformed JSON", () => {
    expect(parseUntrustedJson("{name:", schema)).toMatchObject({
      ok: false,
      reason: "malformed",
    });
  });

  it("names the first invalid field, indexes counted from 1", () => {
    const result = parseUntrustedJson(
      JSON.stringify({ name: "Skyjo", players: [{ name: "A", score: 1.5 }] }),
      schema,
    );
    expect(result).toMatchObject({
      ok: false,
      reason: "invalid",
      path: ["players", 0, "score"],
      error:
        "Contenu invalide : « players › n° 1 › score » incorrect. Rien n'a été importé.",
    });
  });

  it("keeps the unvalidated value for an invalid text", () => {
    const result = parseUntrustedJson(JSON.stringify({ version: 9 }), schema);
    expect(!result.ok && result.raw).toEqual({ version: 9 });
  });

  it("speaks English with locale en, and takes custom messages", () => {
    expect(parseUntrustedJson("", schema, { locale: "en" })).toMatchObject({
      error: "The content is empty.",
    });
    const result = parseUntrustedJson("[]", schema, {
      locale: "en",
      messages: { invalid: (where) => `Bad file (${where || "root"})` },
    });
    expect(result).toMatchObject({ error: "Bad file (root)" });
    expect(
      parseUntrustedJson(JSON.stringify({ name: "" }), schema, {
        locale: "en",
      }),
    ).toMatchObject({
      error: 'Invalid content: "name" is incorrect. Nothing was imported.',
    });
  });

  it("describes paths with a custom function", () => {
    const result = parseUntrustedJson(JSON.stringify({ name: 3 }), schema, {
      describePath: (path) => (path[0] === "name" ? "nom du jeu" : "?"),
    });
    expect(result).toMatchObject({
      error:
        "Contenu invalide : « nom du jeu » incorrect. Rien n'a été importé.",
    });
  });

  it("drops __proto__, constructor and prototype keys at every depth", () => {
    const passthrough: StandardSchemaV1 = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: (value) => ({ value }),
      },
    };
    const result = parseUntrustedJson(
      '{"__proto__":{"polluted":true},"a":{"constructor":{"prototype":1},"b":2}}',
      passthrough,
    );
    expect(result).toEqual({ ok: true, data: { a: { b: 2 } } });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    const data = result.ok ? (result.data as object) : {};
    expect(Object.getPrototypeOf(data)).toBe(Object.prototype);
  });

  it("reads `{ key }` path segments", () => {
    const keyed: StandardSchemaV1 = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: () => ({
          issues: [{ message: "x", path: [{ key: "a" }, 0] }],
        }),
      },
    };
    expect(parseUntrustedJson("{}", keyed)).toMatchObject({ path: ["a", 0] });
  });

  it("throws on an asynchronous schema", () => {
    const asyncSchema: StandardSchemaV1 = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: (value) => Promise.resolve({ value }),
      },
    };
    expect(() => parseUntrustedJson("{}", asyncSchema)).toThrow(TypeError);
  });
});
