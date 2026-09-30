import { parseArgs } from "node:util";

import type { CliIo } from "./cliIo.js";
import { failureCode, supabaseCli } from "./cliIo.js";

export const DEFAULT_TYPES_OUTPUT = "src/types/database.ts";

const USAGE = `Usage: supabase-gen-types (--project-id <id> | --local) [--output <path>] [--schema <schemas>]

Regenerates the database types (default output: ${DEFAULT_TYPES_OUTPUT},
schema: public). The file is only replaced when the generation succeeds.`;

/**
 * `supabase-gen-types`: runs `supabase gen types typescript` and replaces the
 * output file only on success — a shell redirection (`> database.ts`) empties
 * it as soon as the command starts, even when it then fails (access denied,
 * network…).
 *
 * @param argv - The command line arguments.
 * @param io - Process, file system and console access.
 * @returns The exit code: 0 on success, 1 on failure, 2 on usage error.
 */
export function runGenTypes(argv: string[], io: CliIo): number {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        local: { type: "boolean", default: false },
        "project-id": { type: "string" },
        output: { type: "string", default: DEFAULT_TYPES_OUTPUT },
        schema: { type: "string", default: "public" },
      },
    }));
  } catch (error) {
    io.error(`${(error as Error).message}\n\n${USAGE}`);
    return 2;
  }
  const projectId = values["project-id"];
  if (!values.local && !projectId) {
    io.error(USAGE);
    return 2;
  }

  const source = values.local ? "--local" : `--project-id ${projectId}`;
  const result = io.run(
    `${supabaseCli(io)} gen types typescript ${source} --schema ${values.schema}`,
    // Confirms the CLI install npx may ask for
    { input: "y\n" },
  );

  if (result.status !== 0 || !result.stdout.includes("export type Database")) {
    io.error(`\nGeneration failed: ${values.output} was left untouched.`);
    if (!values.local) {
      io.error(
        "Access denied? Check the signed-in account (`npx supabase projects list`), " +
          "or generate from the local database with --local.",
      );
    }
    return failureCode(result);
  }

  const temp = `${values.output}.tmp`;
  io.writeFile(temp, result.stdout);
  io.rename(temp, values.output);
  io.log(`${values.output} regenerated (${source}).`);
  return 0;
}
