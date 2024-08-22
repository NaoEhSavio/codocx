// apiKey.ts
import { promises as fs } from "fs";
import * as path from "path";
import { log } from "@clack/prompts";
import chalk from "chalk";

const envFilePath = path.resolve(process.cwd(), ".env.local");

async function set(apiKey: string, provider: "openai" | "anthropic") {
    try {
        const envVar = provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY";
        let envContent = await fs.readFile(envFilePath, "utf8").catch(() => "");
        
        // Remove existing key if present
        envContent = envContent.replace(new RegExp(`^${envVar}=.*$`, "m"), "");
        
        // Add new key
        envContent += `\n${envVar}=${apiKey}\n`;

        await fs.writeFile(envFilePath, envContent.trim());

        log.success(`${provider.toUpperCase()} API key saved in ${chalk.cyan(envFilePath)}`);
    } catch (err) {
        log.error(
            `Error saving ${provider.toUpperCase()} API key. Contact support if the problem persists.`
        );
    }
}

async function get(provider: "openai" | "anthropic"): Promise<string | null> {
    try {
        const data = await fs.readFile(envFilePath, "utf8");
        const envVar = provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY";

        const match = data.match(new RegExp(`^${envVar}=(.+)$`, "m"));
        if (match && match[1]) {
            return match[1].trim();
        } else {
            log.error(
                `${provider.toUpperCase()} API key not found in ${chalk.cyan(envFilePath)}.`
            );
            return null;
        }
    } catch (err) {
        return null;
    }
}

export const apiKey = {
    set,
    get,
};