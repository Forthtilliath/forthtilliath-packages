import type { Mock } from "vitest";
import { vi } from "vitest";

import type { CliIo, CommandResult } from "./cliIo.js";

interface TestIo {
  io: CliIo & {
    run: Mock<CliIo["run"]>;
    readFile: Mock<CliIo["readFile"]>;
    writeFile: Mock<CliIo["writeFile"]>;
    rename: Mock<CliIo["rename"]>;
  };
  out: string[];
  err: string[];
}

/** A fake `CliIo` recording the console output. Test helper, not exported. */
export function createTestIo(
  result: CommandResult,
  files: Record<string, string> = {},
): TestIo {
  const out: string[] = [];
  const err: string[] = [];
  const io = {
    run: vi.fn<CliIo["run"]>(() => result),
    readFile: vi.fn<CliIo["readFile"]>((path) => {
      const content = files[path];
      if (content === undefined) throw new Error(`ENOENT: ${path}`);
      return content;
    }),
    writeFile: vi.fn<CliIo["writeFile"]>(),
    rename: vi.fn<CliIo["rename"]>(),
    log: (message: string) => {
      out.push(message);
    },
    error: (message: string) => {
      err.push(message);
    },
    env: {},
  };
  return { io, out, err };
}
