# Synapse: Neurodivergent-Adaptive Productivity System

An AI-powered productivity system designed specifically for neurodivergent workflows, built for the TiDB AgentX Hackathon 2025. Synapse transforms chaotic brain dumps into organized, multi-framework project management while generating valuable datasets for neurodivergent productivity research.

## 🧠 Core Innovation

Instead of forcing users into rigid productivity frameworks, Synapse creates **invisible structure** that adapts to how neurodivergent minds actually work - embracing context switching, hyperfocus cycles, and non-linear thinking patterns as productivity superpowers.

## ✨ Key Features

- **Brain Dump Interface**: Distraction-free input for docs, ideas, random thoughts
- **Multi-Framework Views**: Same data displayed through 5+ different methodology lenses (Agile/Kanban/GTD/PARA/Custom)
- **Energy-State Adaptation**: UI changes based on detected focus levels
- **Vector Semantic Search**: AI-powered similarity matching to find related thoughts and ideas
- **Progress Orchestration**: Cross-project momentum tracking and cascading updates
- **Pattern Recognition**: Learning individual neurodivergent workflow patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (TiDB Serverless recommended)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd synapse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Required secrets (managed via Replit or .env)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript and Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight routing

### Backend (Node.js + Express)
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT models for processing
- **Vector Search**: OpenAI embeddings with cosine similarity

### Database (TiDB/PostgreSQL)
- **Vector Search**: Document similarity, idea clustering, pattern matching
- **Multi-Framework Storage**: Parallel data structures for different methodologies
- **Real-Time Analytics**: Productivity metrics, framework effectiveness tracking

## 🤖 AI Agents & Methodology Factory

### Framework Translation Agents
1. **Agile Agent**: User stories, sprints, velocity tracking, backlog management
2. **Kanban Agent**: Board creation, flow optimization, WIP limits, bottleneck analysis
3. **GTD Agent**: Capture → Clarify → Organize → Reflect → Engage cycles
4. **PARA Agent**: Projects → Areas → Resources → Archive categorization
5. **Custom Agent**: Pattern learning, hybrid methodology creation, personalized workflows

## 📊 API Endpoints

- `POST /api/brain-dump` - Process unstructured input with AI agents
- `GET /api/frameworks/{framework_id}` - Retrieve framework-specific view
- `GET /api/brain-dumps/{id}` - Get specific brain dump with framework outputs
- `GET /api/search` - Semantic search across brain dumps and ideas

## 🛠️ Technology Stack

### Core Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (TiDB Serverless), Drizzle ORM
- **AI/ML**: OpenAI GPT models, text-embedding-3-small
- **Dev Tools**: Vite, tsx, ESBuild

### AI & LLM Integration
- **Primary**: OpenAI GPT-4/GPT-3.5-turbo
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector Search**: In-memory cosine similarity (with TiDB vector ops planned)

## 🎯 Project Goals

### Innovation (TiDB AgentX Hackathon)
- First productivity tool designed FOR neurodivergent brains
- Multi-framework dataset generation for academic research
- Context-switching as a productivity feature, not a bug
- Energy-state adaptive interfaces

### Technical Excellence
- Advanced TiDB Vector Search utilization
- Real-time multi-agent coordination
- Complex progress orchestration algorithms
- Sophisticated pattern recognition ML models

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend application
│   ├── lib/                # Business logic and services
│   │   ├── agents.ts       # AI agent implementations
│   │   ├── brain-dump-service.ts  # Core processing service
│   │   └── embeddings.ts   # Vector embedding utilities
│   ├── routes.ts           # API route definitions
│   └── storage.ts          # Database layer
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and types
└── database/               # Database migrations and seeds
```

## 🚀 Deployment

The application is designed for deployment on:
- **Development**: Replit (automatic deployment)
- **Production**: TiDB Serverless + Vercel/similar platforms
- **Scaling**: Horizontal scaling with TiDB's auto-scaling capabilities

## 🔧 Development

See [dev.md](./dev.md) for detailed development information, current progress, and implementation notes.

## 📈 Success Metrics

- User productivity improvement percentages
- Context-switch efficiency gains
- Framework adoption rates
- Dataset quality and research value
- Technical performance benchmarks

## 🏅 License

MIT License - Encouraging community contributions and academic research collaboration.

---

**Built for TiDB AgentX Hackathon 2025**  
*Transforming neurodivergent workflows into productivity superpowers*