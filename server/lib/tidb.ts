import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

// TiDB connection configuration
interface TiDBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  ssl?: {
    ca?: string;
    rejectUnauthorized: boolean;
  };
}

// Connection pool for better performance
let connectionPool: mysql.Pool | null = null;

/**
 * Initialize TiDB connection pool using environment variables
 */
export function initTiDBConnection(): mysql.Pool {
  if (connectionPool) {
    return connectionPool;
  }

  const config: TiDBConfig = {
    host: process.env.TIDB_HOST || 'localhost',
    user: process.env.TIDB_USER || 'root',
    password: process.env.TIDB_PASSWORD || '',
    database: process.env.TIDB_DATABASE || 'synapse',
    port: parseInt(process.env.TIDB_PORT || '4000'),
    ssl: {
      ca: fs.readFileSync(path.join(process.cwd(), 'attached_assets/ca-cert.pem'), 'utf8'),
      rejectUnauthorized: true
    }
  };

  connectionPool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return connectionPool;
}

/**
 * Get connection from pool
 */
export async function getConnection() {
  const pool = initTiDBConnection();
  return await pool.getConnection();
}

/**
 * Execute a raw SQL query
 */
export async function executeQuery<T = any>(
  query: string, 
  params?: any[]
): Promise<T[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

// Types for database entities
export interface UserProfile {
  user_id: string;
  email: string;
  cognitive_type?: 'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL';
  productivity_patterns?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export interface Project {
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  project_embedding?: number[];
  status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  created_at?: Date;
  updated_at?: Date;
}

export interface Task {
  task_id: string;
  project_id: string;
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  energy_required?: 'LOW' | 'MEDIUM' | 'HIGH' | 'HYPERFOCUS';
  hyperfocus_suitable?: boolean;
  task_embedding?: number[];
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Vector search using cosine similarity
 * Searches for documents/tasks with similar embeddings
 */
export async function vectorSearch(
  embedding: number[],
  table: 'projects' | 'tasks',
  limit: number = 10,
  threshold: number = 0.7
): Promise<any[]> {
  const embeddingColumn = table === 'projects' ? 'project_embedding' : 'task_embedding';
  const idColumn = table === 'projects' ? 'project_id' : 'task_id';
  
  // Convert embedding array to string format for TiDB
  const embeddingStr = `[${embedding.join(',')}]`;
  
  const query = `
    SELECT *,
           VEC_COSINE_DISTANCE(${embeddingColumn}, '${embeddingStr}') AS similarity_score
    FROM ${table}
    WHERE ${embeddingColumn} IS NOT NULL
      AND VEC_COSINE_DISTANCE(${embeddingColumn}, '${embeddingStr}') <= ?
    ORDER BY similarity_score ASC
    LIMIT ?
  `;

  try {
    return await executeQuery(query, [1 - threshold, limit]);
  } catch (error) {
    console.error(`Vector search error in ${table}:`, error);
    // Fallback to regular search if vector search fails
    return await executeQuery(`
      SELECT * FROM ${table} 
      WHERE title IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [limit]);
  }
}

/**
 * Full-text search across tables
 */
export async function fullTextSearch(
  searchTerm: string,
  tables: Array<'projects' | 'tasks'> = ['projects', 'tasks'],
  limit: number = 20
): Promise<{ table: string; results: any[] }[]> {
  const results = [];
  
  for (const table of tables) {
    const query = `
      SELECT *, MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance_score
      FROM ${table}
      WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
      ORDER BY relevance_score DESC
      LIMIT ?
    `;
    
    try {
      const tableResults = await executeQuery(query, [searchTerm, searchTerm, limit]);
      results.push({ table, results: tableResults });
    } catch (error) {
      console.error(`Full-text search error in ${table}:`, error);
      // Fallback to LIKE search if full-text search fails
      const fallbackQuery = `
        SELECT * FROM ${table}
        WHERE title LIKE ? OR description LIKE ?
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const fallbackResults = await executeQuery(fallbackQuery, [
        `%${searchTerm}%`, 
        `%${searchTerm}%`, 
        limit
      ]);
      results.push({ table, results: fallbackResults });
    }
  }

  return results;
}

// CRUD Operations for Users
export const UserOperations = {
  async create(user: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const query = `
      INSERT INTO user_profiles (user_id, email, cognitive_type, productivity_patterns)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      user.user_id,
      user.email,
      user.cognitive_type || null,
      user.productivity_patterns ? JSON.stringify(user.productivity_patterns) : null
    ];

    await executeQuery(query, params);
    return { ...user, created_at: new Date(), updated_at: new Date() };
  },

  async getById(userId: string): Promise<UserProfile | null> {
    const query = 'SELECT * FROM user_profiles WHERE user_id = ?';
    const results = await executeQuery<UserProfile>(query, [userId]);
    return results[0] || null;
  },

  async getByEmail(email: string): Promise<UserProfile | null> {
    const query = 'SELECT * FROM user_profiles WHERE email = ?';
    const results = await executeQuery<UserProfile>(query, [email]);
    return results[0] || null;
  },

  async update(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const fields = [];
    const params = [];
    
    if (updates.email) {
      fields.push('email = ?');
      params.push(updates.email);
    }
    if (updates.cognitive_type) {
      fields.push('cognitive_type = ?');
      params.push(updates.cognitive_type);
    }
    if (updates.productivity_patterns) {
      fields.push('productivity_patterns = ?');
      params.push(JSON.stringify(updates.productivity_patterns));
    }
    
    if (fields.length === 0) return;

    fields.push('updated_at = NOW()');
    params.push(userId);

    const query = `UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = ?`;
    await executeQuery(query, params);
  },

  async delete(userId: string): Promise<void> {
    const query = 'DELETE FROM user_profiles WHERE user_id = ?';
    await executeQuery(query, [userId]);
  }
};

// CRUD Operations for Projects
export const ProjectOperations = {
  async create(project: Omit<Project, 'created_at' | 'updated_at'>): Promise<Project> {
    const query = `
      INSERT INTO projects (project_id, user_id, title, description, project_embedding, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      project.project_id,
      project.user_id,
      project.title,
      project.description || null,
      project.project_embedding ? JSON.stringify(project.project_embedding) : null,
      project.status || 'ACTIVE'
    ];

    await executeQuery(query, params);
    return { ...project, created_at: new Date(), updated_at: new Date() };
  },

  async getById(projectId: string): Promise<Project | null> {
    const query = 'SELECT * FROM projects WHERE project_id = ?';
    const results = await executeQuery<Project>(query, [projectId]);
    return results[0] || null;
  },

  async getByUserId(userId: string, status?: Project['status']): Promise<Project[]> {
    let query = 'SELECT * FROM projects WHERE user_id = ?';
    const params = [userId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    return await executeQuery<Project>(query, params);
  },

  async update(projectId: string, updates: Partial<Project>): Promise<void> {
    const fields = [];
    const params = [];
    
    if (updates.title) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.project_embedding) {
      fields.push('project_embedding = ?');
      params.push(JSON.stringify(updates.project_embedding));
    }
    
    if (fields.length === 0) return;

    fields.push('updated_at = NOW()');
    params.push(projectId);

    const query = `UPDATE projects SET ${fields.join(', ')} WHERE project_id = ?`;
    await executeQuery(query, params);
  },

  async delete(projectId: string): Promise<void> {
    const query = 'DELETE FROM projects WHERE project_id = ?';
    await executeQuery(query, [projectId]);
  }
};

// CRUD Operations for Tasks
export const TaskOperations = {
  async create(task: Omit<Task, 'created_at' | 'updated_at'>): Promise<Task> {
    const query = `
      INSERT INTO tasks (task_id, project_id, title, description, status, energy_required, hyperfocus_suitable, task_embedding)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      task.task_id,
      task.project_id,
      task.title,
      task.description || null,
      task.status || 'TODO',
      task.energy_required || null,
      task.hyperfocus_suitable || false,
      task.task_embedding ? JSON.stringify(task.task_embedding) : null
    ];

    await executeQuery(query, params);
    return { ...task, created_at: new Date(), updated_at: new Date() };
  },

  async getById(taskId: string): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE task_id = ?';
    const results = await executeQuery<Task>(query, [taskId]);
    return results[0] || null;
  },

  async getByProjectId(projectId: string, status?: Task['status']): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE project_id = ?';
    const params = [projectId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    return await executeQuery<Task>(query, params);
  },

  async getByEnergyLevel(
    energyLevel: Task['energy_required'], 
    userId?: string,
    limit: number = 20
  ): Promise<Task[]> {
    let query = `
      SELECT t.* FROM tasks t
      JOIN projects p ON t.project_id = p.project_id
      WHERE t.energy_required = ? AND t.status IN ('TODO', 'IN_PROGRESS')
    `;
    const params: any[] = [energyLevel];
    
    if (userId) {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY t.created_at DESC LIMIT ?';
    params.push(limit);
    
    return await executeQuery<Task>(query, params);
  },

  async update(taskId: string, updates: Partial<Task>): Promise<void> {
    const fields = [];
    const params = [];
    
    if (updates.title) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.energy_required) {
      fields.push('energy_required = ?');
      params.push(updates.energy_required);
    }
    if (updates.hyperfocus_suitable !== undefined) {
      fields.push('hyperfocus_suitable = ?');
      params.push(updates.hyperfocus_suitable);
    }
    if (updates.task_embedding) {
      fields.push('task_embedding = ?');
      params.push(JSON.stringify(updates.task_embedding));
    }
    
    if (fields.length === 0) return;

    fields.push('updated_at = NOW()');
    params.push(taskId);

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE task_id = ?`;
    await executeQuery(query, params);
  },

  async delete(taskId: string): Promise<void> {
    const query = 'DELETE FROM tasks WHERE task_id = ?';
    await executeQuery(query, [taskId]);
  }
};

/**
 * Execute schema initialization from SQL file
 */
export async function initializeSchema(): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8');
    
    // Split SQL file into individual statements (basic splitting by semicolon)
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    const errors = [];
    
    for (const statement of statements) {
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length < 5) continue;
        
        await executeQuery(statement);
        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Statement failed: ${errorMsg}`);
        console.warn(`Schema statement failed:`, errorMsg);
        console.warn(`Statement:`, statement.substring(0, 100) + '...');
      }
    }
    
    if (errors.length === 0) {
      return {
        success: true,
        message: `Database schema initialized successfully! Executed ${successCount} statements.`
      };
    } else {
      return {
        success: false,
        message: `Schema initialization completed with ${errors.length} errors. ${successCount} statements succeeded.`,
        error: errors.join('; ')
      };
    }
    
  } catch (error) {
    return {
      success: false,
      message: 'Failed to initialize database schema',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Health check for TiDB connection
 */
export async function healthCheck(): Promise<{ status: 'connected' | 'disconnected'; error?: string }> {
  try {
    await executeQuery('SELECT 1 as test');
    return { status: 'connected' };
  } catch (error) {
    return { 
      status: 'disconnected', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Close connection pool (for cleanup)
 */
export async function closeTiDBConnection(): Promise<void> {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = null;
  }
}