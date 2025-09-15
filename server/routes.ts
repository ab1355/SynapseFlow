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

  // Brain Dump API endpoint
  app.post("/api/brain-dump", async (req, res) => {
    try {
      const { input, energyState } = req.body;
      
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

      console.log('Processing brain dump:', { input, energyState });

      // Convert lowercase energy state from frontend to title case for agents
      const energyStateMap: Record<string, UserContext['energyState']> = {
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low',
        'hyperfocus': 'Hyperfocus',
        'scattered': 'Scattered'
      };

      // Create user context for AI agents
      const userContext: UserContext = {
        energyState: energyStateMap[energyState],
        // TODO: Get from user profile in database
        cognitiveType: undefined,
        productivityPatterns: undefined
      };

      // Process input through AI agents using AgentFactory
      const frameworks = AgentFactory.processInput(input, userContext);

      const response = {
        success: true,
        originalInput: input,
        energyState,
        processedAt: new Date().toISOString(),
        frameworks
      };

      res.json(response);
      
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
