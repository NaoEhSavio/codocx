// validateApiKeyEnv.ts
import dotenv from "dotenv";
import { isCancel, log, text, select } from "@clack/prompts";
import { config } from "dotenv";

import { apiKey } from "../utils/apiKey.ts";
import { API_KEY_REQUIRED } from "../constants/errors.ts";
import { cancel } from "../utils/prompt.ts";

type Provider = "openai" | "anthropic";

export async function configApiKeyEnv() {
    const provider = await select({
        message: "Which AI provider do you want to use?",
        options: [
            { value: "openai", label: "OpenAI" },
            { value: "anthropic", label: "Anthropic (Claude)" },
        ],
    }) as Provider | symbol;

    if (isCancel(provider)) return cancel();

    const selectedProvider = provider as Provider;

    // Load existing environment variables
    config({ path: "./.env.local" });

    const apiKeyValue = process.env[`${selectedProvider.toUpperCase()}_API_KEY`];

    if (!apiKeyValue) {
        log.warn(API_KEY_REQUIRED);

        const value = await text({
            message: `Enter your ${selectedProvider.toUpperCase()} API key:`,
            placeholder: selectedProvider === "openai" ? "sk-..." : "sk-ant-...",
        });

        if (isCancel(value)) return cancel();

        await apiKey.set(value, selectedProvider);

        // Reload environment variables after setting the new API key
        config({ path: "./.env.local", override: true });
    }

    // Set the selected provider in the environment
    process.env.SELECTED_AI_PROVIDER = selectedProvider;

    return selectedProvider;
}