# Synapse

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

## 💰 Pricing

Synapse offers a range of pricing plans to fit your needs, from individual use to large teams.

| Plan                 | Price      | Features                                                                                                                                                             |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SYNAPSE STARTER**  | $19/month  | ✅ 500 tasks/month<br/>✅ All framework agents<br/>✅ Progress orchestration<br/>✅ Basic analytics<br/>✅ Email support                                                       |
| **SYNAPSE PRO**      | $49/month  | ✅ 2,500 tasks/month<br/>✅ Advanced neurodivergent features<br/>✅ Progress ripple visualization<br/>✅ Energy state detection<br/>✅ Priority support                      |
| **SYNAPSE ENTERPRISE** | $199/month | ✅ Unlimited tasks<br/>✅ Team collaboration<br/>✅ Custom frameworks<br/>✅ Analytics dashboard<br/>✅ White-label options<br/>✅ Dedicated support                        |

## 🤖 Core Agent Architecture

The backend is powered by a **Vector-Enhanced Agent System**. This dynamic, modular architecture uses AI to understand the semantic meaning of your tasks.

- **`AgentFactory`**: The central coordinator that dynamically routes tasks to the most appropriate agents.
- **Vector Embeddings**: Automatically generated for all inputs, enabling semantic search and context-aware analysis.
- **Specialized Agents**: A suite of agents (`Agile`, `Kanban`, `GTD`, etc.) that apply different productivity frameworks. They are now context-aware, using historical data to make smarter recommendations.
- **`ProgressOrchestrator`**: Analyzes outputs to find cross-project momentum opportunities and quantifies the progress gain from semantically related tasks.

---

This project has completed its core development roadmap, culminating in the "Neurodivergent Superpowers Visualization" feature. For detailed technical history, see `dev.md`.
