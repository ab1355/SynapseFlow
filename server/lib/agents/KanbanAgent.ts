
// server/lib/agents/KanbanAgent.ts

import { ParsedInput, Task } from '../InputParser';

// --- INTERFACE DEFINITIONS ---

// Represents the user's current context for agent processing
export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL' | 'unknown';
}

// Represents a single column on the Kanban board
export interface KanbanColumn {
  name: string;
  wipLimit: number | null;
  purpose: string;
}

// Represents a single card on the Kanban board
export interface KanbanCard {
    id: string;
    content: string;
    column: string; // Name of the column
    tags: string[];
    estimatedSize: 'small' | 'medium' | 'large';
    blockedReason?: string;
}

// Represents the entire Kanban board structure
export interface KanbanBoard {
    columns: KanbanColumn[];
    cards: KanbanCard[];
}

// Represents key flow metrics for the board
export interface FlowMetrics {
    cycleTime: string; // e.g., "2 days"
    leadTime: string; // e.g., "5 days"
    wipCount: number;
    throughput: string; // e.g., "3 cards/week"
}

// Represents an actionable recommendation to improve flow
export interface FlowRecommendation {
    recommendation: string;
    rationale: string;
}

// The final response structure for the Kanban agent
export interface KanbanResponse {
  board: KanbanBoard;
  flowMetrics: FlowMetrics;
  recommendations: FlowRecommendation[];
}


// --- AGENT IMPLEMENTATION ---

export class KanbanAgent {
  static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<KanbanResponse> {
    const columns = this.createAdaptiveColumns(userContext);
    const cards = this.createCards(parsedInput, userContext, columns);
    const flow = this.analyzeFlow(cards, userContext);
    
    return {
      board: { columns, cards },
      flowMetrics: flow,
      recommendations: this.generateFlowRecommendations(flow, userContext)
    };
  }
  
  private static createAdaptiveColumns(userContext: UserContext): KanbanColumn[] {
    const baseColumns: KanbanColumn[] = [
      { name: 'Brain Dump', wipLimit: null, purpose: 'Capture without judgment' },
      { name: 'Ready (High Energy)', wipLimit: 2, purpose: 'Complex tasks requiring focus' },
      { name: 'Ready (Low Energy)', wipLimit: 5, purpose: 'Simple tasks for scattered days' },
      { name: 'In Progress', wipLimit: this.calculateWipLimit(userContext), purpose: 'Active work' },
      { name: 'Blocked', wipLimit: null, purpose: 'Waiting for dependencies' },
      { name: 'Done Today', wipLimit: null, purpose: 'Celebrate progress' }
    ];
    
    // Neurodivergent adaptations
    if (userContext.cognitiveType === 'ADHD') {
      baseColumns.push({ 
        name: 'Hyperfocus Queue', 
        wipLimit: 1, 
        purpose: 'For deep work sessions' 
      });
    }
    
    if (userContext.cognitiveType === 'ASD') {
      baseColumns.push({ 
        name: 'Routine Tasks', 
        wipLimit: 3, 
        purpose: 'Predictable, structured work' 
      });
    }
    
    return baseColumns;
  }
  
  private static calculateWipLimit(userContext: UserContext): number {
    const baseLimits = {
      'ADHD': 2,
      'ASD': 1,    
      'MIXED': 2,
      'NEUROTYPICAL': 3,
      'unknown': 2
    };
    
    let limit = baseLimits[userContext.cognitiveType || 'unknown'] || 2;
    
    if (userContext.energyState === 'Scattered') limit = 1;
    if (userContext.energyState === 'Hyperfocus') limit = 1;
    if (userContext.energyState === 'High') limit += 1;
    
    return Math.max(1, Math.min(limit, 5));
  }

  private static createCards(parsedInput: ParsedInput, userContext: UserContext, columns: KanbanColumn[]): KanbanCard[] {
    const allItems = [...parsedInput.tasks, ...parsedInput.ideas];
    return allItems.map((item, index) => {
        const isComplex = item.content.length > 80;
        let initialColumn = 'Brain Dump';

        if(userContext.energyState === 'High' && !isComplex) initialColumn = 'Ready (High Energy)';
        if(userContext.energyState === 'Low') initialColumn = 'Ready (Low Energy)';
        if(userContext.energyState === 'Hyperfocus' && index === 0) initialColumn = 'Hyperfocus Queue';

        return {
            id: `CARD-${Date.now()}-${index}`,
            content: item.content,
            column: initialColumn,
            tags: [userContext.energyState.toLowerCase()],
            estimatedSize: isComplex ? 'large' : 'small'
        }
    });
  }

  private static analyzeFlow(cards: KanbanCard[], userContext: UserContext): FlowMetrics {
    // Mock analysis
    const wipCount = cards.filter(c => c.column === 'In Progress').length;
    return {
        cycleTime: "1.5 days (avg)",
        leadTime: "3 days (avg)",
        wipCount: wipCount,
        throughput: "4 cards/week (avg)"
    };
  }

  private static generateFlowRecommendations(flow: FlowMetrics, userContext: UserContext): FlowRecommendation[] {
    const recommendations: FlowRecommendation[] = [];

    if (flow.wipCount > (this.calculateWipLimit(userContext) + 1)) {
        recommendations.push({
            recommendation: "WIP limit exceeded",
            rationale: `You have ${flow.wipCount} items in progress. Consider moving one back to 'Ready' to improve focus, especially in a ${userContext.energyState} state.`
        });
    }

    if (userContext.energyState === 'Scattered' && flow.wipCount > 1) {
        recommendations.push({
            recommendation: "Focus on a single task",
            rationale: "Your energy is scattered. Focusing on one 'In Progress' item can help build momentum without feeling overwhelmed."
        });
    }

    recommendations.push({
        recommendation: "Review your 'Done Today' column",
        rationale: "At the end of the day, look at what you accomplished. This is a great way to acknowledge your progress and build motivation."
    });

    return recommendations;
  }
}
