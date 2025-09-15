
// server/lib/agents/CustomAgent.ts

import { ParsedInput, UserContext } from "../AgentFactory";

// --- INTERFACE DEFINITIONS ---

// A custom category, which could be a specific project name, a team, or any other user-defined context.
export type CustomCategory = 'Urgent' | 'Personal' | 'Work' | 'Follow-up' | 'Later';

export interface CustomItem {
    title: string;
    category: CustomCategory;
    // Confidence that this is the correct custom category.
    confidence: number; 
}

export interface CustomResponse {
    items: CustomItem[];
}

// --- AGENT IMPLEMENTATION ---

// Define keywords for each custom category. This is where a user could eventually
// customize the agent's behavior.
const CATEGORY_KEYWORDS: { [key in CustomCategory]: string[] } = {
    'Urgent': ['urgent', 'asap', 'immediately', 'critical', 'blocker'],
    'Personal': ['personal', 'family', 'home', 'health', 'self'],
    'Work': ['work', 'team', 'project', 'client', 'meeting'],
    'Follow-up': ['follow-up', 'check in', 'ping', 'remind'],
    'Later': ['later', 'someday', 'maybe', 'eventually']
};

export class CustomAgent {

    /**
     * This agent provides a flexible, keyword-based categorization that can be
     * tailored to specific user workflows. It's a placeholder for a more advanced,
     * user-configurable system in the future.
     */
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<CustomResponse> {
        const allContent = [...parsedInput.tasks, ...parsedInput.ideas, ...parsedInput.concerns];
        const items: CustomItem[] = [];

        for (const item of allContent) {
            const { category, confidence } = this.findBestCategory(item.content);
            if (category) {
                items.push({ title: item.content, category, confidence });
            }
        }

        return { items };
    }

    /**
     * Finds the most likely custom category for a piece of content based on keywords.
     */
    private static findBestCategory(content: string): { category: CustomCategory | null, confidence: number } {
        let bestCategory: CustomCategory | null = null;
        let maxScore = 0;

        for (const category in CATEGORY_KEYWORDS) {
            const keywords = CATEGORY_KEYWORDS[category as CustomCategory];
            const score = keywords.reduce((count, keyword) => {
                return content.toLowerCase().includes(keyword) ? count + 1 : count;
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                bestCategory = category as CustomCategory;
            }
        }

        if (bestCategory) {
            // A simple confidence score based on the number of keyword matches.
            const confidence = Math.min(1, maxScore / 3); // Capped at 1, requires 3 matches for full confidence.
            return { category: bestCategory, confidence };
        } else {
            return { category: null, confidence: 0 };
        }
    }
}
