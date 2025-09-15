
// server/lib/embedding.ts

/**
 * This module handles the creation of vector embeddings using the OpenAI API
 * and provides functions for storing and retrieving them from the database.
 */

import OpenAI from 'openai';
import { query } from './db';

// --- CLIENT & MODEL CONFIGURATION ---

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";

// --- INTERFACES ---

export interface SimilarTask {
    id: number;
    task_content: string;
    similarity_score: number;
    created_at: Date;
}

// --- PUBLIC FUNCTIONS ---

/**
 * Generates a vector embedding for a given string of text.
 * @param text The input text to embed.
 * @returns A promise that resolves to the vector embedding (an array of numbers).
 */
export const createEmbedding = async (text: string): Promise<number[]> => {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });

        const embedding = response.data[0].embedding;
        if (!embedding) {
            throw new Error("Failed to generate embedding.");
        }
        return embedding;

    } catch (error) {
        console.error("Error creating embedding:", error);
        throw error;
    }
};

/**
 * Generates an embedding for a user's brain dump and stores it in the database.
 * @param userId The ID of the user who owns the task.
 * @param brainDump The raw text input from the user.
 * @returns The generated embedding vector.
 */
export const embedAndStoreTask = async (userId: number, brainDump: string): Promise<number[]> => {
    const embedding = await createEmbedding(brainDump);
    
    // pgvector uses a string representation for vectors, e.g., '[1,2,3]'
    const vectorString = `[${embedding.join(',')}]`;

    await query(
        `INSERT INTO task_embeddings (user_id, task_content, embedding) VALUES ($1, $2, $3)`, 
        [userId, brainDump, vectorString]
    );

    console.log(`Stored embedding for user ${userId}'s input.`);
    return embedding;
};

/**
 * Finds tasks with embeddings similar to the provided vector.
 * This uses the cosine distance operator (<=>) from the pgvector extension.
 *
 * @param vector The vector to find similar tasks for.
 * @param userId The ID of the user to search tasks for.
 * @param limit The maximum number of similar tasks to return.
 * @returns A promise that resolves to an array of similar tasks.
 */
export const findSimilarTasks = async (vector: number[], userId: number, limit: number = 5): Promise<SimilarTask[]> => {
    const vectorString = `[${vector.join(',')}]`;

    // The <=> operator calculates the cosine distance (0 for identical, 2 for opposite).
    // We select 1 - distance to get a similarity score (1 for identical, -1 for opposite).
    const sql = `
        SELECT 
            id, 
            task_content, 
            created_at,
            1 - (embedding <=> $1) AS similarity_score
        FROM task_embeddings
        WHERE user_id = $2
        ORDER BY embedding <=> $1
        LIMIT $3;
    `;

    try {
        const { rows } = await query(sql, [vectorString, userId, limit]);
        return rows;
    } catch (error) {
        console.error("Error finding similar tasks:", error);
        return [];
    }
};
