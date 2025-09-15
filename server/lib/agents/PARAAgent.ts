
// server/lib/agents/PARAAgent.ts

import { ParsedInput, UserContext } from "../AgentFactory";

// --- INTERFACE DEFINITIONS ---

// P.A.R.A. Categories: Projects, Areas, Resources, Archives
type PARACategory = 'Project' | 'Area' | 'Resource' | 'Archive';

export interface PARAItem {
    title: string;
    category: PARACategory;
}

export interface PARAResponse {
    // A summary classification of the overall input.
    classification: string;
    items: PARAItem[];
}

// --- AGENT IMPLEMENTATION ---

export class PARAAgent {

    /**
     * Classifies the parsed input according to the P.A.R.A. method.
     * - Projects: Tasks with a clear goal.
     * - Areas: Responsibilities or standards to maintain (often from concerns).
     * - Resources: Topics of interest (often from ideas).
     * - Archives: Not implemented in this version, as it requires historical context.
     */
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<PARAResponse> {
        const items: PARAItem[] = [];

        // 1. Classify explicit projects from the parser
        for (const project of parsedInput.projects) {
            items.push({ title: project, category: 'Project' });
        }

        // 2. Classify individual tasks
        for (const task of parsedInput.tasks) {
            // A simple heuristic: if a task sounds like a goal, it's a project.
            // Otherwise, it's related to an Area of responsibility.
            const category = this.isGoalOriented(task.content) ? 'Project' : 'Area';
            items.push({ title: task.content, category });
        }

        // 3. Classify ideas as resources
        for (const idea of parsedInput.ideas) {
            items.push({ title: idea.content, category: 'Resource' });
        }

        // 4. Classify concerns as related to areas of responsibility
        for (const concern of parsedInput.concerns) {
            items.push({ title: concern.content, category: 'Area' });
        }

        const overallClassification = this.determineOverallClassification(items);

        return { 
            classification: overallClassification,
            items 
        };
    }

    /**
     * A simple heuristic to determine if a task is goal-oriented (Project) or maintenance-oriented (Area).
     */
    private static isGoalOriented(content: string): boolean {
        const projectKeywords = ['build', 'create', 'implement', 'design', 'develop', 'launch', 'release', 'fix'];
        return projectKeywords.some(keyword => content.toLowerCase().startsWith(keyword));
    }

    /**
     * Determines a high-level classification for the entire input based on the categorized items.
     */
    private static determineOverallClassification(items: PARAItem[]): string {
        const counts = {
            Project: 0,
            Area: 0,
            Resource: 0,
            Archive: 0
        };

        for (const item of items) {
            counts[item.category]++;
        }

        if (counts.Project > counts.Area + counts.Resource) {
            return 'Project-Focused';
        } else if (counts.Area > counts.Project) {
            return 'Area of Responsibility';
        } else if (counts.Resource > 0) {
            return 'Resource Collection';
        } else {
            return 'General';
        }
    }
}
