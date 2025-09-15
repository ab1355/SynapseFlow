# Development Roadmap & Technical Documentation

This document outlines the current state of the Synapse project, its architecture, and future development plans. For a general overview, see `README.md`.

## 🚧 Current Status: Backend Refactoring Complete

The initial backend architecture has been significantly refactored into a modular, scalable, and testable multi-agent system. This new structure provides a solid foundation for future feature development.

### Key Achievements

- **Modular Agent Architecture**: The core logic has been broken down into specialized, single-responsibility agents, managed by a central `AgentFactory`.
- **Comprehensive Testing Suite**: New E2E and performance benchmark tests have been introduced to ensure API reliability and measure processing speed.
- **Self-Contained Modules**: Each agent and utility is now fully self-contained with its own interfaces and mock implementations, improving code clarity and maintainability.

## 🏛️ New Backend Architecture

The backend processing pipeline is orchestrated by the `AgentFactory` and consists of several key modules:

1.  **`InputParser`**: (`server/lib/InputParser.ts`)
    - **Role**: The first point of contact for raw user input.
    - **Function**: Deterministically parses unstructured text into a structured format (`ParsedInput`), identifying tasks, ideas, concerns, and projects.

2.  **Specialized Agents**: (`server/lib/agents/`)
    - **Role**: Each agent applies a specific productivity framework to the parsed input.
    - **Agents**:
        - `AgileAgent.ts`: Generates Agile artifacts like user stories and epics.
        - `KanbanAgent.ts`: Creates a dynamic Kanban board with adaptive columns and WIP limits.
        - `GTDAgent.ts`: Organizes tasks according to the "Getting Things Done" methodology (Next Actions, Projects, etc.).

3.  **`ProgressOrchestrator`**: (`server/lib/ProgressOrchestrator.ts`)
    - **Role**: The meta-analysis layer.
    - **Function**: Analyzes the outputs from all individual agents to find hidden connections, momentum opportunities, and potential ripple effects across different frameworks.

4.  **`AgentFactory`**: (`server/lib/AgentFactory.ts`)
    - **Role**: The central coordinator of the entire process.
    - **Function**: Manages the flow of data from the initial input parsing, through the parallel processing of all agents, to the final orchestration of the combined results.

## 🧪 Testing

The new architecture is supported by a robust testing framework to ensure code quality and performance.

1.  **End-to-End (E2E) Tests**: (`server/tests/e2e/brainDump.test.ts`)
    - **Purpose**: To validate the functionality of the primary `/api/brain-dump` endpoint from an external perspective.
    - **Methodology**: Uses `supertest` to send real HTTP requests to a running server instance, testing both valid and invalid request payloads.
    - **How to Run**: `npm test server/tests/e2e/brainDump.test.ts` (requires a running dev server).

2.  **Performance Benchmarks**: (`server/lib/performance/AgentBenchmark.ts`)
    - **Purpose**: To measure and track the performance of the core `AgentFactory` and its constituent agents.
    - **Methodology**: Runs a series of predefined, realistic inputs through the factory and records the average, maximum, and minimum processing times.
    - **How to Run**: `npm test server/lib/performance/AgentBenchmark.ts`.

## ⏭️ Next Steps

With the backend refactoring complete, the focus now shifts to the frontend and further backend enhancements:

- **Frontend Development**: Begin building out the user interface components to visualize the rich data provided by the new backend.
- **Implement Missing Agents**: Create the `PARAAgent.ts` and `CustomAgent.ts` to complete the set of framework agents.
- **Database Integration**: Connect the backend to the PostgreSQL database to persist user data.
- **Real-time Updates**: Implement WebSocket or similar technology for live updates between the frontend and backend.
- **Vector Search**: Integrate the OpenAI API for semantic search capabilities.
