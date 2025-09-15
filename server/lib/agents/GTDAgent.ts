
// server/lib/agents/GTDAgent.ts

import { ParsedInput, Task, Idea, Concern, Project } from './InputParser';

// --- INTERFACE DEFINITIONS ---

export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'adhd' | 'autism' | 'combined' | 'neurotypical' | 'unknown';
}

// Phase 1: Capture
export interface CapturedItem {
    id: string;
    source: 'task' | 'idea' | 'concern' | 'project';
    content: string;
    processed: boolean;
}

// Phase 2: Clarify
export interface ClarifiedItem extends CapturedItem {
    isActionable: boolean;
    outcomeDesired: string | null;
    nextAction: NextAction | null;
    projectId: string | null;
}

// Phase 3: Organize
export interface NextAction {
    id: string;
    title: string;
    context: string;
    isSingleStep: boolean;
}

export interface GTDProject {
    id: string;
    name: string;
    outcome: string;
    nextActions: NextAction[];
}

export interface WaitingForItem {
    id: string;
    title: string;
    waitingFor: string;
}

export interface SomedayMaybeItem {
    id: string;
    title: string;
}

export interface OrganizedItems {
    nextActions: NextAction[];
    projects: GTDProject[];
    waitingFor: WaitingForItem[];
    somedayMaybe: SomedayMaybeItem[];
}

// Phase 4: Reflect
export interface GTDContext {
    name: string;
    energyRequired: 'high' | 'medium' | 'low' | 'variable' | 'any';
    description: string;
}

export interface WeeklyReviewItem {
    id: string;
    prompt: string;
    isCompleted: boolean;
}

// Final Agent Response
export interface GTDResponse {
  inbox: CapturedItem[];
  nextActions: NextAction[];
  projects: GTDProject[];
  waitingFor: WaitingForItem[];
  somedayMaybe: SomedayMaybeItem[];
  contexts: GTDContext[];
  weeklyReview: WeeklyReviewItem[];
}


// --- AGENT IMPLEMENTATION ---

export class GTDAgent {
  static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<GTDResponse> {
    // GTD's 5 phases: Capture, Clarify, Organize, Reflect, Engage (Engage is user-driven)
    const captured = this.captureEverything(parsedInput);
    const clarified = this.clarifyItems(captured);
    const organized = this.organizeByContext(clarified, userContext);
    
    return {
      inbox: captured.filter(item => !item.processed), // Items that failed clarification
      nextActions: organized.nextActions,
      projects: organized.projects,
      waitingFor: organized.waitingFor,
      somedayMaybe: organized.somedayMaybe,
      contexts: this.generateContexts(userContext), // Contexts are independent of items for this mock
      weeklyReview: this.generateReviewItems(organized)
    };
  }

  private static captureEverything(parsedInput: ParsedInput): CapturedItem[] {
      const allItems = [
          ...parsedInput.tasks.map(i => ({...i, source: 'task' as const})),
          ...parsedInput.ideas.map(i => ({...i, source: 'idea' as const})),
          ...parsedInput.concerns.map(i => ({...i, source: 'concern' as const})),
          ...parsedInput.projects.map(i => ({...i, source: 'project' as const})),
      ];

      return allItems.map((item, index) => ({
          id: `CAP-${Date.now()}-${index}`,
          content: item.content,
          source: item.source,
          processed: false, // Initially unprocessed
      }));
  }
  
