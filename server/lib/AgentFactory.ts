
// server/lib/AgentFactory.ts

import { performance } from 'perf_hooks';
import { InputParser, ParsedInput } from './InputParser';
import { AgileAgent, AgileResponse } from './agents/AgileAgent';
import { KanbanAgent, KanbanResponse } from './agents/KanbanAgent';
import { GTDAgent, GTDResponse } from './agents/GTDAgent';
import { ProgressOrchestrator, OrchestrationResult, AllFrameworkResponses } from './ProgressOrchestrator';

// --- INTERFACE DEFINITIONS ---

// Re-defining UserContext here to be the single source of truth for the factory.
export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'adhd' | 'autism' | 'combined' | 'neurotypical' | 'unknown';
  // history could be added for more advanced agents
}

// Mock interfaces for agents that are not yet implemented.
export interface PARAResponse {
    classification: string;
    items: { title: string; category: string}[];
}

export interface CustomResponse {
    neuroAdvice: string;
    momentumTriggers: string[];
}

// The final, combined response from all framework agents.
export interface FrameworkResponses {
    agile: AgileResponse;
    kanban: KanbanResponse;
    gtd: GTDResponse;
    para: PARAResponse;
    custom: CustomResponse;
}

// The top-level response structure for the entire operation.
export interface MultiFrameworkResponse {
    frameworks: FrameworkResponses;
    orchestration: OrchestrationResult;
    metadata: {
        processingTimeMs: number;
        inputComplexity: 'low' | 'medium' | 'high';
        confidenceScore: number;
    };
}

// --- MOCK AGENT IMPLEMENTATIONS ---
// These stand in for PARAAgent.ts and CustomAgent.ts until they are created.

class PARAAgent {
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<PARAResponse> {
        // Mock logic
        return {
            classification: "Project",
            items: parsedInput.tasks.map(t => ({ title: t.content, category: 'General' }))
        };
    }
}

class CustomAgent {
    static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<CustomResponse> {
        // Mock logic
        const advice = userContext.energyState === 'Low' ? "Be kind to yourself and start with a small, easy win." : "Your energy is high! Tackle a challenging task.";
        return {
            neuroAdvice: advice,
            momentumTriggers: ["Listen to your favorite focus playlist.", "Take a 5-minute break after this task."]
        };
    }
}


// --- AGENT FACTORY IMPLEMENTATION ---

export class AgentFactory {
  static async processInput(input: string, userContext: UserContext): Promise<MultiFrameworkResponse> {
    const startTime = performance.now();
    
    // 1. Parse and understand the user's input deterministically.
    const parsedInput = InputParser.analyze(input);
    
    // 2. Process the structured input through all specialized agents in parallel.
    const [agileResult, kanbanResult, gtdResult, paraResult, customResult] = await Promise.all([
      AgileAgent.process(parsedInput, userContext),
      KanbanAgent.process(parsedInput, userContext), 
      GTDAgent.process(parsedInput, userContext),
      PARAAgent.process(parsedInput, userContext), // Using mock agent
      CustomAgent.process(parsedInput, userContext)  // Using mock agent
    ]);
    
    // 3. Analyze the combined outputs to find cross-framework momentum opportunities.
    const allResponses: AllFrameworkResponses = { agileResult, kanbanResult, gtdResult };
    const orchestration = ProgressOrchestrator.analyze(allResponses, userContext);
    
    const processingTime = performance.now() - startTime;
    
    return {
      frameworks: { 
          agile: agileResult, 
          kanban: kanbanResult, 
          gtd: gtdResult, 
          para: paraResult, 
          custom: customResult
      },
      orchestration,
      metadata: {
        processingTimeMs: Math.round(processingTime),
        inputComplexity: parsedInput.complexity,
        confidenceScore: this.calculateConfidence(parsedInput) // Mock confidence score
      }
    };
  }

  private static calculateConfidence(parsedInput: ParsedInput): number {
      // Mock calculation: confidence is higher with fewer, clearer items.
      const totalItems = parsedInput.tasks.length + parsedInput.ideas.length + parsedInput.concerns.length;
      const confidence = Math.max(0.5, 1 - (totalItems / 10) - (parsedInput.complexity === 'high' ? 0.2 : 0));
      return parseFloat(confidence.toFixed(2));
  }
}
