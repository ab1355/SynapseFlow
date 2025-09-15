
// server/lib/InputParser.ts

// Define the interfaces that are used by the parser.
// Based on the usage in the provided snippet.

export interface Task {
    content: string;
    // other properties can be added if needed
}

export interface Idea {
    content: string;
}

export interface Concern {
    content: string;
}

export interface Project {
    content: string;
}

export interface ParsedInput {
  tasks: Task[];
  ideas: Idea[];
  concerns: Concern[];
  projects: Project[];
  complexity: 'low' | 'medium' | 'high';
  emotionalTone: 'positive' | 'negative' | 'neutral';
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SentenceAnalysis {
  type: 'task' | 'idea' | 'concern' | 'project' | 'general';
  confidence: number;
  matches: RegExpMatchArray | null | string[];
}


export class InputParser {
  static analyze(input: string): ParsedInput {
    const sentences = this.segmentSentences(input);
    const tasks: Task[] = [];
    const ideas: Idea[] = [];
    const concerns: Concern[] = [];
    const projects: Project[] = [];

    sentences.forEach(sentence => {
      const analysis = this.analyzeSentence(sentence);

      switch (analysis.type) {
        case 'task':
          tasks.push(this.extractTask(sentence, analysis));
          break;
        case 'idea':
          ideas.push(this.extractIdea(sentence, analysis));
          break;
        case 'concern':
          concerns.push(this.extractConcern(sentence, analysis));
          break;
        case 'project':
          projects.push(this.extractProject(sentence, analysis));
          break;
      }
    });

    return {
      tasks,
      ideas,
      concerns,
      projects,
      complexity: this.calculateComplexity(tasks, ideas, concerns, projects),
      emotionalTone: this.detectEmotionalTone(input),
      urgencyLevel: this.detectUrgency(input)
    };
  }

  private static segmentSentences(input: string): string[] {
    return input.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private static analyzeSentence(sentence: string): SentenceAnalysis {
    // Task indicators (no AI needed - just regex patterns)
    const taskPatterns = [
      /need to (.+)/i,
      /should (.+)/i,
      /have to (.+)/i,
      /must (.+)/i,
      /fix (.+)/i,
      /update (.+)/i,
      /create (.+)/i,
      /implement (.+)/i,
      /build (.+)/i
    ];

    // Idea indicators
    const ideaPatterns = [
      /what if (.+)/i,
      /maybe (.+)/i,
      /could (.+)/i,
      /thinking about (.+)/i,
      /idea: (.+)/i
    ];

    // Concern indicators
    const concernPatterns = [
      /worried about (.+)/i,
      /problem with (.+)/i,
      /issue (.+)/i,
      /(.+) is broken/i,
      /not working (.+)/i
    ];

    // Project indicators
    const projectPatterns = [
      /working on (.+)/i,
      /project (.+)/i,
      /building (.+)/i,
      /developing (.+)/i
    ];

    // Pattern matching logic
    for (const pattern of taskPatterns) {
        const match = sentence.match(pattern);
      if (match) {
        return { type: 'task', confidence: 0.9, matches: match };
      }
    }

    for (const pattern of ideaPatterns) {
        const match = sentence.match(pattern);
      if (match) {
        return { type: 'idea', confidence: 0.8, matches: match };
      }
    }

    for (const pattern of concernPatterns) {
        const match = sentence.match(pattern);
      if (match) {
        return { type: 'concern', confidence: 0.85, matches: match };
      }
    }

    for (const pattern of projectPatterns) {
        const match = sentence.match(pattern);
      if (match) {
        return { type: 'project', confidence: 0.9, matches: match };
      }
    }

    return { type: 'general', confidence: 0.5, matches: [] };
  }

  private static extractTask(sentence: string, analysis: SentenceAnalysis): Task {
      const content = analysis.matches && analysis.matches.length > 1 ? analysis.matches[1] : sentence;
      return { content: content.trim() };
  }

  private static extractIdea(sentence: string, analysis: SentenceAnalysis): Idea {
      const content = analysis.matches && analysis.matches.length > 1 ? analysis.matches[1] : sentence;
      return { content: content.trim() };
  }

  private static extractConcern(sentence: string, analysis: SentenceAnalysis): Concern {
      const content = analysis.matches && analysis.matches.length > 1 ? analysis.matches[1] : sentence;
      return { content: content.trim() };
  }

  private static extractProject(sentence: string, analysis: SentenceAnalysis): Project {
      const content = analysis.matches && analysis.matches.length > 1 ? analysis.matches[1] : sentence;
      return { content: content.trim() };
  }

  private static calculateComplexity(tasks: Task[], ideas: Idea[], concerns: Concern[], projects: Project[]): 'low' | 'medium' | 'high' {
      const totalItems = tasks.length + ideas.length + concerns.length + projects.length;
      if (totalItems > 5) return 'high';
      if (totalItems > 2) return 'medium';
      return 'low';
  }

  private static detectEmotionalTone(input: string): 'positive' | 'negative' | 'neutral' {
      const negativeWords = ['worried', 'problem', 'issue', 'broken', 'not working', 'bad', 'hate'];
      const positiveWords = ['great', 'good', 'idea', 'excited', 'love'];
      
      let score = 0;
      for (const word of negativeWords) {
          if (input.toLowerCase().includes(word)) score--;
      }
      for (const word of positiveWords) {
          if (input.toLowerCase().includes(word)) score++;
      }

      if (score < 0) return 'negative';
      if (score > 0) return 'positive';
      return 'neutral';
  }

  private static detectUrgency(input: string): 'low' | 'medium' | 'high' | 'critical' {
      if (/(urgent|asap|immediately|now)/i.test(input)) return 'critical';
      if (/(soon|today|this week)/i.test(input)) return 'high';
      if (/(next week|eventually)/i.test(input)) return 'medium';
      return 'low';
  }
}
