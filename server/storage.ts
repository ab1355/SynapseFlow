import { 
  type User, 
  type InsertUser, 
  type BrainDump, 
  type InsertBrainDump,
  type Project,
  type InsertProject,
  type FrameworkOutput,
  type InsertFrameworkOutput,
  type Task,
  type InsertTask,
  users,
  brainDumps,
  projects,
  frameworkOutputs,
  tasks
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface supporting the full neurodivergent productivity system
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project management
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;

  // Brain dump operations
  getBrainDump(id: string): Promise<BrainDump | undefined>;
  getBrainDumpsByUser(userId: string): Promise<BrainDump[]>;
  createBrainDump(brainDump: InsertBrainDump): Promise<BrainDump>;
  searchBrainDumpsByEmbedding(embedding: number[], userId: string, limit?: number): Promise<BrainDump[]>;

  // Framework outputs
  getFrameworkOutput(id: string): Promise<FrameworkOutput | undefined>;
  getFrameworkOutputsByBrainDump(brainDumpId: string): Promise<FrameworkOutput[]>;
  createFrameworkOutput(output: InsertFrameworkOutput): Promise<FrameworkOutput>;

  // Task management
  getTask(id: string): Promise<Task | undefined>;
  getTasksByUser(userId: string): Promise<Task[]>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values([insertUser as any]) // Type cast for now - schema validation ensures correctness
      .returning();
    return user;
  }

  // Project management
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values([insertProject as any]) // Type cast for now - schema validation ensures correctness
      .returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  // Brain dump operations
  async getBrainDump(id: string): Promise<BrainDump | undefined> {
    const [brainDump] = await db.select().from(brainDumps).where(eq(brainDumps.id, id));
    return brainDump || undefined;
  }

  async getBrainDumpsByUser(userId: string): Promise<BrainDump[]> {
    return await db.select().from(brainDumps).where(eq(brainDumps.userId, userId)).orderBy(desc(brainDumps.createdAt));
  }

  async createBrainDump(insertBrainDump: InsertBrainDump): Promise<BrainDump> {
    const [brainDump] = await db
      .insert(brainDumps)
      .values([insertBrainDump as any]) // Type cast for now - schema validation ensures correctness
      .returning();
    return brainDump;
  }

  async searchBrainDumpsByEmbedding(embedding: number[], userId: string, limit = 10): Promise<BrainDump[]> {
    // Get all user's brain dumps with embeddings for similarity comparison
    const userBrainDumps = await db.select()
      .from(brainDumps)
      .where(eq(brainDumps.userId, userId))
      .orderBy(desc(brainDumps.createdAt));

    // Return recent ones for now - vector similarity search will be enhanced when TiDB supports native vector operations
    return userBrainDumps.slice(0, limit);
  }

  // Framework outputs
  async getFrameworkOutput(id: string): Promise<FrameworkOutput | undefined> {
    const [output] = await db.select().from(frameworkOutputs).where(eq(frameworkOutputs.id, id));
    return output || undefined;
  }

  async getFrameworkOutputsByBrainDump(brainDumpId: string): Promise<FrameworkOutput[]> {
    return await db.select()
      .from(frameworkOutputs)
      .where(eq(frameworkOutputs.brainDumpId, brainDumpId))
      .orderBy(desc(frameworkOutputs.createdAt));
  }

  async createFrameworkOutput(insertOutput: InsertFrameworkOutput): Promise<FrameworkOutput> {
    const [output] = await db
      .insert(frameworkOutputs)
      .values([insertOutput as any]) // Type cast for now - schema validation ensures correctness
      .returning();
    return output;
  }

  // Task management
  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.projectId, projectId)).orderBy(desc(tasks.createdAt));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values([insertTask as any]) // Type cast for now - schema validation ensures correctness
      .returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }
}

export const storage = new DatabaseStorage();
