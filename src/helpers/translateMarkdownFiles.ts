// src/helpers/translateMarkdownFiles.ts

import fs from "fs/promises";
import path from "path";
import { spinner, log } from "@clack/prompts";
import chalk from "chalk";

import { TreeItemFlatted } from "../types/index.ts";
import { getPromptResult } from "../utils/ai.ts";

export async function translateMarkdownFiles(flattedTree: TreeItemFlatted[], targetLanguage: string) {
    log.info(`Starting translation to ${targetLanguage}`);
    const loading = spinner();

    for (const item of flattedTree) {
        if (item.type === "file" && path.extname(item.path) === ".md") {
            loading.start(`Translating ${chalk.cyan(item.path)} to ${targetLanguage}`);

            try {
                const content = await fs.readFile(item.fullPath, "utf-8");
                const translatedContent = await translateMarkdown(content, targetLanguage);

                if (!translatedContent) {
                    log.error(`Failed to translate ${item.path}. Skipping.`);
                    continue;
                }

                const translatedFilePath = item.fullPath.replace(".md", `.${targetLanguage}.md`);
                await fs.writeFile(translatedFilePath, translatedContent);

                loading.stop(`Translated ${chalk.cyan(item.path)} to ${targetLanguage}`);
                log.success(`Saved translation to ${chalk.cyan(translatedFilePath)}`);
            } catch (error) {
                loading.stop(`Error translating ${chalk.cyan(item.path)}`);
                log.error(`Error details: ${error.message}`);
            }
        }
    }
    log.info(`Translation process completed`);
}

async function translateMarkdown(content: string, targetLanguage: string): Promise<string | null> {
    const prompt = `
        Translate the following Markdown content to ${targetLanguage}. 
        Preserve all Markdown formatting, code blocks, and links. 
        Only translate the text content.

        Original Markdown:
        ${content}

        Translated Markdown (${targetLanguage}):
    `;

    try {
        const { text } = await getPromptResult(prompt);
        if (!text) {
            log.error("Translation API returned empty result");
            return null;
        }
        return text;
    } catch (error) {
        log.error(`Error in translation API: ${error.message}`);
        return null;
    }
}