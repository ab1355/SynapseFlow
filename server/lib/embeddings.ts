import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

/**
 * Generate vector embeddings for text using OpenAI's text-embedding-3-small model
 * Optimized for neurodivergent brain dump content analysis
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;
    const tokens = response.usage.total_tokens;

    return {
      embedding,
      tokens
    };
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Calculate cosine similarity between two embeddings
 * Used for semantic search and brain dump clustering
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Find similar embeddings using cosine similarity
 * Returns results sorted by similarity (highest first)
 */
export function findSimilarEmbeddings(
  queryEmbedding: number[], 
  candidateEmbeddings: { id: string; embedding: number[]; content: string }[],
  threshold = 0.7,
  limit = 10
): Array<{ id: string; content: string; similarity: number }> {
  const similarities = candidateEmbeddings
    .map(candidate => ({
      id: candidate.id,
      content: candidate.content,
      similarity: cosineSimilarity(queryEmbedding, candidate.embedding)
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities;
}

/**
 * Extract key concepts from brain dump content for enhanced search
 * This will be used to improve semantic search accuracy
 */
export function extractKeywords(text: string): string[] {
  // Simple keyword extraction - could be enhanced with NLP libraries
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'from', 'they', 'have', 'been', 'said', 'each', 'which', 'their', 'will', 'about', 'would', 'there', 'could', 'other'].includes(word));

  // Remove duplicates and return
  return Array.from(new Set(words));
}

/**
 * Generate enhanced text for embedding that includes energy state context
 * This helps cluster similar brain dumps by cognitive state
 */
export function enhanceTextForEmbedding(content: string, energyState: string): string {
  const energyContext = {
    'hyperfocus': 'deep focus intense concentration detailed analysis',
    'high': 'energetic motivated productive active engaged',
    'medium': 'steady progress balanced workflow moderate pace',
    'low': 'gentle tasks simple actions minimal effort',
    'scattered': 'multiple ideas random thoughts context switching'
  };

  const context = energyContext[energyState as keyof typeof energyContext] || '';
  return `${content} [cognitive state: ${energyState} ${context}]`;
}