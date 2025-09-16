
// server/lib/AgentFactory.ts

import { performance } from 'perf_hooks';
import { InputParser, ParsedInput } from './InputParser';

// Import agents and their response types
import { AgileAgent, AgileResponse } from './agents/AgileAgent';
import { KanbanAgent, KanbanResponse } from './agents/KanbanAgent';
import { GTDAgent, GTDResponse } from './agents/GTDAgent';
import { PARAAgent, PARAResponse } from './agents/PARAAgent';
import { CustomAgent, CustomResponse } from './agents/CustomAgent';
import { SemanticAgent, SemanticResponse } from './agents/SemanticAgent';

import { ProgressOrchestrator, OrchestrationResult, AllFrameworkResponses } from './ProgressOrchestrator';
import { embedAndStoreTask } from './embedding';
import { SimilarTask } from './embedding'; // Import SimilarTask interface

// --- INTERFACE DEFINITIONS ---

// The UserContext now includes historical data for other agents to use.
export interface UserContext {
  userId: number;
  userTier: 'free' | 'pro' | 'enterprise';
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'adhd' | 'autism' | 'combined' | 'neurotypical' | 'unknown';
  historicalContext?: SimilarTask[]; // <-- New: Provides agents with context from similar past tasks.
}

export interface FrameworkResponses {
    agile?: AgileResponse;
    kanban?: KanbanResponse;
    gtd?: GTDResponse;
    para?: PARAResponse;
    custom?: CustomResponse;
}

export interface MultiFrameworkResponse {
    semantic: SemanticResponse;
    frameworks: FrameworkResponses;
    orchestration: OrchestrationResult | null;
    metadata: {
        processingTimeMs: number;
        inputComplexity: 'low' | 'medium' | 'high';
        confidenceScore: number;
        embeddingStored: boolean;
        agentsExecuted: string[];
    };
}

const TIER_AGENT_ACCESS = {
    free: ['Semantic', 'Custom'],
    pro: ['Semantic', 'Custom', 'Agile', 'Kanban', 'GTD', 'PARA'],
    enterprise: ['Semantic', 'Custom', 'Agile', 'Kanban', 'GTD', 'PARA'],
};

// --- AGENT FACTORY IMPLEMENTATION ---

export class AgentFactory {
  static async processInput(input: string, userContext: UserContext): Promise<MultiFrameworkResponse> {
    const startTime = performance.now();
    
    // 1. Store Embedding (asynchronously)
    let embeddingStored = false;
    embedAndStoreTask(userContext.userId, input)
        .then(() => { embeddingStored = true; })
        .catch(error => console.error("AgentFactory: Failed to store embedding.", error));

    // 2. Semantic Analysis to get recommendations and historical context.
    const semanticResult = await SemanticAgent.process(input, userContext);
    const recommendedFrameworks = new Set(semanticResult.recommendedFrameworks);
    
    // 3. Enrich the UserContext with historical data for other agents.
    const enrichedUserContext: UserContext = {
        ...userContext,
        historicalContext: semanticResult.similarPastTasks
    };

    // 4. Parse Input for Deterministic Agents
    const parsedInput = InputParser.analyze(input);
    
    // 5. Dynamic Agent Execution using the enriched context.
    const agentPromises: { [key: string]: Promise<any> } = {};
    const agentsToRun = [];

    const availableAgents = TIER_AGENT_ACCESS[userContext.userTier] || [];

    // The set of agents to run is determined by the SemanticAgent's output.
    const agentMap = {
        'Agile': () => AgileAgent.process(parsedInput, enrichedUserContext),
        'Kanban': () => KanbanAgent.process(parsedInput, enrichedUserContext),
        'GTD': () => GTDAgent.process(parsedInput, enrichedUserContext),
        'PARA': () => PARAAgent.process(parsedInput, enrichedUserContext),
        'Custom': () => CustomAgent.process(parsedInput, enrichedUserContext)
    };

    for (const framework of recommendedFrameworks) {
        if (availableAgents.includes(framework) && agentMap[framework as keyof typeof agentMap]) {
            agentPromises[framework.toLowerCase()] = agentMap[framework as keyof typeof agentMap]();
            agentsToRun.push(framework);
        }
    }

    const agentResults = await Promise.all(Object.values(agentPromises));
    const frameworkResponses: FrameworkResponses = {};
    Object.keys(agentPromises).forEach((key, index) => {
        frameworkResponses[key as keyof FrameworkResponses] = agentResults[index];
    });

    // 6. Orchestration
    let orchestration: OrchestrationResult | null = null;
    if (agentsToRun.length > 0) {
        const allResponses: AllFrameworkResponses = frameworkResponses;
        orchestration = ProgressOrchestrator.analyze(allResponses, enrichedUserContext);
    }
    
    const processingTime = performance.now() - startTime;
    
    return {
      semantic: semanticResult,
      frameworks: frameworkResponses,
      orchestration,
      metadata: {
        processingTimeMs: Math.round(processingTime),
        inputComplexity: parsedInput.complexity,
        confidenceScore: this.calculateConfidence(parsedInput),
        embeddingStored,
        agentsExecuted: agentsToRun
      }
    };
  }

  private static calculateConfidence(parsedInput: ParsedInput): number {
      const totalItems = parsedInput.tasks.length + parsedInput.ideas.length + parsedInput.concerns.length;
      const confidence = Math.max(0.5, 1 - (totalItems / 10) - (parsedInput.complexity === 'high' ? 0.2 : 0));
      return parseFloat(confidence.toFixed(2));
  }
}
