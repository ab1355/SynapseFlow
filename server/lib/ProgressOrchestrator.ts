
// server/lib/ProgressOrchestrator.ts

import { AgileResponse, UserStory } from "./agents/AgileAgent";
import { KanbanResponse, KanbanCard } from "./agents/KanbanAgent";
import { GTDResponse, NextAction } from "./agents/GTDAgent";
import { PARAResponse, PARAItem } from "./agents/PARAAgent";
import { CustomResponse, CustomItem } from "./agents/CustomAgent";

// --- INTERFACE DEFINITIONS ---

export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL' | 'unknown';
}

export interface AllFrameworkResponses {
    agileResult?: AgileResponse;
    kanbanResult?: KanbanResponse;
    gtdResult?: GTDResponse;
    paraResult?: PARAResponse;
    customResult?: CustomResponse;
}

type AllTaskTypes = UserStory | KanbanCard | NextAction | PARAItem | CustomItem;

export interface CrossProjectRelation {
  type: 'shared_skill' | 'dependency' | 'sequential_task';
  strength: 'low' | 'medium' | 'high';
  tasks: AllTaskTypes[];
  skill?: string;
  momentumPotential: number;
  progressGain: number; // New: A percentage value representing the efficiency gain.
}

export interface RippleEffect {
    sourceTask: string;
    targetProject: string;
    impactDescription: string;
    tasksUnblocked: number;
}

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

export interface OrchestrationResult {
  crossProjectImpacts: CrossProjectRelation[];
  momentumScore: number;
  rippleEffects: RippleEffect[];
  recommendations: string[];
  motivationAmplifiers: MotivationAmplifiers;
}

interface SkillGroup {
    skill: string;
    tasks: AllTaskTypes[];
}

// --- ORCHESTRATOR IMPLEMENTATION ---

export class ProgressOrchestrator {
  static analyze(responses: AllFrameworkResponses, userContext: UserContext): OrchestrationResult {
    const crossProjectRelations = this.detectCrossProjectRelations(responses);
    const rippleEffects = this.simulateRippleEffects(responses, crossProjectRelations);
    const momentumOpportunities = this.calculateMomentumOpportunities(crossProjectRelations);
    
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
    
    const allTasks: AllTaskTypes[] = [
      ...(responses.agileResult?.userStories || []),
      ...(responses.kanbanResult?.board.cards || []),
      ...(responses.gtdResult?.nextActions || []),
      ...(responses.paraResult?.items || []),
      ...(responses.customResult?.items || [])
    ];
    
    const skillGroups = this.groupBySharedSkills(allTasks);
    
    skillGroups.forEach(group => {
      if (group.tasks.length > 1) {
        const strength = this.calculateRelationStrength(group);
        const strengthMultiplier = { 'low': 0.5, 'medium': 1, 'high': 1.5 }[strength];
        const progressGain = Math.min((group.tasks.length - 1) * 15 * strengthMultiplier, 100);

        relations.push({
          type: 'shared_skill',
          strength: strength,
          tasks: group.tasks,
          skill: group.skill,
          momentumPotential: this.calculateMomentumPotential(group),
          progressGain: parseFloat(progressGain.toFixed(1)) // Add the new metric
        });
      }
    });
    
    return relations;
  }

  private static getTaskTitle(task: AllTaskTypes): string {
    if ('title' in task) return task.title;
    if ('content' in task) return task.content;
    return 'Untitled Task';
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

  private static calculateMomentumOpportunities(relations: CrossProjectRelation[]): number[] {
      return relations.map(r => r.momentumPotential);
  }

  private static simulateRippleEffects(responses: AllFrameworkResponses, relations: CrossProjectRelation[]): RippleEffect[] {
      if (relations.length < 1 || relations[0].tasks.length < 2) return [];

      const sourceTask = relations[0].tasks[0];
      const targetTask = relations[0].tasks[1];

      return [
          {
              sourceTask: this.getTaskTitle(sourceTask),
              targetProject: "Related Framework", 
              impactDescription: `Completing '${this.getTaskTitle(sourceTask)}' also makes progress on '${this.getTaskTitle(targetTask)}' due to shared skills.`,
              tasksUnblocked: 1,
          }
      ];
  }

  private static calculateOverallMomentum(opportunities: number[]): number {
      if(opportunities.length === 0) return 0;
      const sum = opportunities.reduce((a, b) => a + b, 0);
      return Math.round((sum / opportunities.length) * 100);
  }

  private static generateActionableRecommendations(rippleEffects: RippleEffect[], userContext: UserContext): string[] {
      if (rippleEffects.length === 0) return ["No specific momentum opportunities found. Focus on the recommended framework's primary tasks."];
      const effect = rippleEffects[0];
      return [
          `Momentum Alert: ${effect.impactDescription}`,
          `To maximize this, try tackling it while in a '${userContext.energyState}' state.`,
      ];
  }

  private static groupBySharedSkills(tasks: AllTaskTypes[]): SkillGroup[] {
      const groups: { [key: string]: SkillGroup } = {};
      const commonSkills = ['api', 'ui', 'database', 'testing', 'security', 'auth', 'docs'];

      tasks.forEach(task => {
          const title = this.getTaskTitle(task).toLowerCase();
          for (const skill of commonSkills) {
              if (title.includes(skill)) {
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
