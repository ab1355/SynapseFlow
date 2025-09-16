
// server/lib/agents/AgileAgent.ts

import { ParsedInput, Task, Project as ParsedProject } from '../InputParser';

// --- INTERFACE DEFINITIONS ---

export interface UserHistory {
    completedStoryPoints: number;
    sprintsCompleted: number;
}

export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL' | 'unknown';
  history?: UserHistory;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  epic?: string;
  sprint?: string;
}

export interface Epic {
    id: string;
    name: string;
    storyIds: string[];
}

export interface Sprint {
    id: string;
    name: string;
    storyIds: string[];
    startDate: string;
    endDate: string;
}

export interface AgileResponse {
  userStories: UserStory[];
  epics: Epic[];
  sprints: Sprint[];
  backlog: UserStory[];
  velocityPrediction: string;
}

// This is a more detailed task representation used internally by this agent.
interface ExtractedTask {
    content: string;
    action: string;
    benefit: string;
    category: 'technical' | 'feature' | 'bug' | 'improvement';
    keywords: string[];
}


// --- AGENT IMPLEMENTATION ---

export class AgileAgent {
  static async process(parsedInput: ParsedInput, userContext: UserContext): Promise<AgileResponse> {
    
    const extractedTasks: ExtractedTask[] = parsedInput.tasks.map(this.extractTaskDetails);

    const userStories = extractedTasks.map(task => this.createUserStory(task, userContext));
    const epics = this.groupIntoEpics(userStories, parsedInput.projects);
    const sprints = this.planSprints(userStories, userContext);
    
    return {
      userStories,
      epics,
      sprints,
      backlog: this.prioritizeBacklog(userStories, userContext),
      velocityPrediction: this.predictVelocity(userStories, userContext.history)
    };
  }
  
