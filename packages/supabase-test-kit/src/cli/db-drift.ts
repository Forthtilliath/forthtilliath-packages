#!/usr/bin/env node
import { runDrift } from "../drift.js";

import { nodeIo } from "./nodeIo.js";

process.exitCode = runDrift(process.argv.slice(2), nodeIo);
