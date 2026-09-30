import { fileURLToPath } from "node:url";

// `sql/` sits next to `dist/`, one level above this module once built
/** Absolute path of the schema fingerprint query shipped with the package. */
export const SCHEMA_CATALOG_SQL_PATH = fileURLToPath(
  new URL("../sql/schema-catalog.sql", import.meta.url),
);
