# Synapse

Synapse is an intelligent note-taking and project management application designed for neurodivergent minds. It leverages multiple productivity frameworks and AI-powered analysis to create a personalized, adaptive, and momentum-driven workflow.

## ✨ Key Features

- **Brain Dump Interface**: Distraction-free input for docs, ideas, random thoughts
- **Multi-Framework Views**: Same data displayed through 5+ different methodology lenses (Agile/Kanban/GTD/PARA/Custom)
- **Energy-State Adaptation**: UI changes based on detected focus levels
- **Vector Semantic Search**: AI-powered similarity matching to find related thoughts and ideas
- **Progress Orchestration**: Cross-project momentum tracking and cascading updates
- **Pattern Recognition**: Learning individual neurodivergent workflow patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (TiDB Serverless recommended)
- OpenAI API key

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd synapse
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the `server` directory and add your database and OpenAI credentials.

4.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

### Testing

The project includes both end-to-end (E2E) and performance benchmark tests to ensure reliability and speed.

1.  **E2E Tests**: These tests validate the `/api/brain-dump` endpoint using realistic inputs.
    - **Prerequisite**: Ensure the development server is running.
    - **Command**:
      ```bash
      npm test server/tests/e2e/brainDump.test.ts
      ```

2.  **Performance Benchmarks**: These tests measure the processing time of the core agent factory across a range of inputs.
    - **Command**:
      ```bash
      npm test server/lib/performance/AgentBenchmark.ts
      ```

## 🤖 Core Agent Architecture

The backend is powered by a modular, multi-agent system designed for comprehensive analysis.

- **InputParser**: Deterministically analyzes raw text into structured tasks, ideas, and concerns.
- **Specialized Agents**:
    - `AgileAgent`: Converts inputs into user stories and epics.
    - `KanbanAgent`: Creates adaptive Kanban boards based on user context.
    - `GTDAgent`: Organizes items into "Next Actions", "Projects", and other GTD contexts.
- **ProgressOrchestrator**: Analyzes the outputs from all agents to identify cross-framework momentum opportunities and ripple effects.
- **AgentFactory**: The central entry point that manages the entire workflow, from parsing input to orchestrating the final response.

---

This project is a work in progress. For detailed development status, see `dev.md`.
