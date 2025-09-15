
// server/lib/performance/AgentBenchmark.ts

import { performance } from 'perf_hooks';
import { AgentFactory, UserContext } from '../AgentFactory';

// --- INTERFACE DEFINITIONS ---

export interface BenchmarkResults {
  avgProcessingTime: number;
  maxProcessingTime: number;
  minProcessingTime: number;
  totalRuns: number;
  // This could be expanded to show timings for each individual agent
  agentBreakdown: { [agentName: string]: number };
}

// --- MOCK DATA ---

// A standard user context for consistent testing environments.
const mockUserContext: UserContext = {
    energyState: 'Medium',
    cognitiveType: 'unknown'
};


// --- BENCHMARK IMPLEMENTATION ---

export class AgentBenchmark {

  /**
   * Runs a series of predefined inputs through the AgentFactory to measure performance.
   * This helps identify bottlenecks and track performance improvements over time.
   */
  static async runPerformanceTest(): Promise<BenchmarkResults> {
    const testInputs = [
      "Need to fix the login bug, update the public API documentation, and maybe think about adding 2FA down the line.",
      "I'm working on the new mobile app design. I should create the user onboarding flow, but I'm worried about the database schema for profiles.", 
      "There are some urgent website security issues to patch. Also, the API documentation for the internal services needs work. And the coffee machine is broken.",
      "Just a simple idea: what if we added gamification to the dashboard?",
      "build the new feature, then deploy it to staging and run e2e tests"
    ];
    
    const results: BenchmarkResults = {
      avgProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: Infinity,
      totalRuns: testInputs.length,
      agentBreakdown: {}
    };
    
    let totalProcessingTime = 0;
    
    for (const input of testInputs) {
      const response = await AgentFactory.processInput(input, mockUserContext);
      const processingTime = response.metadata.processingTimeMs;
      
      totalProcessingTime += processingTime;
      results.maxProcessingTime = Math.max(results.maxProcessingTime, processingTime);
      results.minProcessingTime = Math.min(results.minProcessingTime, processingTime);

      // Note: agentBreakdown would require modifying AgentFactory to return individual agent timings.
      // For now, we are measuring the total time from the metadata.
    }
    
    results.avgProcessingTime = totalProcessingTime / testInputs.length;

    // Round the results for cleaner output
    results.avgProcessingTime = Math.round(results.avgProcessingTime);
    results.maxProcessingTime = Math.round(results.maxProcessingTime);
    results.minProcessingTime = Math.round(results.minProcessingTime);
    
    return results;
  }
}
