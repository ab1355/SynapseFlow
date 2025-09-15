// AI Agent System for Synapse - Neurodivergent Productivity Framework
// Mock implementations of AI agents for different productivity methodologies

export interface UserContext {
  energyState: 'High' | 'Medium' | 'Low' | 'Hyperfocus' | 'Scattered';
  cognitiveType?: 'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL';
  productivityPatterns?: {
    peakEnergyTimes?: string[];
    hyperfocusTriggers?: string[];
    contextSwitchTolerance?: 'low' | 'medium' | 'high';
    preferredFrameworks?: string[];
  };
}

// Response interfaces for each framework
export interface AgileResponse {
  userStories: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    storyPoints: number;
    acceptanceCriteria?: string[];
    epic?: string;
  }>;
  sprints?: Array<{
    id: string;
    name: string;
    duration: number;
    stories: string[];
  }>;
}

export interface KanbanResponse {
  columns: {
    backlog: Array<{
      id: string;
      title: string;
      description: string;
      priority?: string;
      estimatedEffort?: string;
    }>;
    todo: Array<{
      id: string;
      title: string;
      description: string;
      priority?: string;
      estimatedEffort?: string;
    }>;
    inProgress: Array<{
      id: string;
      title: string;
      description: string;
      priority?: string;
      estimatedEffort?: string;
    }>;
    done: Array<{
      id: string;
      title: string;
      description: string;
      priority?: string;
      estimatedEffort?: string;
    }>;
  };
  wipLimits?: {
    todo: number;
    inProgress: number;
  };
}

export interface GTDResponse {
  actions: Array<{
    id: string;
    title: string;
    context: string;
    energyRequired: 'Low' | 'Medium' | 'High' | 'Hyperfocus' | 'Scattered';
    timeEstimate: string;
    nextAction: boolean;
    waitingFor?: string;
    someday?: boolean;
    project?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    outcome: string;
    nextActions: string[];
  }>;
}

export interface PARAResponse {
  classification: {
    type: 'Project' | 'Area' | 'Resource' | 'Archive';
    category: string;
    actionable: boolean;
    item: {
      title: string;
      description: string;
      tags?: string[];
      relatedItems?: string[];
    };
  };
  breakdown?: Array<{
    id: string;
    title: string;
    type: 'Project' | 'Area' | 'Resource' | 'Archive';
    actionable: boolean;
  }>;
}

export interface CustomResponse {
  energyOptimized: {
    recommendedTime: string;
    breakdownStrategy: 'micro-tasks' | 'gentle-steps' | 'focused-blocks' | 'parallel-processing';
    cognitiveLoad: 'minimal' | 'moderate' | 'high';
    neurodivergentTips?: string[];
    momentumTriggers?: string[];
  };
  contextSwitchFriendly?: {
    resumptionCues: string[];
    progressMarkers: string[];
    transitionHelpers: string[];
  };
}

// Individual Agent Classes
export class AgileAgent {
  static process(input: string, userContext: UserContext): AgileResponse {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const isComplexInput = input.length > 100 || sentences.length > 2;
    
    // Determine priority based on energy state and input urgency
    const priority = this.determinePriority(input, userContext.energyState);
    const storyPoints = this.estimateStoryPoints(input, userContext.energyState, isComplexInput);
    
    const userStories = sentences.map((sentence, index) => ({
      id: `story-${Date.now()}-${index}`,
      title: `As a user, I want to ${sentence.trim().toLowerCase()}`,
      description: `Based on your ${userContext.energyState.toLowerCase()} energy state, here's how we can structure this work item for optimal completion.`,
      priority,
      storyPoints,
      acceptanceCriteria: this.generateAcceptanceCriteria(sentence.trim(), userContext)
    }));

    // If input is complex, create an epic
    const epic = isComplexInput ? {
      id: `epic-${Date.now()}`,
      name: `Brain Dump Processing - ${userContext.energyState} Energy`,
      stories: userStories.map(s => s.id)
    } : undefined;

    return {
      userStories: userStories.length > 0 ? userStories : [{
        id: `story-${Date.now()}`,
        title: `As a user, I want to organize my thoughts: "${input.substring(0, 50)}..."`,
        description: `Transform scattered thoughts into actionable work based on ${userContext.energyState.toLowerCase()} energy patterns.`,
        priority,
        storyPoints,
        acceptanceCriteria: ['Thoughts are clearly structured', 'Action items are identified', 'Progress can be tracked']
      }]
    };
  }

