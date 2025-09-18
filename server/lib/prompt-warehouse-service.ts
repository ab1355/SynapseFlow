
import { query } from './db';
import fs from 'fs/promises';
import path from 'path';

export const seedPrompts = async () => {
  try {
    console.log("Seeding database from schema.sql...");

    const sqlFilePath = path.join(process.cwd(), 'database/schema.sql');
    const sql = await fs.readFile(sqlFilePath, 'utf-8');

    // Split the SQL file into individual statements
    const statements = sql.split(/;\s*\n/).filter(statement => statement.trim() !== "");

    for (const statement of statements) {
      // Skip comments
      if (statement.startsWith('--')) {
        continue;
      }
      await query(statement, []);
    }

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};
