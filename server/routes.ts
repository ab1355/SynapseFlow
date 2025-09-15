import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { healthCheck } from "./lib/tidb";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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

  // Brain Dump API endpoint
  app.post("/api/brain-dump", async (req, res) => {
    try {
      const { input, energyState } = req.body;
      
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ 
          error: "Missing or invalid input field" 
        });
      }

      if (!energyState || !['High', 'Medium', 'Low', 'Hyperfocus', 'Scattered'].includes(energyState)) {
        return res.status(400).json({ 
          error: "Missing or invalid energyState field" 
        });
      }

      console.log('Processing brain dump:', { input, energyState });

      // Mock AI processing - transform input into different framework formats
      const response = {
        success: true,
        originalInput: input,
        energyState,
        processedAt: new Date().toISOString(),
        frameworks: {
          agile: {
            userStories: [
              {
                id: "story-1",
                title: `As a user, I want to ${input.substring(0, 50)}...`,
                description: `Based on your ${energyState.toLowerCase()} energy state, here's how we can structure this as actionable work.`,
                priority: energyState === 'High' ? 'high' : energyState === 'Low' ? 'low' : 'medium',
                storyPoints: energyState === 'Hyperfocus' ? 8 : energyState === 'High' ? 5 : 3
              }
            ]
          },
          kanban: {
            columns: {
              todo: [{
                id: "task-1", 
                title: input.split('.')[0] || input.substring(0, 30),
                description: `Organized from your ${energyState.toLowerCase()} energy brain dump`
              }],
              inProgress: [],
              done: []
            }
          },
          gtd: {
            actions: [
              {
                id: "action-1",
                title: `Process: ${input.substring(0, 40)}...`,
                context: energyState === 'Hyperfocus' ? '@deep-work' : '@computer',
                energyRequired: energyState,
                timeEstimate: energyState === 'Low' ? '15-30 min' : '30-60 min'
              }
            ]
          },
          para: {
            classification: {
              type: energyState === 'Hyperfocus' ? 'Project' : 'Area',
              category: 'Personal Development',
              actionable: true,
              item: {
                title: input.split('.')[0] || `Brain dump from ${energyState.toLowerCase()} state`,
                description: input
              }
            }
          },
          custom: {
            energyOptimized: {
              recommendedTime: energyState === 'Hyperfocus' ? 'Next 2-4 hours' : 
                             energyState === 'High' ? 'Next 1-2 hours' :
                             energyState === 'Low' ? 'When energy rises' : 'Today',
              breakdownStrategy: energyState === 'Scattered' ? 'micro-tasks' : 
                               energyState === 'Low' ? 'gentle-steps' : 'focused-blocks',
              cognitiveLoad: energyState === 'Hyperfocus' ? 'high' : 
                           energyState === 'Scattered' ? 'minimal' : 'moderate'
            }
          }
        }
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
