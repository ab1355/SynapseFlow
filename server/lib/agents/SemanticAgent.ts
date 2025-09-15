
// server/lib/agents/SemanticAgent.ts

/**
 * The SemanticAgent uses vector embeddings to find contextually similar tasks
 * from the user's history, forming the foundation for intelligent framework recommendations.
 */

import { UserContext } from "../AgentFactory";
import { createEmbedding, findSimilarTasks, SimilarTask } from "../embedding";

// --- INTERFACE DEFINITIONS ---

export interface SemanticResponse {
    // A list of past tasks that are semantically similar to the current input.
    similarPastTasks: SimilarTask[];
    
    // The recommended framework(s) based on analysis of past successful patterns.
    // This is a placeholder for the full implementation in later phases.
    recommendedFrameworks: string[];

    // A message explaining why these recommendations were made.
    recommendationReasoning: string;
}

// --- AGENT IMPLEMENTATION ---

export class SemanticAgent {

    /**
     * Processes the user's input to find similar past tasks and recommend a workflow.
     * 
     * @param rawInput The raw text from the user's brain dump.
     * @param userContext The user's current context, including their ID.
     * @returns A SemanticResponse containing similar tasks and framework recommendations.
     */
    static async process(rawInput: string, userContext: UserContext): Promise<SemanticResponse> {
        // 1. Create a vector embedding for the current input.
        const currentEmbedding = await createEmbedding(rawInput);

        // 2. Find similar tasks from the user's history using vector search.
        const similarTasks = await findSimilarTasks(currentEmbedding, userContext.userId);

        // 3. (Placeholder) Analyze the patterns in similar tasks to recommend a framework.
        // In a future phase, this logic will be much more sophisticated. It will look at which
        // frameworks (GTD, Agile, etc.) were used for these similar tasks and how successful
        // they were, based on data from the `framework_pattern_embeddings` table.
        const { recommendedFrameworks, reasoning } = this.recommendFrameworkFromHistory(similarTasks);

        return {
            similarPastTasks: similarTasks,
            recommendedFrameworks: recommendedFrameworks,
            recommendationReasoning: reasoning,
        };
    }

    /**
     * (Mock Implementation) Analyzes the history of similar tasks to suggest a framework.
     *
     * This is a placeholder. The real implementation will query the `framework_pattern_embeddings` table.
     * For now, it uses a simple heuristic: if it sees a keyword, it suggests a framework.
     */
    private static recommendFrameworkFromHistory(similarTasks: SimilarTask[]): { recommendedFrameworks: string[], reasoning: string } {
        if (similarTasks.length === 0) {
            return {
                recommendedFrameworks: ['GTD', 'Kanban'], // Default recommendation
                reasoning: "No similar tasks found in your history. Starting with a basic GTD or Kanban setup is a good general approach."
            };
        }

        const frameworkMentions: { [key: string]: number } = {
            'Agile': 0,
            'Kanban': 0,
            'GTD': 0,
            'PARA': 0
        };

        // A very simple heuristic to simulate pattern analysis.
        for (const task of similarTasks) {
            const content = task.task_content.toLowerCase();
            if (content.includes('sprint') || content.includes('story')) {
                frameworkMentions['Agile']++;
            }
            if (content.includes('board') || content.includes('column')) {
                frameworkMentions['Kanban']++;
            }
            if (content.includes('inbox') || content.includes('next action')) {
                frameworkMentions['GTD']++;
            }
        }

        // Find the most mentioned framework.
        const sortedFrameworks = Object.entries(frameworkMentions).sort((a, b) => b[1] - a[1]);
        
        const topFramework = sortedFrameworks[0][0];
        const confidence = sortedFrameworks[0][1];

        if (confidence > 0) {
            return {
                recommendedFrameworks: [topFramework],
                reasoning: `Based on similar past tasks, the ${topFramework} framework seems to be a good fit for this type of work.`
            };
        } else {
             return {
                recommendedFrameworks: ['GTD'], // Default if no keywords are found
                reasoning: "Your past similar tasks didn\'t strongly indicate a specific framework. GTD is a solid choice for clarification."
            };
        }
    }
}