  private static determinePriority(input: string, energyState: string): 'low' | 'medium' | 'high' | 'critical' {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency'];
    const hasUrgency = urgentKeywords.some(keyword => input.toLowerCase().includes(keyword));
    
    if (hasUrgency) return 'critical';
    if (energyState === 'Hyperfocus') return 'high';
    if (energyState === 'High') return 'medium';
    if (energyState === 'Low') return 'low';
    return 'medium';
  }

  private static estimateStoryPoints(input: string, energyState: string, isComplexInput: boolean): number {
    let basePoints = isComplexInput ? 5 : 3;
    
    if (energyState === 'Hyperfocus') basePoints += 3;
    if (energyState === 'High') basePoints += 1;
    if (energyState === 'Scattered') basePoints -= 1;
    if (energyState === 'Low') basePoints -= 2;
    
    return Math.max(1, Math.min(13, basePoints)); // Fibonacci-like bounds
  }

  private static generateAcceptanceCriteria(sentence: string, userContext: UserContext): string[] {
    const criteria = ['Task is clearly defined and actionable'];
    
    if (userContext.energyState === 'Hyperfocus') {
      criteria.push('Deep work session is optimized');
      criteria.push('Progress can be sustained for 2-4 hours');
    } else if (userContext.energyState === 'Scattered') {
      criteria.push('Task is broken into micro-steps');
      criteria.push('Progress markers are clear and frequent');
    }
    
    criteria.push('Completion criteria are measurable');
    return criteria;
  }
}

export class KanbanAgent {
  static process(input: string, userContext: UserContext): KanbanResponse {
    const tasks = this.extractTasks(input);
    const wipLimits = this.calculateWipLimits(userContext.energyState);
    
    const columns: KanbanResponse['columns'] = {
      backlog: [],
      todo: [],
      inProgress: [],
      done: []
    };

    // Distribute tasks based on energy state and complexity
    tasks.forEach((task, index) => {
      const taskItem = {
        id: `task-${Date.now()}-${index}`,
        title: task,
        description: this.generateTaskDescription(task, userContext),
        priority: this.determinePriority(task, userContext.energyState),
        estimatedEffort: this.estimateEffort(task, userContext.energyState)
      };

      // Place in appropriate column based on energy state
      if (userContext.energyState === 'Hyperfocus' && index === 0) {
        columns.inProgress.push(taskItem);
      } else if (userContext.energyState === 'High' && index < 2) {
        columns.todo.push(taskItem);
      } else {
        columns.backlog.push(taskItem);
      }
    });

    // Ensure at least one item in todo for immediate action
    if (columns.todo.length === 0 && columns.backlog.length > 0) {
      const firstTask = columns.backlog.shift()!;
      columns.todo.push(firstTask);
    }

    return {
      columns,
      wipLimits
    };
  }

  private static extractTasks(input: string): string[] {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) {
      return [input.trim()];
    }
    