  private static clarifyItems(items: CapturedItem[]): ClarifiedItem[] {
    return items.map(item => {
      const isActionable = this.isActionable(item);
      let projectId: string | null = null;
      let nextAction: NextAction | null = null;

      if (isActionable) {
        if (this.isMultiStep(item)) {
          // It's a project
          projectId = `PROJ-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
          nextAction = this.identifyNextAction(item, projectId);
        } else {
          // It's a single next action
          nextAction = this.createNextAction(item);
        }
      }
      
      return {
        ...item,
        processed: true,
        isActionable,
        outcomeDesired: isActionable ? this.extractOutcome(item) : null,
        nextAction,
        projectId,
      };
    });
  }

  private static organizeByContext(clarifiedItems: ClarifiedItem[], userContext: UserContext): OrganizedItems {
      const organized: OrganizedItems = {
          nextActions: [],
          projects: [],
          waitingFor: [],
          somedayMaybe: []
      };

      const projectMap = new Map<string, GTDProject>();

      for (const item of clarifiedItems) {
          if (item.nextAction) {
              organized.nextActions.push(item.nextAction);
          }
          if (item.projectId) {
              if (!projectMap.has(item.projectId)) {
                  projectMap.set(item.projectId, {
                      id: item.projectId,
                      name: `Project: ${item.content.substring(0, 40)}...`,
                      outcome: item.outcomeDesired || "Achieve defined goals",
                      nextActions: [],
                  });
              }
              if (item.nextAction) {
                projectMap.get(item.projectId)!.nextActions.push(item.nextAction);
              }
          } else if (!item.isActionable) {
              organized.somedayMaybe.push({ id: `SM-${item.id}`, title: item.content });
          }
      }
      organized.projects = Array.from(projectMap.values());
      return organized;
  }
  
  private static generateContexts(userContext: UserContext): GTDContext[] {
    const contexts: GTDContext[] = [
      { name: '@computer', energyRequired: 'medium', description: 'Tasks requiring computer' },
      { name: '@phone', energyRequired: 'medium', description: 'Calls and conversations' },
      { name: '@errands', energyRequired: 'low', description: 'Out and about tasks' },
      { name: '@home', energyRequired: 'variable', description: 'Home-based activities' },
    ];
    
    if (userContext.cognitiveType === 'adhd') {
      contexts.push(
        { name: '@hyperfocus', energyRequired: 'high', description: 'Deep work requiring intense focus' },
        { name: '@dopamine', energyRequired: 'any', description: 'Quick wins for motivation' }
      );
    }
    return contexts;
  }

  private static generateReviewItems(organized: OrganizedItems): WeeklyReviewItem[] {
      return [
          {id: 'review-1', prompt: "Review all outstanding inbox items.", isCompleted: false},
          {id: 'review-2', prompt: `Review your ${organized.projects.length} active projects.`, isCompleted: false},
          {id: 'review-3', prompt: `Review your ${organized.nextActions.length} next actions.`, isCompleted: false},
          {id: 'review-4', prompt: "Review your 'Waiting For' list.", isCompleted: false},
          {id: 'review-5', prompt: "Review your 'Someday/Maybe' list.", isCompleted: false},
          {id: 'review-6', prompt: "Get creative, courageous, and clear-minded.", isCompleted: false},
      ];
  }

  // --- Helper Methods (Mocks) ---

  private static isActionable(item: CapturedItem): boolean {
    const nonActionableKeywords = ['idea', 'concern', 'maybe', 'think about', 'someday'];
    if (item.source === 'idea' || item.source === 'concern') return false;
    return !nonActionableKeywords.some(k => item.content.toLowerCase().includes(k));
  }

  private static extractOutcome(item: CapturedItem): string {
      return `Successfully complete: ${item.content.substring(0, 50)}...`;
  }

  private static isMultiStep(item: CapturedItem): boolean {
      return item.source === 'project' || item.content.length > 100;
  }

  private static identifyNextAction(item: CapturedItem, projectId: string): NextAction {
      return {
          id: `NA-${item.id}`,
          title: `First step for: ${item.content.substring(0, 30)}...`,
          context: '@computer', // default context
          isSingleStep: false,
      };
  }

  private static createNextAction(item: CapturedItem): NextAction {
      return {
          id: `NA-${item.id}`,
          title: item.content,
          context: '@computer',
          isSingleStep: true,
      };
  }
}
