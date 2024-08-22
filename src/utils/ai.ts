// ai.ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "../constants/index.ts";

type AIModel = "gpt-4o-mini" | "claude-3-5-sonnet-20240620";

export function createPromptAbility(system: string, model: AIModel = "gpt-4o-mini") {
    async function getResult(prompt: string) {
        const selectedProvider = process.env.SELECTED_AI_PROVIDER as "openai" | "anthropic";

        if (selectedProvider === "anthropic") {
            const result = await generateText({
                model: anthropic("claude-3-5-sonnet-20240620"),
                system,
                prompt,
            });
            return result;
        } else {
            const result = await generateText({
                model: openai(model),
                system,
                prompt,
            });
            return result;
        }
    }

    return { getResult };
}

export async function getPromptResult(prompt: string, model: AIModel = "gpt-4o-mini") {
    const selectedProvider = process.env.SELECTED_AI_PROVIDER as "openai" | "anthropic";

    if (selectedProvider === "anthropic") {
        const result = await generateText({
            model: anthropic("claude-3-5-sonnet-20240620"),
            system: SYSTEM_PROMPT,
            prompt,
        });
        return result;
    } else {
        const result = await generateText({
            model: openai(model),
            system: SYSTEM_PROMPT,
            prompt,
        });
        return result;
    }
}