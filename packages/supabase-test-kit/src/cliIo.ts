export interface CommandResult {
  status: number | null;
  stdout: string;
}

/** Everything the CLIs touch outside themselves, replaced in tests. */
export interface CliIo {
  /** Runs a shell command, stderr going straight to the terminal. */
  run: (command: string, options?: { input?: string }) => CommandResult;
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
  rename: (from: string, to: string) => void;
  log: (message: string) => void;
  error: (message: string) => void;
  env: Record<string, string | undefined>;
}

/** Exit code of a failure: the command's own, or 1 if it had none (killed, or 0). */
export const failureCode = ({ status }: CommandResult) =>
  status !== null && status !== 0 ? status : 1;

/** The Supabase CLI command: `SUPABASE_CLI` (e.g. `supabase` in CI) or npx. */
export const supabaseCli = (io: CliIo) => io.env.SUPABASE_CLI ?? "npx supabase";