    return sentences.map(s => s.trim());
  }

  private static generateTaskDescription(task: string, userContext: UserContext): string {
    const energyAdjective = {
      'Hyperfocus': 'deep-focused',
      'High': 'energetic',
      'Medium': 'balanced',
      'Low': 'gentle',
      'Scattered': 'flexible'
    }[userContext.energyState];

    return `Organized from your ${energyAdjective} brain dump session. Adapted for ${userContext.energyState.toLowerCase()} energy processing.`;
  }

  private static determinePriority(task: string, energyState: string): string {
    const urgentKeywords = ['urgent', 'asap', 'critical', 'immediately'];
    const hasUrgency = urgentKeywords.some(keyword => task.toLowerCase().includes(keyword));
    
    if (hasUrgency) return 'critical';
    if (energyState === 'Hyperfocus') return 'high';
    return 'medium';
  }

  private static estimateEffort(task: string, energyState: string): string {
    const baseEffort = task.length > 50 ? 'medium' : 'small';
    
    if (energyState === 'Hyperfocus') return 'large';
    if (energyState === 'High') return 'medium';
    if (energyState === 'Low' || energyState === 'Scattered') return 'small';
    
    return baseEffort;
  }

  private static calculateWipLimits(energyState: string): { todo: number; inProgress: number } {
    const limits = {
      'Hyperfocus': { todo: 2, inProgress: 1 },
      'High': { todo: 4, inProgress: 2 },
      'Medium': { todo: 3, inProgress: 2 },
      'Low': { todo: 2, inProgress: 1 },
      'Scattered': { todo: 5, inProgress: 1 }
    };
    
    return limits[energyState as keyof typeof limits] || limits.Medium;
  }
}

export class GTDAgent {
  static process(input: string, userContext: UserContext): GTDResponse {
    const actionItems = this.extractActions(input);
    
    const actions = actionItems.map((item, index) => ({
      id: `action-${Date.now()}-${index}`,
      title: this.generateActionTitle(item),
      context: this.determineContext(item, userContext.energyState),
      energyRequired: userContext.energyState,
      timeEstimate: this.estimateTime(item, userContext.energyState),
      nextAction: index === 0, // First item is usually the next action
      project: this.identifyProject(input),
      someday: userContext.energyState === 'Low' && !this.isActionable(item)
    }));

    // Create project if input is complex enough
    const projects = this.shouldCreateProject(input) ? [{
      id: `project-${Date.now()}`,
      name: this.generateProjectName(input),
      outcome: this.defineProjectOutcome(input, userContext),
      nextActions: actions.filter(a => a.nextAction).map(a => a.id)
    }] : undefined;

    return {
      actions,
      projects
    };
  }

  private static extractActions(input: string): string[] {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length > 0 ? sentences.map(s => s.trim()) : [input.trim()];
  }

  private static generateActionTitle(item: string): string {
    const actionVerbs = ['Review', 'Organize', 'Process', 'Complete', 'Research', 'Plan'];
    const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    return `${verb}: ${item.substring(0, 60)}${item.length > 60 ? '...' : ''}`;
  }

  private static determineContext(item: string, energyState: string): string {
    const contexts = {
      'Hyperfocus': '@deep-work',
      'High': '@computer',
      'Medium': '@anywhere',
      'Low': '@easy-tasks',
      'Scattered': '@quick-capture'
    };
    
    // Check for specific context clues in the text
    if (item.toLowerCase().includes('call') || item.toLowerCase().includes('phone')) return '@phone';
    if (item.toLowerCase().includes('meeting') || item.toLowerCase().includes('discuss')) return '@meeting';
    if (item.toLowerCase().includes('buy') || item.toLowerCase().includes('store')) return '@errands';
    if (item.toLowerCase().includes('email') || item.toLowerCase().includes('message')) return '@computer';
    
    return contexts[energyState as keyof typeof contexts] || '@computer';
  }

  private static estimateTime(item: string, energyState: string): string {
    const baseTime = item.length > 100 ? 60 : item.length > 50 ? 30 : 15;
    
    const multipliers = {
      'Hyperfocus': 2.5,
      'High': 1.2,
      'Medium': 1,
      'Low': 0.8,
      'Scattered': 0.6
    };
    
    const adjustedTime = baseTime * (multipliers[energyState as keyof typeof multipliers] || 1);
    
    if (adjustedTime <= 15) return '15 min';
    if (adjustedTime <= 30) return '30 min';
    if (adjustedTime <= 60) return '1 hour';
    if (adjustedTime <= 120) return '2 hours';
    return '2+ hours';
  }

  private static isActionable(item: string): boolean {
    const nonActionableKeywords = ['think about', 'consider', 'maybe', 'someday', 'wish', 'dream'];
    return !nonActionableKeywords.some(keyword => item.toLowerCase().includes(keyword));
  }

