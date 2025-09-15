
// server/lib/ProgressOrchestrator.ts

import { AgileResponse, UserStory } from "./agents/AgileAgent";
import { KanbanResponse, KanbanCard, KanbanBoard } from "./agents/KanbanAgent";
import { GTDResponse, NextAction } from "./agents/GTDAgent";

// --- INTERFACE DEFINITIONS ---

// User context, similar to other agents
export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'adhd' | 'autism' | 'combined' | 'neurotypical' | 'unknown';
}

// A container for all agent responses
export interface AllFrameworkResponses {
    agileResult: AgileResponse;
    kanbanResult: KanbanResponse;
    gtdResult: GTDResponse;
    // para and custom can be added when their agents are defined
}

// Represents a connection between tasks in different frameworks
export interface CrossProjectRelation {
  type: 'shared_skill' | 'dependency' | 'sequential_task';
  strength: 'low' | 'medium' | 'high';
  tasks: (UserStory | KanbanCard | NextAction)[];
  skill?: string;
  momentumPotential: number; // A score from 0 to 1
}

// Represents the downstream effect of completing one task
export interface RippleEffect {
    sourceTask: string; // ID of the task that causes the ripple
    targetProject: string; // Project/framework that is affected
    impactDescription: string;
    tasksUnblocked: number;
}

// Metrics and messages to boost user motivation
export interface MotivationAmplifiers {
    achievementSummary: string;
    progressMetrics: {
        projectsAdvanced: number;
        tasksUnblocked: number;
        momentumMultiplier: string;
        efficiencyGain: string;
    };
    celebrationMessage: string;
}

// The final output of the orchestrator
export interface OrchestrationResult {
  crossProjectImpacts: CrossProjectRelation[];
  momentumScore: number;
  rippleEffects: RippleEffect[];
  recommendations: string[];
  motivationAmplifiers: MotivationAmplifiers;
}

// Represents a group of tasks sharing a common skill
interface SkillGroup {
    skill: string;
    tasks: (UserStory | KanbanCard | NextAction)[];
}


// --- ORCHESTRATOR IMPLEMENTATION ---

export class ProgressOrchestrator {
  static analyze(responses: AllFrameworkResponses, userContext: UserContext): OrchestrationResult {
    const crossProjectRelations = this.detectCrossProjectRelations(responses);
    const momentumOpportunities = this.calculateMomentumOpportunities(crossProjectRelations);
    const rippleEffects = this.simulateRippleEffects(responses, crossProjectRelations);
    
    return {
      crossProjectImpacts: crossProjectRelations,
      momentumScore: this.calculateOverallMomentum(momentumOpportunities),
      rippleEffects,
      recommendations: this.generateActionableRecommendations(rippleEffects, userContext),
      motivationAmplifiers: this.createMotivationAmplifiers(rippleEffects)
    };
  }
  
  private static detectCrossProjectRelations(responses: AllFrameworkResponses): CrossProjectRelation[] {
    const relations: CrossProjectRelation[] = [];
    
    const allTasks = [
      ...responses.agileResult.userStories,
      ...responses.kanbanResult.board.cards,
      ...responses.gtdResult.nextActions
    ] as (UserStory | KanbanCard | NextAction)[];
    
    const skillGroups = this.groupBySharedSkills(allTasks);
    
    skillGroups.forEach(group => {
      if (group.tasks.length > 1) {
        relations.push({
          type: 'shared_skill',
          strength: this.calculateRelationStrength(group),
          tasks: group.tasks,
          skill: group.skill,
          momentumPotential: this.calculateMomentumPotential(group)
        });
      }
    });
    
    return relations;
  }
  
