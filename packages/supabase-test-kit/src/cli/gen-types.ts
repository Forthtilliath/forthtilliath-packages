#!/usr/bin/env node
import { runGenTypes } from "../genTypes.js";

import { nodeIo } from "./nodeIo.js";

process.exitCode = runGenTypes(process.argv.slice(2), nodeIo);