  private static shouldCreateProject(input: string): boolean {
    return input.length > 150 || input.split(/[.!?]+/).length > 3;
  }

  private static generateProjectName(input: string): string {
    const firstSentence = input.split(/[.!?]+/)[0];
    return `Project: ${firstSentence.substring(0, 50)}${firstSentence.length > 50 ? '...' : ''}`;
  }

  private static defineProjectOutcome(input: string, userContext: UserContext): string {
    return `Successfully process and organize brain dump content using ${userContext.energyState.toLowerCase()} energy optimization strategies.`;
  }

  private static identifyProject(input: string): string | undefined {
    const projectKeywords = ['project', 'initiative', 'goal', 'objective', 'plan'];
    const hasProject = projectKeywords.some(keyword => input.toLowerCase().includes(keyword));
    return hasProject ? 'Brain Dump Processing' : undefined;
  }
}

export class PARAAgent {
  static process(input: string, userContext: UserContext): PARAResponse {
    const classification = this.classifyInput(input, userContext);
    const breakdown = this.breakdownInput(input, userContext);
    
    return {
      classification,
      breakdown: breakdown.length > 1 ? breakdown : undefined
    };
  }

  private static classifyInput(input: string, userContext: UserContext): PARAResponse['classification'] {
    const type = this.determineParaType(input, userContext.energyState);
    const category = this.determineCategory(input);
    const actionable = this.isActionable(input);
    
    return {
      type,
      category,
      actionable,
      item: {
        title: this.generateTitle(input, type),
        description: input.trim(),
        tags: this.generateTags(input, userContext),
        relatedItems: this.findRelatedItems(input)
      }
    };
  }

  private static determineParaType(input: string, energyState: string): 'Project' | 'Area' | 'Resource' | 'Archive' {
    const hasDeadline = /deadline|due|urgent|asap|today|tomorrow|week|month/i.test(input);
    const hasOutcome = /complete|finish|achieve|goal|result|deliver/i.test(input);
    const isReference = /learn|research|study|remember|note|info/i.test(input);
    const isOngoing = /maintain|manage|keep|continue|ongoing|routine/i.test(input);
    
    if (hasDeadline && hasOutcome) return 'Project';
    if (isOngoing) return 'Area';
    if (isReference) return 'Resource';
    
    // Energy state influence
    if (energyState === 'Hyperfocus') return 'Project';
    if (energyState === 'Scattered') return 'Resource';
    if (energyState === 'Low') return 'Area';
    
    return 'Project'; // Default for actionable content
  }

  private static determineCategory(input: string): string {
    const categories = {
      'work': ['work', 'job', 'career', 'professional', 'office', 'business'],
      'personal': ['personal', 'home', 'family', 'friend', 'relationship'],
      'health': ['health', 'fitness', 'exercise', 'medical', 'wellness'],
      'learning': ['learn', 'study', 'course', 'education', 'skill', 'knowledge'],
      'finance': ['money', 'budget', 'financial', 'investment', 'expense'],
      'technology': ['tech', 'software', 'code', 'programming', 'computer', 'app'],
      'creative': ['creative', 'art', 'design', 'music', 'writing', 'craft']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }
    
    return 'General';
  }

  private static isActionable(input: string): boolean {
    const actionableKeywords = ['do', 'make', 'create', 'build', 'write', 'call', 'send', 'complete', 'finish'];
    const nonActionableKeywords = ['think about', 'consider', 'maybe', 'someday', 'remember', 'note'];
    
    const hasActionable = actionableKeywords.some(keyword => input.toLowerCase().includes(keyword));
    const hasNonActionable = nonActionableKeywords.some(keyword => input.toLowerCase().includes(keyword));
    
    return hasActionable || !hasNonActionable;
  }

  private static generateTitle(input: string, type: 'Project' | 'Area' | 'Resource' | 'Archive'): string {
    const firstSentence = input.split(/[.!?]+/)[0].trim();
    const prefix = {
      'Project': 'Project:',
      'Area': 'Area:',
      'Resource': 'Resource:',
      'Archive': 'Archive:'
    }[type];
    
    return `${prefix} ${firstSentence.substring(0, 50)}${firstSentence.length > 50 ? '...' : ''}`;
  }

