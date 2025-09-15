
// server/lib/agents/GTDAgent.ts

import { ParsedInput, UserContext } from "../AgentFactory";
import { SimilarTask } from "../embedding"; // Import SimilarTask

// --- INTERFACE DEFINITIONS ---

export type GTDContext = 'Inbox' | 'Next Action' | 'Waiting For' | 'Project' | 'Someday/Maybe';

export interface NextAction {
    id: string;
    content: string;
    context: GTDContext;
    priority: 'high' | 'medium' | 'low';
    isProject: boolean;
}

export interface GTDResponse {
    clarifiedTasks: number;
    nextActions: NextAction[];
}

// --- AGENT IMPLEMENTATION ---

export class GTDAgent {

    /**
     * This agent processes the user's input through the GTD framework,
     * now with added historical context to make smarter decisions.
     */
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<GTDResponse> {
        const nextActions: NextAction[] = [];
        let clarifiedTaskCount = 0;

        // Analyze historical context to find patterns.
        const historicalPatterns = this.analyzeHistory(userContext.historicalContext);

        for (const task of parsedInput.tasks) {
            clarifiedTaskCount++;
            
            // Use historical context to influence classification.
            const context = this.determineContext(task.content, historicalPatterns);
            const isProject = this.isProject(task.content);

            nextActions.push({
                id: `gtd-${clarifiedTaskCount}`,
                content: task.content,
                context: context,
                priority: this.assignPriority(task.content, userContext.energyState),
                isProject: isProject,
            });
        }

        return {
            clarifiedTasks: clarifiedTaskCount,
            nextActions: nextActions,
        };
    }

    /**
     * Analyzes past similar tasks to find recurring themes or contexts.
     * This is a simple heuristic-based implementation.
     */
    private static analyzeHistory(historicalContext?: SimilarTask[]): { somedayMaybeAffinity: number } {
        let somedayMaybeAffinity = 0;
        if (!historicalContext) return { somedayMaybeAffinity };

        const somedayKeywords = ['later', 'eventually', 'maybe', 'one day', 'someday'];
        let matchCount = 0;

        for (const task of historicalContext) {
            const content = task.task_content.toLowerCase();
            if (somedayKeywords.some(kw => content.includes(kw))) {
                matchCount++;
            }
        }

        // If a significant portion of similar past tasks were deferred, increase affinity for it.
        if (historicalContext.length > 0) {
            somedayMaybeAffinity = matchCount / historicalContext.length;
        }

        return { somedayMaybeAffinity };
    }

    /**
     * Determines the GTD context for a task, now influenced by historical patterns.
     */
    private static determineContext(content: string, historicalPatterns: { somedayMaybeAffinity: number }): GTDContext {
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('waiting for') || lowerContent.includes('waiting on')) {
            return 'Waiting For';
        }
        if (lowerContent.includes('project') || content.split(' ').length > 8) {
            return 'Project';
        }
        
        // If similar tasks in the past were often deferred, and this task is vague, lean towards Someday/Maybe.
        if ((lowerContent.includes('later') || lowerContent.includes('maybe')) && historicalPatterns.somedayMaybeAffinity > 0.3) {
            return 'Someday/Maybe';
        }
        if (this.isVague(lowerContent)) {
             return 'Inbox'; // Requires further clarification
        }
        
        return 'Next Action';
    }

    private static isProject(content: string): boolean {
        // A simple heuristic: if it contains multiple steps or is long, it's a project.
        return content.split(' ').length > 8 || content.toLowerCase().includes('plan for');
    }

    private static assignPriority(content: string, energy: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered'): 'high' | 'medium' | 'low' {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('urgent') || lowerContent.includes('asap')) {
            return 'high';
        }
        if (energy === 'High' || energy === 'Hyperfocus') {
            return 'high'; // Match high energy with high priority tasks
        }
        if (energy === 'Low') {
            return 'low'; // Match low energy with low priority tasks
        }
        return 'medium';
    }

    private static isVague(content: string): boolean {
        // If the task is short and lacks a clear verb, it might need clarification.
        return content.split(' ').length < 3 && !this.hasClearVerb(content);
    }

    private static hasClearVerb(content: string): boolean {
        const verbs = ['call', 'email', 'buy', 'read', 'write', 'organize', 'review', 'schedule', 'complete'];
        return verbs.some(verb => content.toLowerCase().startsWith(verb));
    }
}