  private static createUserStory(task: ExtractedTask, userContext: UserContext): UserStory {
    return {
      id: `US-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.generateStoryTitle(task),
      description: this.generateStoryDescription(task),
      acceptanceCriteria: this.generateAcceptanceCriteria(task, userContext),
      storyPoints: this.estimateStoryPoints(task, userContext),
      priority: this.calculatePriority(task, userContext),
      tags: this.assignTags(task, userContext),
      epic: this.assignToEpic(task),
      sprint: this.suggestSprint(task, userContext)
    };
  }

  private static extractTaskDetails(task: Task): ExtractedTask {
      // Mock logic to transform a simple task into a detailed one.
      const content = task.content;
      const keywords = content.toLowerCase().split(' ');
      let category: ExtractedTask['category'] = 'feature';
      if (keywords.some(k => ['fix', 'bug', 'issue'].includes(k))) {
          category = 'bug';
      } else if (keywords.some(k => ['improve', 'refactor', 'update'].includes(k))) {
          category = 'improvement';
      } else if (keywords.some(k => ['database', 'api', 'backend'].includes(k))) {
          category = 'technical';
      }

      return {
          content,
          action: content.substring(0, 50), // simplified action
          benefit: 'to improve the system', // generic benefit
          category,
          keywords,
      };
  }
  
  private static generateStoryDescription(task: ExtractedTask): string {
    const templates = {
      'technical': `As a developer, I want to ${task.action} so that ${task.benefit || 'the system works properly'}`,
      'feature': `As a user, I want to ${task.action} so that ${task.benefit || 'I can accomplish my goals'}`, 
      'bug': `As a user, I want ${task.action} fixed so that ${task.benefit || 'the application works as expected'}`,
      'improvement': `As a user, I want ${task.action} improved so that ${task.benefit || 'my experience is better'}`
    };
    
    return templates[task.category] || templates['feature'];
  }
  
  private static estimateStoryPoints(task: ExtractedTask, userContext: UserContext): number {
    let points = 1;
    
    if (task.keywords.some(k => ['database', 'api', 'integration'].includes(k))) points += 2;
    if (task.keywords.some(k => ['new', 'create', 'build'].includes(k))) points += 2;
    if (task.keywords.some(k => ['complex', 'advanced', 'system'].includes(k))) points += 3;
    
    if (userContext.energyState === 'Low') points = Math.min(points, 3);
    if (userContext.energyState === 'Hyperfocus') points += 1;
    
    // Snap to a Fibonacci-like number
    const fib = [1, 2, 3, 5, 8];
    return fib.reduce((prev, curr) => (Math.abs(curr - points) < Math.abs(prev - points) ? curr : prev));
  }

  private static generateStoryTitle(task: ExtractedTask): string {
      return `${task.category.charAt(0).toUpperCase() + task.category.slice(1)}: ${task.content.substring(0, 40)}${task.content.length > 40 ? '...' : ''}`;
  }

  private static generateAcceptanceCriteria(task: ExtractedTask, userContext: UserContext): string[] {
      const criteria = [`Task is clearly defined and actionable`];
      if (userContext.energyState === 'Hyperfocus') {
          criteria.push('Deep work session is optimized');
      } else if (userContext.energyState === 'Scattered') {
          criteria.push('Task is broken into micro-steps');
      }
      if (task.category === 'bug') {
          criteria.push('A regression test is implemented to prevent reoccurrence.');
      }
      criteria.push('Completion criteria are measurable');
      return criteria;
  }

  private static calculatePriority(task: ExtractedTask, userContext: UserContext): 'low' | 'medium' | 'high' | 'critical' {
      if (task.keywords.some(k => ['urgent', 'critical', 'asap'].includes(k))) return 'critical';
      if (task.category === 'bug') return 'high';
      if (userContext.energyState === 'Hyperfocus') return 'high';
      if (userContext.energyState === 'Low') return 'low';
      return 'medium';
  }

  private static assignTags(task: ExtractedTask, userContext: UserContext): string[] {
      const tags = [userContext.energyState.toLowerCase(), task.category];
      if (task.keywords.some(k => ['ui', 'frontend', 'css'].includes(k))) tags.push('frontend');
      if (task.keywords.some(k => ['db', 'database', 'backend'].includes(k))) tags.push('backend');
      return Array.from(new Set(tags)); // Return unique tags
  }

  private static assignToEpic(task: ExtractedTask): string | undefined {
      // Mock: if a task is part of a "project", assign it to an epic
      return task.keywords.includes('project') ? `EPIC-${task.content.slice(0, 10).toUpperCase()}` : undefined;
  }

  private static suggestSprint(task: ExtractedTask, userContext: UserContext): string | undefined {
      const priority = this.calculatePriority(task, userContext);
      if (priority === 'critical' || priority === 'high') {
          return 'Sprint-1';
      }
      return undefined;
  }

  private static groupIntoEpics(userStories: UserStory[], projects: ParsedProject[]): Epic[] {
      if (projects.length === 0 || userStories.length < 3) return [];
      
      return projects.map((p, i) => ({
          id: `EPIC-${Date.now() + i}`,
          name: `Epic: ${p.content}`,
          // Simple logic: assign all stories to the first epic for this mock
          storyIds: i === 0 ? userStories.map(s => s.id) : [] 
      }));
  }

  private static planSprints(userStories: UserStory[], userContext: UserContext): Sprint[] {
      if (userStories.length === 0) return [];

      const sprintCapacity = userContext.energyState === 'Low' ? 5 : (userContext.energyState === 'Scattered' ? 8 : 13);
      let currentSprintPoints = 0;
      const sprintStories: UserStory[] = [];

      for (const story of this.prioritizeBacklog(userStories, userContext)) {
          if (currentSprintPoints + story.storyPoints <= sprintCapacity) {
              sprintStories.push(story);
              currentSprintPoints += story.storyPoints;
          }
      }

      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      return [{
          id: `Sprint-1`,
          name: `Sprint 1 (${userContext.energyState} Energy)`,
          storyIds: sprintStories.map(s => s.id),
          startDate: today.toISOString().split('T')[0],
          endDate: nextWeek.toISOString().split('T')[0]
      }];
  }

  private static prioritizeBacklog(userStories: UserStory[], userContext: UserContext): UserStory[] {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return [...userStories].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority] || b.storyPoints - a.storyPoints);
  }

  private static predictVelocity(userStories: UserStory[], history?: UserHistory): string {
      if (history && history.sprintsCompleted > 0) {
          const avgVelocity = history.completedStoryPoints / history.sprintsCompleted;
          return `${avgVelocity.toFixed(1)} points/sprint (historical)`;
      }
      const totalPoints = userStories.reduce((sum, story) => sum + story.storyPoints, 0);
      // Assume it takes 2 sprints for a new project
      const estimatedSprints = Math.max(1, Math.ceil(totalPoints / 13)); // Assume average capacity of 13
      return `${(totalPoints / estimatedSprints).toFixed(1)} points/sprint (estimated)`;
  }
}