  private static generateTags(input: string, userContext: UserContext): string[] {
    const tags = [userContext.energyState.toLowerCase()];
    
    // Add content-based tags
    if (input.toLowerCase().includes('urgent')) tags.push('urgent');
    if (input.toLowerCase().includes('important')) tags.push('important');
    if (input.length > 200) tags.push('complex');
    if (userContext.cognitiveType) tags.push(userContext.cognitiveType.toLowerCase());
    
    return tags;
  }

  private static findRelatedItems(input: string): string[] {
    // Mock related items based on content
    const relatedItems = [];
    
    if (input.toLowerCase().includes('project')) relatedItems.push('Other Active Projects');
    if (input.toLowerCase().includes('work')) relatedItems.push('Work Area');
    if (input.toLowerCase().includes('learn')) relatedItems.push('Learning Resources');
    
    return relatedItems;
  }

  private static breakdownInput(input: string, userContext: UserContext): Array<{
    id: string;
    title: string;
    type: 'Project' | 'Area' | 'Resource' | 'Archive';
    actionable: boolean;
  }> {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) return [];
    
    return sentences.map((sentence, index) => ({
      id: `para-item-${Date.now()}-${index}`,
      title: sentence.trim().substring(0, 60),
      type: this.determineParaType(sentence, userContext.energyState),
      actionable: this.isActionable(sentence)
    }));
  }
}

export class CustomAgent {
  static process(input: string, userContext: UserContext): CustomResponse {
    const energyOptimized = this.generateEnergyOptimization(input, userContext);
    const contextSwitchFriendly = this.generateContextSwitchHelpers(input, userContext);
    
    return {
      energyOptimized,
      contextSwitchFriendly
    };
  }

  private static generateEnergyOptimization(input: string, userContext: UserContext): CustomResponse['energyOptimized'] {
    const energyState = userContext.energyState;
    const inputComplexity = this.assessComplexity(input);
    
    const timeRecommendations = {
      'Hyperfocus': 'Next 2-4 hours (ride the wave)',
      'High': 'Next 1-2 hours (capture the energy)',
      'Medium': 'Today or tomorrow',
      'Low': 'When energy naturally rises',
      'Scattered': 'Multiple short bursts throughout the day'
    };
    
    const strategyMapping = {
      'Hyperfocus': 'focused-blocks',
      'High': 'focused-blocks', 
      'Medium': 'parallel-processing',
      'Low': 'gentle-steps',
      'Scattered': 'micro-tasks'
    } as const;
    
    const cognitiveLoads = {
      'Hyperfocus': 'high',
      'High': 'moderate',
      'Medium': 'moderate',
      'Low': 'minimal',
      'Scattered': 'minimal'
    } as const;
    
    return {
      recommendedTime: timeRecommendations[energyState],
      breakdownStrategy: strategyMapping[energyState],
      cognitiveLoad: cognitiveLoads[energyState],
      neurodivergentTips: this.generateNeurodivergentTips(energyState, inputComplexity),
      momentumTriggers: this.generateMomentumTriggers(energyState, userContext)
    };
  }

  private static generateContextSwitchHelpers(input: string, userContext: UserContext): CustomResponse['contextSwitchFriendly'] {
    return {
      resumptionCues: this.generateResumptionCues(input, userContext),
      progressMarkers: this.generateProgressMarkers(input, userContext.energyState),
      transitionHelpers: this.generateTransitionHelpers(userContext.energyState)
    };
  }

  private static assessComplexity(input: string): 'low' | 'medium' | 'high' {
    const wordCount = input.split(' ').length;
    const sentenceCount = input.split(/[.!?]+/).length;
    
    if (wordCount > 100 || sentenceCount > 5) return 'high';
    if (wordCount > 50 || sentenceCount > 3) return 'medium';
    return 'low';
  }

