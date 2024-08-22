#! /usr/bin/env node
// src/index.ts


import { Command } from "commander";

import pkg from "../package.json" assert { type: "json" };
import { withErrorCatcher } from "./middlewares/errorCatcher.ts";
import { main } from "./commands/main.ts";

const program = new Command();

program
    .version(pkg.version, "-v, --version", "Display the current CLI version")
    .name("codocx")
    .option("-p, --path <path>", "Specify the target path")
    .option("-t, --translate <language>", "Translate Markdown files to the specified language")
    .action(withErrorCatcher(main));

program.parse(process.argv);