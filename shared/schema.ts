import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced user profiles for neurodivergent productivity tracking
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  cognitiveType: text("cognitive_type").$type<'ADHD' | 'ASD' | 'MIXED' | 'NEUROTYPICAL'>(),
  productivityPatterns: jsonb("productivity_patterns"), // Learning patterns over time
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tier: text("tier").$type<'free' | 'pro' | 'enterprise'>().default('free'),
});

export type EnergyState = "low" | "medium" | "high" | "hyperfocus" | "scattered";
export type FrameworkType = "agile" | "kanban" | "gtd" | "para" | "custom";
export type ProjectStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

// Projects for organizing brain dumps and tasks
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  embedding: jsonb("embedding"), // Vector embedding as JSON array for now
  status: text("status").$type<ProjectStatus>().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brain dump sessions with vector embeddings for semantic search
export const brainDumps = pgTable("brain_dumps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id),
  content: text("content").notNull(),
  embedding: jsonb("embedding"), // Vector embedding as JSON array
  energyState: text("energy_state").$type<EnergyState>().notNull(),
  processingTime: integer("processing_time"), // milliseconds for performance tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Multi-framework AI agent outputs
export const frameworkOutputs = pgTable("framework_outputs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brainDumpId: varchar("brain_dump_id").references(() => brainDumps.id).notNull(),
  framework: text("framework").$type<FrameworkType>().notNull(),
  agentOutput: jsonb("agent_output").notNull(), // Full agent response data
  effectivenessScore: decimal("effectiveness_score"), // User feedback on usefulness
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks extracted from brain dumps and framework outputs
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id),
  brainDumpId: varchar("brain_dump_id").references(() => brainDumps.id),
  frameworkOutputId: varchar("framework_output_id").references(() => frameworkOutputs.id),
  title: text("title").notNull(),
  description: text("description"),
  framework: text("framework").$type<FrameworkType>().notNull(),
  frameworkData: jsonb("framework_data"), // framework-specific metadata
  embedding: jsonb("embedding"), // Vector embedding for task similarity
  completed: boolean("completed").default(false),
  energyRequired: text("energy_required").$type<EnergyState>(),
  estimatedMinutes: integer("estimated_minutes"),
  actualMinutes: integer("actual_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Cross-project relationships for momentum tracking
export const projectRelationships = pgTable("project_relationships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceProjectId: varchar("source_project_id").references(() => projects.id).notNull(),
  targetProjectId: varchar("target_project_id").references(() => projects.id).notNull(),
  relationshipType: text("relationship_type").$type<'BLOCKS' | 'ENABLES' | 'SIMILAR' | 'COMPETES'>().notNull(),
  strength: decimal("strength"), // 0.0 to 1.0 relationship strength
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Productivity metrics for neurodivergent research
export const productivityMetrics = pgTable("productivity_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  energyState: text("energy_state").$type<EnergyState>().notNull(),
  tasksCompleted: integer("tasks_completed").default(0),
  contextSwitches: integer("context_switches").default(0),
  hyperfocusMinutes: integer("hyperfocus_minutes").default(0),
  frameworkEffectiveness: jsonb("framework_effectiveness"), // Which frameworks worked best
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  cognitiveType: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  title: true,
  description: true,
  status: true,
});

export const insertBrainDumpSchema = createInsertSchema(brainDumps).pick({
  userId: true,
  projectId: true,
  content: true,
  energyState: true,
});

export const insertFrameworkOutputSchema = createInsertSchema(frameworkOutputs).pick({
  brainDumpId: true,
  framework: true,
  agentOutput: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  projectId: true,
  brainDumpId: true,
  frameworkOutputId: true,
  title: true,
  description: true,
  framework: true,
  frameworkData: true,
  energyRequired: true,
  estimatedMinutes: true,
});

export const insertProjectRelationshipSchema = createInsertSchema(projectRelationships).pick({
  sourceProjectId: true,
  targetProjectId: true,
  relationshipType: true,
  strength: true,
});

export const insertProductivityMetricSchema = createInsertSchema(productivityMetrics).pick({
  userId: true,
  date: true,
  energyState: true,
  tasksCompleted: true,
  contextSwitches: true,
  hyperfocusMinutes: true,
  frameworkEffectiveness: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertBrainDump = z.infer<typeof insertBrainDumpSchema>;
export type BrainDump = typeof brainDumps.$inferSelect;

export type InsertFrameworkOutput = z.infer<typeof insertFrameworkOutputSchema>;
export type FrameworkOutput = typeof frameworkOutputs.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertProjectRelationship = z.infer<typeof insertProjectRelationshipSchema>;
export type ProjectRelationship = typeof projectRelationships.$inferSelect;

export type InsertProductivityMetric = z.infer<typeof insertProductivityMetricSchema>;
export type ProductivityMetric = typeof productivityMetrics.$inferSelect;
