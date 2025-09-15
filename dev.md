# Development Roadmap & Technical Documentation

This document outlines the current state of the Synapse project, its architecture, and future development plans. For a general overview, see `README.md`.

## 🚧 Current Status: Backend Refactoring Complete

The initial backend architecture has been significantly refactored into a modular, scalable, and testable multi-agent system. This new structure provides a solid foundation for the advanced vector-based features outlined in the roadmap below.

### Key Achievements

- **Modular Agent Architecture**: The core logic is now managed by a central `AgentFactory` that coordinates multiple specialized agents (`AgileAgent`, `KanbanAgent`, `GTDAgent`).
- **Comprehensive Testing Suite**: The project includes robust E2E and performance benchmark tests to ensure API reliability and speed.
- **Self-Contained Modules**: Each component is fully self-contained, improving code clarity and maintainability.

## 🏛️ New Backend Architecture

The backend processing pipeline is orchestrated by the `AgentFactory` and consists of several key modules:

- **`InputParser`**: Deterministically parses raw text into structured tasks, ideas, concerns, and projects.
- **Specialized Agents**: Each agent (`Agile`, `Kanban`, `GTD`) applies a specific productivity framework to the parsed input.
- **`ProgressOrchestrator`**: Analyzes the outputs from all agents to find cross-framework momentum opportunities.
- **`AgentFactory`**: The central coordinator that manages the entire workflow.

## 🧪 Testing

The architecture is supported by a robust testing framework:

- **End-to-End (E2E) Tests**: Validate the functionality of the primary `/api/brain-dump` endpoint.
- **Performance Benchmarks**: Measure and track the performance of the core `AgentFactory`.

## 🚀 Future Roadmap: The Vector-Enhanced Agent System

The next major evolution of Synapse is to transform the current modular system into a **Vector-Enhanced Agent System**. This will enable the application to understand the semantic meaning behind tasks, learn user patterns, and proactively suggest optimal workflows.

This will be achieved by integrating a vector database (leveraging TiDB with `vector<float>(1536)`) and enhancing each agent with new capabilities.

```typescript
interface VectorEnhancedAgent {
  // Your existing modular agents
  processInput(input: string): FrameworkOutput;
  
  // NEW: Vector-enhanced capabilities
  findSimilarTasks(embedding: vector): TaskMatch[];
  storeSuccessPattern(pattern: FrameworkPattern): void;
  suggestOptimalFramework(context: vector): FrameworkRecommendation;
}
```

### Phase 1: Foundational Enhancements & Vector Table Setup

This phase involves critical backend and frontend work to support the vector-powered features.

- **Database Integration**: Connect the backend to the PostgreSQL database (TiDB Serverless) to persist user data, which is a prerequisite for storing vector embeddings.
- **Vector Table Setup**: Create the core database tables required for semantic analysis:
    - `task_embeddings`: Stores vector representations of all tasks and ideas to find similar past work.
    - `framework_pattern_embeddings`: Stores vectors of successful framework combinations (e.g., the vector for "organizing a complex project" might map to a successful GTD+Agile pattern).
    - `energy_state_context_vectors`: Stores vectors representing different user contexts (e.g., 'low energy', 'hyperfocus').
- **Frontend Development**: Begin building the UI components to visualize the rich data from the existing backend, creating the canvas for future vector-powered features.
- **Implement Missing Agents**: Complete the `PARAAgent.ts` and `CustomAgent.ts` to round out the full suite of framework agents.

### Phase 2: Auto-Embedding Integration

In this phase, we will leverage the database to automatically create vector embeddings from user input without manual management.

- **TiDB Auto-Embedding**: Configure the database to automatically generate vector embeddings for all new "chaotic brain dumps" using a built-in model (e.g., OpenAI's `text-embedding-3-small`). This is the engine that will power all subsequent semantic features.
- **Real-time Updates**: Implement WebSocket or a similar technology to enable live, real-time communication between the frontend and backend as embeddings are generated and analyzed.

### Phase 3: Semantic Framework Selection

This phase leverages the vector embeddings to make the system proactive and intelligent.

- **Intelligent Suggestions**: When a user enters a new brain dump, the system will perform a vector search on the `framework_pattern_embeddings` table to find the most successful framework combinations used for similar contexts in the past.
- **Example Workflow**:
    1. **User Input**: "I need to organize my scattered thoughts about the quarterly review and plan the next steps."
    2. **Vector Search**: The system performs a similarity search and finds that, for past "review and plan" type tasks, the user was most effective when using a **GTD + PARA** combination.
    3. **Recommendation**: The UI auto-suggests this optimal framework mix, reducing cognitive load for the user.

### Phase 4: Cross-Project Momentum Vectors

This is the ultimate goal: using vector search to create a truly emergent understanding of a user's entire project ecosystem.

- **Semantic Relationship Mapping**: The system will understand that tasks like "fix login bug," "implement 2FA," and "update auth docs" are all semantically related to the concept of "authentication," even if they are in different projects (Agile, GTD, etc.).
- **Vector-Powered Orchestration**: The `ProgressOrchestrator` will be upgraded to use these semantic vectors. Completing one task will allow the system to identify and surface other, seemingly unrelated tasks that are now easier to complete due to shared cognitive context.
- **Example Workflow**:
    1. **User completes task**: "Implement JWT authentication for the public API."
    2. **Vector Analysis**: The system analyzes the vector for this task and finds strong semantic relationships to tasks in other frameworks, such as a Kanban card for "Secure mobile app endpoints" and a GTD action for "Draft security section of user manual."
    3. **Momentum Surfacing**: The UI then highlights these related tasks, indicating that working on them now would be highly efficient, thereby advancing 3 other projects at once.
