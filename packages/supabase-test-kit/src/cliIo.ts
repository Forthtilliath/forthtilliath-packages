/** Outcome of {@link CliIo.run}. */
export interface CommandResult {
  /** Exit code, or `null` when the process was killed by a signal. */
  status: number | null;
  /** Everything the command printed on stdout. */
  stdout: string;
}

/** Everything the CLIs touch outside themselves, replaced in tests. */
export interface CliIo {
  /** Runs a shell command, stderr going straight to the terminal. */
  run: (command: string, options?: { input?: string }) => CommandResult;
  /** Reads a UTF-8 text file. */
  readFile: (path: string) => string;
  /** Writes a text file, replacing it. */
  writeFile: (path: string, content: string) => void;
  /**
   * Renames a file (atomic replacement of the output once a command succeeded).
   */
  rename: (from: string, to: string) => void;
  /** Prints an information line. */
  log: (message: string) => void;
  /** Prints an error line. */
  error: (message: string) => void;
  /** Environment variables (`SUPABASE_CLI`, `SUPABASE_ACCESS_TOKEN`…). */
  env: Record<string, string | undefined>;
}

/**
 * Exit code of a failure: the command's own, or 1 if it had none (killed, or
 * 0).
 * @internal
 */
export const failureCode = ({ status }: CommandResult) =>
  status !== null && status !== 0 ? status : 1;

/**
 * The Supabase CLI command: `SUPABASE_CLI` (e.g. `supabase` in CI) or npx.
 * @internal
 */
export const supabaseCli = (io: CliIo) => io.env.SUPABASE_CLI ?? "npx supabase";
