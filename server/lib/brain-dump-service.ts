import { storage } from '../storage';
import { AgentFactory } from './agents';
import { generateEmbedding, enhanceTextForEmbedding, cosineSimilarity } from './embeddings';
import { 
  type InsertBrainDump, 
  type BrainDump, 
  type InsertFrameworkOutput,
  type FrameworkOutput,
  type EnergyState,
  type FrameworkType 
} from '@shared/schema';

export interface BrainDumpRequest {
  input: string;
  energyState: EnergyState;
  userId: string;
  projectId?: string;
}

export interface BrainDumpResponse {
  success: boolean;
  brainDumpId: string;
  originalInput: string;
  energyState: EnergyState;
  frameworks: {
    agile: any;
    kanban: any;
    gtd: any;
    para: any;
    custom: any;
  };
  embedding: number[];
  similarBrainDumps?: Array<{
    id: string;
    content: string;
    similarity: number;
    createdAt: Date;
  }>;
  processingTime: number;
}

export class BrainDumpService {
  /**
   * Process a brain dump: generate embeddings, create AI agent outputs,
   * store in database, and find similar brain dumps
   */
  async processBrainDump(request: BrainDumpRequest): Promise<BrainDumpResponse> {
    const startTime = Date.now();

    try {
      // 1. Ensure user exists and get the actual database user ID
      const effectiveUserId = await this.ensureUserExists(request.userId);

      // 2. Generate vector embedding for semantic search
      const enhancedText = enhanceTextForEmbedding(request.input, request.energyState);
      const embeddingResult = await generateEmbedding(enhancedText);

      // 3. Create brain dump record in database
      const brainDumpData: InsertBrainDump = {
        userId: effectiveUserId,
        projectId: request.projectId || null,
        content: request.input,
        energyState: request.energyState,
      };

      const brainDump = await storage.createBrainDump({
        ...brainDumpData,
        embedding: embeddingResult.embedding, // Store as JSON array
        processingTime: Date.now() - startTime
      } as any);

      // 4. Generate AI agent framework outputs
      const energyStateMap = {
        'low': 'Low' as const,
        'medium': 'Medium' as const,
        'high': 'High' as const,
        'hyperfocus': 'Hyperfocus' as const,
        'scattered': 'Scattered' as const
      };

      const frameworkResults = AgentFactory.processInput(
        request.input, 
        { energyState: energyStateMap[request.energyState] }
      );

      // 5. Store framework outputs in database
      const frameworkPromises = Object.entries(frameworkResults).map(
        async ([framework, output]) => {
          const frameworkOutput: InsertFrameworkOutput = {
            brainDumpId: brainDump.id,
            framework: framework as FrameworkType,
            agentOutput: output as any, // Type cast for JSON storage
          };

          return storage.createFrameworkOutput(frameworkOutput);
        }
      );

      await Promise.all(frameworkPromises);

      // 6. Find similar brain dumps using vector similarity
      const similarBrainDumps = await this.findSimilarBrainDumps(
        embeddingResult.embedding,
        effectiveUserId,
        brainDump.id
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        brainDumpId: brainDump.id,
        originalInput: request.input,
        energyState: request.energyState,
        frameworks: frameworkResults,
        embedding: embeddingResult.embedding,
        similarBrainDumps,
        processingTime
      };

    } catch (error) {
      console.error('Error processing brain dump:', error);
      throw new Error(`Failed to process brain dump: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find similar brain dumps using cosine similarity
   */
  private async findSimilarBrainDumps(
    queryEmbedding: number[], 
    userId: string, 
    excludeId: string,
    limit = 5
  ): Promise<Array<{ id: string; content: string; similarity: number; createdAt: Date }>> {
    try {
      // Get user's brain dumps with embeddings
      const userBrainDumps = await storage.getBrainDumpsByUser(userId);
      
      // Filter out current brain dump and those without embeddings
      const candidates = userBrainDumps
        .filter(bd => bd.id !== excludeId && bd.embedding)
        .map(bd => ({
          id: bd.id,
          content: bd.content,
          embedding: bd.embedding as number[],
          createdAt: bd.createdAt
        }));

      if (candidates.length === 0) {
        return [];
      }

      // Calculate similarities
      const similarities = candidates
        .map(candidate => ({
          id: candidate.id,
          content: candidate.content,
          createdAt: candidate.createdAt,
          similarity: cosineSimilarity(queryEmbedding, candidate.embedding)
        }))
        .filter(result => result.similarity > 0.6) // Minimum similarity threshold
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return similarities;

    } catch (error) {
      console.error('Error finding similar brain dumps:', error);
      return [];
    }
  }

  /**
   * Get brain dump history for a user with optional semantic search
   */
  async getBrainDumpHistory(
    userId: string, 
    searchQuery?: string,
    limit = 20
  ): Promise<BrainDump[]> {
    if (searchQuery) {
      // Generate embedding for search query
      const queryEmbedding = await generateEmbedding(searchQuery);
      return storage.searchBrainDumpsByEmbedding(queryEmbedding.embedding, userId, limit);
    }

    return storage.getBrainDumpsByUser(userId);
  }

  /**
   * Get framework outputs for a specific brain dump
   */
  async getFrameworkOutputs(brainDumpId: string): Promise<FrameworkOutput[]> {
    return storage.getFrameworkOutputsByBrainDump(brainDumpId);
  }

  /**
   * Ensure user exists in database, create if not found (for demo purposes)
   * Returns the actual database user ID to use for foreign key references
   */
  private async ensureUserExists(requestedUserId: string): Promise<string> {
    try {
      // First try to find user by the requested ID
      const existingUser = await storage.getUser(requestedUserId);
      if (existingUser) {
        return existingUser.id;
      }

      // Try to find by username (in case user was already created)
      const userByUsername = await storage.getUserByUsername(`user-${requestedUserId}`);
      if (userByUsername) {
        return userByUsername.id;
      }

      // Create new demo user - database will assign UUID
      const newUser = await storage.createUser({
        username: `user-${requestedUserId}`,
        password: 'demo-password', // In real app, this would be hashed
        email: `${requestedUserId}@demo.com`,
        cognitiveType: null
      });

      return newUser.id;

    } catch (error) {
      console.error('Error ensuring user exists:', error);
      // If username already exists due to race condition, try to fetch it
      try {
        const userByUsername = await storage.getUserByUsername(`user-${requestedUserId}`);
        if (userByUsername) {
          return userByUsername.id;
        }
      } catch (fetchError) {
        console.error('Error fetching user after failed creation:', fetchError);
      }
      
      throw new Error(`Failed to ensure user exists for: ${requestedUserId}`);
    }
  }

  /**
   * Utility function to capitalize first letter (for energy state conversion)
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const brainDumpService = new BrainDumpService();