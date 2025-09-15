import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { healthCheck, initializeSchema } from "./lib/tidb";
import { AgentFactory, type UserContext } from "./lib/agents";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  console.log('Registering API routes...');

  // TiDB Health Check endpoint
  app.get("/api/tidb/health", async (req, res) => {
    try {
      const healthStatus = await healthCheck();
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // TiDB Schema Initialization endpoint
  app.post("/api/tidb/init-schema", async (req, res) => {
    console.log('POST /api/tidb/init-schema called');
    try {
      const result = await initializeSchema();
      console.log('Schema initialization result:', result);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Schema initialization error:', error);
      res.status(500).json({
        success: false,
        message: 'Schema initialization failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Brain Dump API endpoint with full TiDB integration
  app.post("/api/brain-dump", async (req, res) => {
    try {
      const { input, energyState, userId = 'demo-user', projectId } = req.body;
      
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ 
          error: "Missing or invalid input field" 
        });
      }

      if (!energyState || !['high', 'medium', 'low', 'hyperfocus', 'scattered'].includes(energyState)) {
        return res.status(400).json({ 
          error: "Missing or invalid energyState field" 
        });
      }

      console.log('Processing brain dump with TiDB integration:', { input, energyState, userId });

      // Import brain dump service
      const { brainDumpService } = await import('./lib/brain-dump-service');

      // Process brain dump with full database persistence and vector embeddings
      const result = await brainDumpService.processBrainDump({
        input,
        energyState,
        userId,
        projectId
      });

      res.json(result);
      
    } catch (error) {
      console.error('Brain dump processing error:', error);
      res.status(500).json({ 
        error: "Failed to process brain dump",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