  private static createMotivationAmplifiers(rippleEffects: RippleEffect[]): MotivationAmplifiers {
    const totalProjectsAdvanced = new Set(rippleEffects.map(e => e.targetProject)).size;
    const totalTasksUnblocked = rippleEffects.reduce((sum, e) => sum + e.tasksUnblocked, 0);
    
    return {
      achievementSummary: `Working on this could advance ${totalProjectsAdvanced} projects and unblock ${totalTasksUnblocked} tasks!`,
      progressMetrics: {
        projectsAdvanced: totalProjectsAdvanced,
        tasksUnblocked: totalTasksUnblocked,
        momentumMultiplier: this.calculateMomentumMultiplier(rippleEffects),
        efficiencyGain: this.calculateEfficiencyGain(rippleEffects)
      },
      celebrationMessage: this.generateCelebrationMessage(totalProjectsAdvanced, totalTasksUnblocked)
    };
  }

  // --- Helper Methods (Mocks) ---

  private static calculateMomentumOpportunities(relations: CrossProjectRelation[]): number[] {
      return relations.map(r => r.momentumPotential);
  }

  private static simulateRippleEffects(responses: AllFrameworkResponses, relations: CrossProjectRelation[]): RippleEffect[] {
      if (relations.length === 0) return [];

      const firstRelation = relations[0];
      return [
          {
              sourceTask: (firstRelation.tasks[0] as any).id,
              targetProject: "Kanban Board",
              impactDescription: `Completing the Agile story for '${(firstRelation.tasks[0] as any).title}' also progresses a similar card on your Kanban board.`,
              tasksUnblocked: 1,
          }
      ];
  }

  private static calculateOverallMomentum(opportunities: number[]): number {
      if(opportunities.length === 0) return 0;
      const sum = opportunities.reduce((a, b) => a + b, 0);
      return Math.round((sum / opportunities.length) * 100); // Return as a percentage
  }

  private static generateActionableRecommendations(rippleEffects: RippleEffect[], userContext: UserContext): string[] {
      if (rippleEffects.length === 0) return ["No specific momentum opportunities found, just focus on your next single task."];
      const effect = rippleEffects[0];
      return [
          `Momentum Alert: ${effect.impactDescription}`,
          `To maximize this, try tackling it while in a '${userContext.energyState}' state.`,
      ];
  }

  private static groupBySharedSkills(tasks: (UserStory | KanbanCard | NextAction)[]): SkillGroup[] {
      // Mock implementation: group by keywords like 'api', 'ui', 'database'
      const groups: { [key: string]: SkillGroup } = {};
      const commonSkills = ['api', 'ui', 'database', 'testing'];

      tasks.forEach(task => {
          const title = 'title' in task ? task.title : task.content;
          for (const skill of commonSkills) {
              if (title.toLowerCase().includes(skill)) {
                  if (!groups[skill]) {
                      groups[skill] = { skill, tasks: [] };
                  }
                  groups[skill].tasks.push(task);
              }
          }
      });
      return Object.values(groups);
  }

  private static calculateRelationStrength(group: SkillGroup): 'low' | 'medium' | 'high' {
      if (group.tasks.length > 3) return 'high';
      if (group.tasks.length > 1) return 'medium';
      return 'low';
  }

  private static calculateMomentumPotential(group: SkillGroup): number {
      // Simple heuristic: more tasks = more potential
      return Math.min(1, group.tasks.length / 5.0);
  }

  private static calculateMomentumMultiplier(rippleEffects: RippleEffect[]): string {
      const multiplier = (1 + rippleEffects.length * 0.1).toFixed(1);
      return `${multiplier}x`;
  }

  private static calculateEfficiencyGain(rippleEffects: RippleEffect[]): string {
      const gain = (rippleEffects.length * 5).toString();
      return `~${gain}%`;
  }

  private static generateCelebrationMessage(projects: number, tasks: number): string {
      if (projects > 1) return `Amazing work! You've made progress across ${projects} different areas at once!`;
      if (tasks > 1) return `Great job! You've unblocked ${tasks} other tasks. Keep the momentum going!`;
      return "Task complete! Every step forward is a victory.";
  }
}
