import type {
  StandardSchemaIssue,
  StandardSchemaPathSegment,
  StandardSchemaV1,
} from "./standardSchema.js";

/** Why {@link parseUntrustedJson} refused a text. */
export type UntrustedJsonFailure =
  "empty" | "too-long" | "malformed" | "invalid";

export type UntrustedJsonResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      reason: UntrustedJsonFailure;
      /** A message ready to show the user (French by default). */
      error: string;
      /** First schema issue's path, keys as given (`["players", 2, "name"]`). */
      path?: PropertyKey[];
      /** Every issue the schema reported (`reason: "invalid"` only). */
      issues?: readonly StandardSchemaIssue[];
      /**
       * The parsed but **unvalidated** value (`reason: "invalid"` only) — e.g.
       * to read a `version` field and say "update the app". Never use it as data.
       */
      raw?: unknown;
    };

export interface UntrustedJsonMessages {
  empty: string;
  tooLong: string;
  malformed: string;
  /** `where` is the described path, `""` for the root value. */
  invalid: (where: string) => string;
}

export interface ParseUntrustedJsonOptions {
  /**
   * Longest text accepted, in characters, checked **before** `JSON.parse`: a
   * huge file is refused without being parsed. Set it a little above the
   * largest legitimate content.
   *
   * @defaultValue 1_000_000
   */
  maxLength?: number;
  /** Language of the default messages. @defaultValue "fr" */
  locale?: "fr" | "en";
  /** Overrides some or all of the messages. */
  messages?: Partial<UntrustedJsonMessages>;
  /**
   * Turns an issue path into words for `messages.invalid`, e.g. with a map of
   * field names. Default: keys joined with " › ", indexes counted from 1.
   */
  describePath?: (path: PropertyKey[]) => string;
}

const DEFAULT_MAX_LENGTH = 1_000_000;

const MESSAGES: Record<"fr" | "en", UntrustedJsonMessages> = {
  fr: {
    empty: "Le contenu est vide.",
    tooLong: "Le contenu est trop volumineux. Rien n'a été importé.",
    malformed:
      "Le contenu est illisible (JSON invalide). Rien n'a été importé.",
    invalid: (where) =>
      where
        ? `Contenu invalide : « ${where} » incorrect. Rien n'a été importé.`
        : "Contenu invalide. Rien n'a été importé.",
  },
  en: {
    empty: "The content is empty.",
    tooLong: "The content is too large. Nothing was imported.",
    malformed:
      "The content can't be read (invalid JSON). Nothing was imported.",
    invalid: (where) =>
      where
        ? `Invalid content: "${where}" is incorrect. Nothing was imported.`
        : "Invalid content. Nothing was imported.",
  },
};

// Own properties with these names are harmless after JSON.parse, but turn
// into prototype changes once merged with `Object.assign` or a deep-merge
// helper: dropped while parsing, whatever the schema does next.
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function stripForbiddenKeys(key: string, value: unknown): unknown {
  return FORBIDDEN_KEYS.has(key) ? undefined : value;
}

function toKey(segment: StandardSchemaPathSegment): PropertyKey {
  return typeof segment === "object" ? segment.key : segment;
}

function defaultDescribePath(locale: "fr" | "en") {
  return (path: PropertyKey[]): string =>
    path
      .map((key) =>
        typeof key === "number"
          ? locale === "fr"
            ? `n° ${key + 1}`
            : `#${key + 1}`
          : String(key),
      )
      .join(" › ");
}

/**
 * Reads JSON that came from outside the app (an imported file, pasted text, a
 * QR code…) and validates it with a schema, all or nothing: the first problem
 * rejects the whole text, so nothing is ever half-imported.
 *
 * In order: empty text → too long (before parsing, so a huge file costs
 * nothing) → malformed JSON → `__proto__` / `constructor` / `prototype` keys
 * dropped → schema. With zod, unknown keys are also stripped by `z.object`
 * (use bounded types: `.max()` on strings and arrays, `.int().min().max()` on
 * numbers, enums). Synchronous schemas only.
 *
 * @param text - The untrusted text.
 * @param schema - Any Standard Schema (zod, Valibot, ArkType…).
 * @param options - See {@link ParseUntrustedJsonOptions}.
 * @returns `{ ok: true, data }`, or `{ ok: false, reason, error, … }` with a
 * message ready to show.
 * @example
 * const result = parseUntrustedJson(text, backupSchema, { maxLength: 200_000 });
 * if (!result.ok) return Alert.alert("Import impossible", result.error);
 * restore(result.data);
 */
export function parseUntrustedJson<T>(
  text: string,
  schema: StandardSchemaV1<T>,
  options: ParseUntrustedJsonOptions = {},
): UntrustedJsonResult<T> {
  const {
    maxLength = DEFAULT_MAX_LENGTH,
    locale = "fr",
    describePath = defaultDescribePath(locale),
  } = options;
  const messages = { ...MESSAGES[locale], ...options.messages };

  if (text.length > maxLength) {
    return { ok: false, reason: "too-long", error: messages.tooLong };
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, reason: "empty", error: messages.empty };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(trimmed, stripForbiddenKeys);
  } catch {
    return { ok: false, reason: "malformed", error: messages.malformed };
  }

  const result = schema["~standard"].validate(raw);
  if (result instanceof Promise) {
    throw new TypeError(
      "parseUntrustedJson only supports synchronous schemas (no async refinements).",
    );
  }
  if (result.issues) {
    const path = (result.issues[0]?.path ?? []).map(toKey);
    return {
      ok: false,
      reason: "invalid",
      error: messages.invalid(describePath(path)),
      path,
      issues: result.issues,
      raw,
    };
  }
  return { ok: true, data: result.value };
}
