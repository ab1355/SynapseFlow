import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export type EnergyState = "low" | "medium" | "high" | "hyperfocus" | "scattered";
export type FrameworkType = "agile" | "kanban" | "gtd" | "para" | "custom";

export const brainDumps = pgTable("brain_dumps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  energyState: text("energy_state").$type<EnergyState>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedData: jsonb("processed_data"), // AI-processed framework data
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brainDumpId: varchar("brain_dump_id").references(() => brainDumps.id),
  title: text("title").notNull(),
  description: text("description"),
  framework: text("framework").$type<FrameworkType>().notNull(),
  frameworkData: jsonb("framework_data"), // framework-specific metadata
  completed: text("completed").default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBrainDumpSchema = createInsertSchema(brainDumps).pick({
  content: true,
  energyState: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  brainDumpId: true,
  title: true,
  description: true,
  framework: true,
  frameworkData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBrainDump = z.infer<typeof insertBrainDumpSchema>;
export type BrainDump = typeof brainDumps.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;