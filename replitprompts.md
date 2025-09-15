PROMPT 2: Brain Dump Interface
Create components/BrainDumpInput.tsx - a React component with: 1) Energy state selector buttons (High, Medium, Low, Hyperfocus, Scattered) 2) Large textarea that changes placeholder based on energy state 3) Submit button that calls /api/brain-dump 4) Tailwind styling that's neurodivergent-friendly (minimal, calm colors) 5) State management for input and energy level
PROMPT 3: TiDB Connection
Create lib/tidb.ts with MySQL connection to TiDB Serverless. Include: connection setup using environment variables (TIDB_HOST, TIDB_USER, TIDB_PASSWORD, TIDB_DATABASE), vectorSearch function for cosine similarity, fullTextSearch function, and basic CRUD operations for users, projects, tasks tables. Use mysql2/promise library.
PROMPT 4: Database Schema
Create database/schema.sql for TiDB with these tables: user_profiles (user_id, email, cognitive_type ENUM, productivity_patterns JSON), projects (project_id, user_id, title, description, project_embedding VECTOR(1536)), tasks (task_id, project_id, title, status ENUM, energy_required ENUM, hyperfocus_suitable BOOLEAN, task_embedding VECTOR(1536)). Include proper indexes and foreign keys.
PROMPT 5: API Routes
Create app/api/brain-dump/route.ts that: 1) Accepts POST with input text and energy state 2) Processes through mock AI agents (agile, kanban, gtd, para, custom) 3) Returns JSON with multi-framework responses 4) For now use hardcoded responses that transform the input into different methodology formats 5) Include error handling and TypeScript types
PROMPT 6: Framework Switcher
Create components/FrameworkSwitcher.tsx with: 1) Tab navigation for Agile/Kanban/GTD/PARA/Custom frameworks 2) Each tab shows different view of same data 3) Use Radix UI tabs and framer-motion animations 4) Props to accept multi-framework response data 5) Responsive design with framework icons and colors
PROMPT 7: AI Agent System
Create lib/agents.ts with AgentFactory class that has: processInput method taking (input: string, userContext: object), mock implementations for AgileAgent.process(), KanbanAgent.process(), GTDAgent.process(), PARAAgent.process(), CustomAgent.process() - each returning structured data for their methodology. Include TypeScript interfaces for each response type.
PROMPT 8: Main Dashboard
Update src/app/page.tsx to be main dashboard with: 1) Welcome section explaining the neurodivergent-adaptive approach 2) Quick energy state indicator 3) Recent projects preview 4) "Start Brain Dump" CTA button linking to /brain-dump 5) Stats cards showing framework effectiveness 6) Responsive layout with Tailwind
PROMPT 9: Progress Orchestration
Create components/ProgressOrchestrator.tsx that shows: 1) "Momentum Amplification" section 2) Animated cards showing how current work affects other projects 3) Progress metrics (projects advanced, tasks unblocked) 4) Achievement summary with motivational messaging 5) Use framer-motion for ripple effect animations
PROMPT 10: Types and Interfaces
Create comprehensive TypeScript types in types/ folder: user.ts (UserProfile, EnergyState enums), projects.ts (Project, Task interfaces), frameworks.ts (AgileResponse, KanbanResponse, GTDResponse, PARAResponse, CustomResponse interfaces), api.ts (request/response types for all endpoints). Include proper typing for TiDB vector operations.