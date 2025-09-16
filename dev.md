# Development Roadmap & Technical Documentation

This document outlines the current state of the Synapse project, its architecture, and future development plans. For a general overview, see `README.md`.

## 🚧 Current Status: Vector-Enhanced Agent System Complete

The initial backend architecture has been significantly refactored and enhanced into a modular, scalable, and context-aware multi-agent system. This new structure provides a solid foundation for the advanced vector-based features outlined in the roadmap below.

### Key Achievements

- **Modular Agent Architecture**: The core logic is now managed by a central `AgentFactory` that coordinates multiple specialized agents (`AgileAgent`, `KanbanAgent`, `GTDAgent`).
- **Comprehensive Testing Suite**: The project includes robust E2E and performance benchmark tests to ensure API reliability and speed.
- **Self-Contained Modules**: Each component is fully self-contained, improving code clarity and maintainability.
- **Vector-Powered Intelligence**: The system now leverages vector embeddings to understand the semantic meaning of tasks, enabling intelligent framework selection and context-aware recommendations.

## 🚀 Completed Roadmap: The Vector-Enhanced Agent System

The following phases have been completed, transforming Synapse into a proactive and intelligent productivity assistant.

### Phase 1: Foundational Agents
- **Status**: ✅ Complete
- **Description**: Implemented a full suite of specialized agents (`Agile`, `Kanban`, `GTD`, `PARA`, `Custom`), each providing a unique analytical perspective on user input.

### Phase 2: Auto-Embedding Integration
- **Status**: ✅ Complete
- **Description**: The system now automatically converts every user input into a vector embedding using a background process and stores it in a `task_embeddings` table. This provides the semantic foundation for all subsequent intelligent features.

### Phase 3: Semantic Framework Selection
- **Status**: ✅ Complete
- **Description**: A new `SemanticAgent` was introduced to analyze the vector embedding of a new user input. It performs a similarity search against past tasks to find semantically related work and recommends the most effective frameworks based on historical patterns.

### Phase 4: Dynamic Agent Routing
- **Status**: ✅ Complete
- **Description**: The `AgentFactory` was upgraded to be a dynamic router. Instead of running all agents every time, it now selectively executes only the agents recommended by the `SemanticAgent`, improving efficiency and relevance. The `ProgressOrchestrator` was also made more resilient to handle this dynamic pipeline.

### Phase 5: Context-Aware Agent Parameters
- **Status**: ✅ Complete
- **Description**: The agents are now context-aware. The `AgentFactory` enriches the `UserContext` with the `similarPastTasks` identified by the `SemanticAgent`. This historical data is passed to the framework agents, allowing them to make more informed and personalized decisions (e.g., the `GTDAgent` can now identify recurring patterns in how similar tasks were previously handled).

### Phase 6: Killer Demo Feature - "Neurodivergent Superpowers Visualization"
- **Status**: ✅ Complete
- **Description**: To showcase the system's unique value, a real-time visualization was implemented to demonstrate how context-switching can be a strength. This feature turns a perceived "weakness" into a tangible "superpower."
- **Backend (`ProgressOrchestrator.ts`)**: The `CrossProjectRelation` interface was enhanced with a `progressGain` metric. This quantifies the percentage of progress made on a related task when a semantically similar task is completed. The calculation is based on the number of related tasks and the strength of the semantic link.
- **Frontend (`ProgressRippleViz.tsx`)**: A new, dedicated React component was created to animate and display these "progress ripples." It takes the initial user input and the `crossProjectImpacts` from the API and renders a cascading visualization of how one action creates a wave of progress across the system.
- **Integration (`Home.tsx`)**: The `ProgressRippleViz` component was integrated into the main application page. It is conditionally rendered whenever the API response contains `crossProjectImpacts`, providing immediate, powerful visual feedback that demonstrates the core value proposition of the Synapse system.

### Phase 7: Tier-Based Agent Gating
- **Status**: ✅ Complete
- **Description**: Implemented a tier-based access control system for AI agents to support different pricing plans.
- **Backend (`database/schema.sql`)**: Added a `pricing_tiers` table and updated the `user_profiles` table to include a `tier_id`. This allows for different levels of access and features based on the user's subscription.
- **Backend (`shared/schema.ts`)**: Updated the Drizzle schemas to reflect the database changes, including the new `tier` property on the `users` table.
- **Backend (`server/lib/AgentFactory.ts`)**: Modified the `AgentFactory` to read the user's tier from the `UserContext` and dynamically gate access to agents based on the permissions defined in `TIER_AGENT_ACCESS`. This ensures that users only have access to the agents included in their pricing plan.