  private static generateNeurodivergentTips(energyState: string, complexity: string): string[] {
    const baseTips = [
      'Work with your brain, not against it',
      'Progress over perfection',
      'Use visual progress indicators'
    ];
    
    const energySpecificTips = {
      'Hyperfocus': [
        'Set a gentle timer to check in every 90 minutes',
        'Keep water and snacks nearby',
        'Document your progress for later review'
      ],
      'High': [
        'Channel energy into your most important tasks',
        'Use the Pomodoro technique with longer blocks',
        'Capture ideas in a parking lot for later'
      ],
      'Medium': [
        'Balance challenging and routine tasks',
        'Use time-boxing for focused work',
        'Schedule breaks proactively'
      ],
      'Low': [
        'Start with the smallest possible step',
        'Use gentle accountability systems',
        'Celebrate micro-wins'
      ],
      'Scattered': [
        'Use brain dumps to clear mental clutter',
        'Set up visible progress tracking',
        'Allow for flexible task switching'
      ]
    };
    
    return [...baseTips, ...(energySpecificTips[energyState as keyof typeof energySpecificTips] || [])];
  }

  private static generateMomentumTriggers(energyState: string, userContext: UserContext): string[] {
    const triggers = [];
    
    if (userContext.productivityPatterns?.hyperfocusTriggers) {
      triggers.push(...userContext.productivityPatterns.hyperfocusTriggers);
    }
    
    const energyTriggers = {
      'Hyperfocus': ['Deep work music', 'Clear workspace', 'Interesting problem'],
      'High': ['Upbeat music', 'Movement break', 'Collaborative energy'],
      'Medium': ['Consistent routine', 'Clear priorities', 'Balanced workload'],
      'Low': ['Gentle encouragement', 'Easy wins', 'Minimal decisions'],
      'Scattered': ['Brain dump session', 'Visual organization', 'Choice menus']
    };
    
    triggers.push(...(energyTriggers[energyState as keyof typeof energyTriggers] || []));
    
    return triggers;
  }

  private static generateResumptionCues(input: string, userContext: UserContext): string[] {
    return [
      'Review brain dump context',
      'Check energy state and adjust approach',
      'Scan progress markers from last session',
      'Set intention for current work session'
    ];
  }

  private static generateProgressMarkers(input: string, energyState: string): string[] {
    const baseMarkers = ['Initial thoughts captured', 'Framework structure created'];
    
    if (energyState === 'Scattered') {
      baseMarkers.push('Small wins celebrated', 'Next micro-step identified');
    } else if (energyState === 'Hyperfocus') {
      baseMarkers.push('Deep work session completed', 'Comprehensive review done');
    }
    
    baseMarkers.push('Ready for next phase');
    return baseMarkers;
  }

  private static generateTransitionHelpers(energyState: string): string[] {
    const helpers = [
      'Take 3 deep breaths',
      'Note current context',
      'Set clear intention for next activity'
    ];
    
    if (energyState === 'Scattered') {
      helpers.push('Use transition ritual', 'Clear mental workspace');
    } else if (energyState === 'Hyperfocus') {
      helpers.push('Gentle timer reminder', 'Gradual attention shift');
    }
    
    return helpers;
  }
}

// Agent Factory Class
export class AgentFactory {
  static processInput(input: string, userContext: UserContext) {
    return {
      agile: AgileAgent.process(input, userContext),
      kanban: KanbanAgent.process(input, userContext), 
      gtd: GTDAgent.process(input, userContext),
      para: PARAAgent.process(input, userContext),
      custom: CustomAgent.process(input, userContext)
    };
  }

  static processInputSingle(input: string, userContext: UserContext, framework: 'agile' | 'kanban' | 'gtd' | 'para' | 'custom') {
    const agents = {
      agile: AgileAgent,
      kanban: KanbanAgent,
      gtd: GTDAgent,
      para: PARAAgent,
      custom: CustomAgent
    };
    
    const agent = agents[framework];
    if (!agent) {
      throw new Error(`Unknown framework: ${framework}`);
    }
    
    return agent.process(input, userContext);
  }
}

// All types and classes are already exported above