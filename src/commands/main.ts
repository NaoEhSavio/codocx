// src/commands/main.ts

import path from "path";
import { Command } from "commander";
import { log } from "@clack/prompts";

import { getTree } from "../helpers/getTree.ts";
import { generateIntroduction } from "./actions/generateIntroduction.ts";
import { generateDocs } from "./actions/generateDocs.ts";
import { configApiKeyEnv } from "../helpers/validateApiKeyEnv.ts";
import { translateMarkdownFiles } from "../helpers/translateMarkdownFiles.ts";

interface CommandOptions {
    path?: string;
    translate?: string;
}

export async function main(options: CommandOptions, command: Command) {
    await configApiKeyEnv();

    const targetPath = options.path || process.cwd();

    log.info(`Target path: ${targetPath}`);

    const { flattedTree } = await getTree(targetPath);

    if (options.translate) {
      log.info(`Translation requested to: ${options.translate}`);
      await translateMarkdownFiles(flattedTree, options.translate);
    } else {
      log.info("No translation requested");
      await generateIntroduction(flattedTree);
      await generateDocs(flattedTree);
    }
}