
// server/lib/agents/AkashAgent.ts

import { ParsedInput, UserContext } from "../AgentFactory";

// --- INTERFACE DEFINITIONS ---

export interface AkashResponse {
    // Contains the direct response from the Akash Chat API
    apiResponse: any;
}

// --- AGENT IMPLEMENTATION ---

export class AkashAgent {

    private static readonly AKASH_API_URL = "https://chatapi.akash.network/v1/chat/completions";
    // NOTE: You can find a list of models at https://chatapi.akash.network/v1/models
    private static readonly DEFAULT_MODEL = "mixtral-8x7b-instruct-v0.1";

    /**
     * Processes user input by sending it to the Akash Network's Chat API.
     * This agent leverages a decentralized network of GPUs for cost-effective
     * access to powerful open-source language models.
     *
     * It requires the `AKASH_API_KEY` environment variable to be set.
     */
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<AkashResponse> {
        const apiKey = process.env.AKASH_API_KEY;

        if (!apiKey) {
            console.error("AkashAgent: AKASH_API_KEY environment variable not set.");
            return { apiResponse: { error: "API key for Akash Network is not configured." } };
        }

        // Consolidate all text from the user's brain dump.
        const allContent = [...parsedInput.tasks, ...parsedInput.ideas, ...parsedInput.concerns]
            .map(item => item.content)
            .join('\n- ');

        if (!allContent.trim()) {
            return { apiResponse: { message: "No input to process." } };
        }

        const systemPrompt = `You are a helpful AI assistant. Analyze the following brain dump from a user and provide insights, summaries, or actionable next steps. The user's energy state is '${userContext.energyState}'. Consider this when making suggestions.`;
        const userPrompt = `- ${allContent}`;

        try {
            // Using global fetch, available in Node.js 18+
            const response = await fetch(this.AKASH_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: this.DEFAULT_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt,
                        },
                        {
                            role: 'user',
                            content: userPrompt,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`AkashAgent: API request failed with status ${response.status}: ${errorBody}`);
                return { apiResponse: { error: `API request failed with status ${response.status}`, details: errorBody } };
            }

            const data = await response.json();
            return { apiResponse: data };

        } catch (error) {
            console.error("AkashAgent: Error calling Akash API.", error);
            if (error instanceof Error) {
                return { apiResponse: { error: "Failed to fetch from Akash API.", details: error.message } };
            }
            return { apiResponse: { error: "An unknown error occurred while contacting the Akash API." } };
        }
    }
}
