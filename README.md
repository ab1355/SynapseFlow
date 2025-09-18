Synapse

Synapse is an intelligent note-taking and project management application designed for neurodivergent minds. It transforms scattered thoughts into organized action by leveraging a suite of AI-powered agents. Its standout feature is the **"Neurodivergent Superpowers Visualization,"** which provides a real-time dashboard showing how the system turns context-switching into an accelerated source of project completion.

## ✨ Key Features

- **Brain Dump Interface**: Distraction-free input for docs, ideas, and random thoughts.
- **Multi-Framework Views**: The same data is displayed through 5+ different methodology lenses (Agile, Kanban, GTD, PARA, Custom).
- **Energy-State Adaptation**: The UI adapts based on detected focus levels.
- **Vector Semantic Search**: AI-powered similarity matching to find related thoughts and ideas.
- **✨ Neurodivergent Superpowers Visualization**: A real-time dashboard that visually demonstrates how context-switching accelerates progress across multiple projects, turning a common challenge into a celebrated strength.
- **Progress Orchestration**: Cross-project momentum tracking and cascading updates.
- **Pattern Recognition**: Learns and adapts to individual neurodivergent workflow patterns.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (TiDB Serverless recommended)
- OpenAI API key
- **(Optional)** Akash Network API key
- Docker

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
    Create a `.env` file in the `server` directory and add your database and API credentials.

4.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

## 📂 File Processing with `unstructured`

To enable file processing capabilities (e.g., uploading PDFs, Word documents, and images), the application uses a self-hosted instance of the open-source [`unstructured`](https://github.com/Unstructured-IO/unstructured) API. You will need to have Docker installed to run it.

### Running the `unstructured` API

1.  **Install Docker**: If you don't have Docker installed, follow the official instructions for your operating system: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

2.  **Run the `unstructured` container**: Open your terminal and run the following command to start the API server:

    ```bash
    docker run -p 8002:8000 -d --name unstructured-api quay.io/unstructured-io/unstructured-api:latest --port 8000 --host 0.0.0.0
    ```

    This command starts the container, which the application uses to process files locally and privately.

## 🤖 Core Agent Architecture

The backend is powered by a **Vector-Enhanced Agent System**. This dynamic, modular architecture uses AI to understand the semantic meaning of your tasks.

- **`AgentFactory`**: The central coordinator that dynamically routes tasks to the most appropriate agents.
- **`Prompt Warehouse`**: A centralized, database-driven repository for all agent prompts. This allows for dynamic updates, versioning, and management of prompts without requiring code changes, making the agents more flexible and easier to maintain.
- **Vector Embeddings**: Automatically generated for all inputs, enabling semantic search and context-aware analysis.
- **Specialized Agents**: A suite of agents (`Agile`, `Kanban`, `GTD`, `Akash`, etc.) that apply different productivity frameworks. They are now context-aware, using historical data to make smarter recommendations.
- **`ProgressOrchestrator`**: Analyzes outputs to find cross-project momentum opportunities and quantifies the progress gain from semantically related tasks.

### Akash Network Integration

Synapse includes an agent that connects to the **Akash Network**, a decentralized cloud for GPUs. This provides access to powerful, open-source language models in a cost-effective manner.

- **`AkashAgent`**: This agent sends user input to the Akash Chat API for analysis and insights. It is triggered when the `SemanticAgent` detects relevant keywords.
- **Configuration**: To enable this feature, you must add your `AKASH_API_KEY` to the `.env` file in the `server` directory. You can obtain a key from the [Akash Network website](https://akash.network/).

---

This project has completed its core development roadmap, culminating in the "Neurodivergent Superpowers Visualization" feature. For detailed technical history, see `dev.md`.
