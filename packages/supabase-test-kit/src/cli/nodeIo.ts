import { spawnSync } from "node:child_process";
import { readFileSync, renameSync, writeFileSync } from "node:fs";

import type { CliIo } from "../cliIo.js";

export const nodeIo: CliIo = {
  run: (command, { input } = {}) => {
    const result = spawnSync(command, {
      shell: true,
      encoding: "utf8",
      input,
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "inherit"],
      maxBuffer: 50 * 1024 * 1024,
    });
    return { status: result.status, stdout: result.stdout };
  },
  readFile: (path) => readFileSync(path, "utf8"),
  writeFile: (path, content) => {
    writeFileSync(path, content);
  },
  rename: renameSync,
  log: (message) => {
    console.log(message);
  },
  error: (message) => {
    console.error(message);
  },
  env: process.env,
};
