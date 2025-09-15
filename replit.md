Project Overview An AI-powered productivity system designed specifically for neurodivergent workflows, built for the TiDB AgentX Hackathon 2025. This application transforms chaotic brain dumps into organized, multi-framework project management while generating valuable datasets for neurodivergent productivity research. ## 🧠 Core Innovation Instead of forcing users into rigid productivity frameworks, 371 AgentX creates **invisible structure** that adapts to how neurodivergent minds actually work - embracing context switching, hyperfocus cycles, and non-linear thinking patterns as productivity superpowers. ## 🏗️ Architecture ### Frontend (Next.js 14) - **Brain Dump Interface**: Distraction-free input for docs, ideas, random thoughts - **Multi-Framework Views**: Same data displayed through 5+ different methodology lenses - **Energy-State Adaptation**: UI changes based on detected focus levels - **Context-Switch Optimizer**: Momentum preservation across task transitions ### Backend (FastAPI) - **Input Processing Engine**: NLP analysis of unstructured thoughts/documents - **Multi-Agent Framework Translation**: Simultaneous conversion to Agile/Kanban/GTD/PARA/Custom methodologies - **Progress Orchestration**: Cross-project momentum tracking and cascading updates - **Pattern Recognition**: Learning individual neurodivergent workflow patterns ### Database (TiDB Serverless) - **Vector Search**: Document similarity, idea clustering, pattern matching - **Full-Text Indexing**: Methodology pattern discovery, context retrieval - **Real-Time Analytics**: Productivity metrics, framework effectiveness tracking - **Multi-Framework Storage**: Parallel data structures for different methodologies ## 🤖 AI Agents & Methodology Factory ### Framework Translation Agents 1. **Agile Agent**: User stories, sprints, velocity tracking, backlog management 2. **Kanban Agent**: Board creation, flow optimization, WIP limits, bottleneck analysis 3. **GTD Agent**: Capture → Clarify → Organize → Reflect → Engage cycles 4. **PARA Agent**: Projects → Areas → Resources → Archive categorization 5. **Custom Agent**: Pattern learning, hybrid methodology creation, personalized workflows ### Prompt Warehouse System - Centralized repository of business-specific prompts - Context-aware prompt retrieval for different workflow states - A/B testing framework for prompt effectiveness - Version control and performance analytics ## 🔧 LLM Provider Configuration

Synapse supports multiple LLM providers to ensure flexibility, redundancy, and optimal performance for different cognitive processing needs. Each provider offers unique strengths for neurodivergent productivity workflows.

### Supported Providers

#### 1. OpenAI (Primary - Integrated)
- **Models**: GPT-5, GPT-4o, GPT-4, GPT-3.5-turbo
- **Integration**: Native Replit blueprint (`blueprint:javascript_openai`)
- **Strengths**: Superior reasoning, structured output, function calling
- **Use Cases**: Complex brain dump processing, multi-framework translation, progress orchestration
- **Configuration**: Automatic secret management via `OPENAI_API_KEY`

#### 2. Anthropic Claude (Secondary - Integrated) 
- **Models**: Claude-3.5-Sonnet, Claude-3-Opus, Claude-3-Haiku
- **Integration**: Native Replit blueprint (`blueprint:javascript_anthropic`)
- **Strengths**: Long context windows, safety, nuanced understanding
- **Use Cases**: Detailed task analysis, context preservation, pattern recognition
- **Configuration**: Automatic secret management via `ANTHROPIC_API_KEY`

#### 3. Google Gemini (Multimodal - Integrated)
- **Models**: Gemini-1.5-Pro, Gemini-1.5-Flash, Gemini-Pro
- **Integration**: Native Replit blueprint (`blueprint:javascript_gemini`) 
- **Strengths**: Multimodal capabilities, Google integration, real-time data
- **Use Cases**: Document analysis, image processing, calendar integration
- **Configuration**: Automatic secret management via `GOOGLE_API_KEY`

#### 4. Ollama (Local/Self-hosted)
- **Models**: Llama-3.1, Mistral, CodeLlama, Phi-3
- **Integration**: Manual configuration via REST API
- **Strengths**: Privacy, offline capability, cost-effective
- **Use Cases**: Sensitive data processing, local development, custom fine-tuned models
- **Configuration**: 
  ```javascript
  const ollama = {
    baseURL: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.1:8b'
  };
  ```

#### 5. OpenRouter (Aggregator)
- **Models**: Access to 100+ models via unified API
- **Integration**: Manual configuration via REST API
- **Strengths**: Model diversity, cost optimization, fallback options
- **Use Cases**: A/B testing different models, cost-optimized processing, specialized tasks
- **Configuration**:
  ```javascript
  const openrouter = {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4'
  };
  ```

#### 6. Requesty (API Management)
- **Purpose**: API request optimization and monitoring
- **Integration**: Wrapper around existing LLM providers
- **Strengths**: Request queuing, retry logic, performance analytics
- **Use Cases**: Rate limiting, request optimization, provider switching
- **Configuration**:
  ```javascript
  const requesty = {
    apiKey: process.env.REQUESTY_API_KEY,
    endpoint: 'https://api.requesty.io',
    features: ['rate-limiting', 'retry-logic', 'analytics']
  };
  ```

### Provider Selection Strategy

#### Intelligent Routing
- **High-Energy Tasks**: OpenAI GPT-5 for complex reasoning
- **Context-Heavy Tasks**: Anthropic Claude for long context processing
- **Multimodal Tasks**: Google Gemini for image/document analysis
- **Privacy-Sensitive**: Ollama for local processing
- **Cost-Optimization**: OpenRouter for model arbitrage
- **Request Management**: Requesty for optimization layer

#### Fallback Chain
```javascript
const providerChain = [
  'openai',      // Primary: Best performance
  'anthropic',   // Secondary: Reliability
  'gemini',      // Tertiary: Multimodal backup
  'openrouter',  // Quaternary: Alternative models
  'ollama'       // Local fallback: Always available
];
```

#### Energy-State Adaptation
- **Hyperfocus**: Single best model (OpenAI GPT-5)
- **High Energy**: Parallel processing across multiple providers
- **Medium Energy**: Primary + one backup
- **Low Energy**: Fastest response (Gemini Flash or local Ollama)
- **Scattered**: Context-preserving models (Claude for memory)

### Configuration Management

#### Environment Variables
```bash
# Primary Providers (Replit-managed)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AI...

# Secondary Providers (Manual)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4
REQUESTY_API_KEY=req_...
```

#### Dynamic Provider Selection
```javascript
export const selectProvider = (task: ProcessingTask) => {
  const { energyState, contextSize, privacy, budget } = task;
  
  if (privacy === 'high') return 'ollama';
  if (contextSize > 100000) return 'anthropic';
  if (budget === 'low') return 'openrouter';
  if (energyState === 'hyperfocus') return 'openai';
  
  return 'openai'; // Default
};
```

### Performance Monitoring

#### Provider Analytics
- Response times per provider
- Success rates and error handling
- Cost per token across providers
- User satisfaction by provider choice
- Energy-state correlation with provider effectiveness

#### Neurodivergent Optimization
- Track which providers work best for different cognitive states
- Optimize provider selection based on individual user patterns
- A/B testing for provider effectiveness in different scenarios
- Real-time switching based on user feedback and performance metrics

## 📊 Dataset Generation & Research Value ### Multi-Framework Effectiveness Data - Comparative analysis of methodology performance for neurodivergent users - Context-switching productivity metrics - Hyperfocus cycle optimization patterns - Energy-state correlation with task completion rates ### Neurodivergent Productivity Insights - ADHD workflow pattern analysis - Autism-friendly interface adaptations - Executive dysfunction mitigation strategies - Sensory processing considerations in UI/UX design ## 🛠️ Technical Implementation ### TiDB Integration Points ```sql -- Vector search for related ideas SELECT content, COSINE_DISTANCE(embedding, ?) as similarity FROM documents ORDER BY similarity ASC LIMIT 10; -- Multi-framework progress tracking SELECT framework_type, completion_rate, last_updated FROM project_views WHERE user_id = ? AND project_id = ?; -- Cross-project momentum analysis SELECT related_projects, momentum_score FROM project_relationships WHERE source_project = ?; ``` ### API Endpoints - `POST /brain-dump` - Process unstructured input - `GET /frameworks/{framework_id}` - Retrieve framework-specific view - `PUT /context-switch` - Handle task transition with momentum preservation - `GET /energy-suggestions` - AI-powered task recommendations based on current state - `POST /progress-ripple` - Trigger cascading updates across related projects ### Real-Time Features - WebSocket connections for live framework updates - Server-sent events for progress notifications - Real-time collaboration on shared projects - Live energy-state detection and adaptation ## 🎮 User Experience Flow ### 1. Brain Dump Phase User enters stream-of-consciousness thoughts, documents, or random ideas without any categorization pressure. ### 2. Invisible Processing AI agents simultaneously analyze input and create structured representations across multiple frameworks. ### 3. Contextual Work Selection Based on energy levels, time available, and cognitive state, system suggests optimal tasks. ### 4. Momentum Preservation When switching contexts, progress ripples across all related work items automatically. ### 5. Adaptive Learning System learns user patterns and continuously optimizes methodology effectiveness. ## 🏆 Hackathon Differentiators ### Innovation (25 points) - **First productivity tool designed FOR neurodivergent brains** - **Multi-framework dataset generation for academic research** - **Context-switching as a productivity feature, not a bug** - **Energy-state adaptive interfaces** ### Technical Implementation (35 points) - **Advanced TiDB Vector Search utilization** - **Real-time multi-agent coordination** - **Complex progress orchestration algorithms** - **Sophisticated pattern recognition ML models** ### User Experience (20 points) - **Intuitive brain-dump interface** - **Seamless framework transitions** - **Personalized energy-state adaptations** - **Gamified progress visualization** ## 📁 Project Structure ``` ├── frontend/ # Next.js 14 application │ ├── components/ │ │ ├── BrainDumpInput/ │ │ ├── FrameworkViews/ │ │ ├── ProgressOrchestrator/ │ │ └── EnergyStateAdapter/ │ ├── pages/ │ └── styles/ ├── backend/ # FastAPI application │ ├── agents/ │ │ ├── agile_agent.py │ │ ├── kanban_agent.py │ │ ├── gtd_agent.py │ │ ├── para_agent.py │ │ └── custom_agent.py │ ├── services/ │ │ ├── tidb_service.py │ │ ├── nlp_service.py │ │ └── orchestration_service.py │ └── api/ ├── database/ # TiDB schema and migrations ├── prompts/ # Prompt warehouse ├── docs/ # Documentation └── tests/ # Test suites ``` ## 🚀 Deployment Strategy - **Development**: Replit Agent 3 for rapid prototyping - **Production**: TiDB Serverless + Vercel deployment - **Scaling**: Horizontal scaling with TiDB's auto-scaling capabilities - **Monitoring**: Built-in analytics for hackathon presentation ## 📈 Success Metrics - User productivity improvement percentages - Context-switch efficiency gains - Framework adoption rates - Dataset quality and research value - Technical performance benchmarks ## 🎬 Demo Video Script (3 minutes) 1. **Problem Introduction** (30s): Show traditional productivity tools failing neurodivergent users 2. **Brain Dump Demo** (45s): Messy input → instant multi-framework organization 3. **Context Switch Magic** (45s): Working on random task creating cascading progress 4. **Energy Adaptation** (30s): UI morphing based on detected cognitive state 5. **Impact & Vision** (30s): Dataset generation value + future research possibilities ## 🏅 Open Source License MIT License - Encouraging community contributions and academic research collaboration. --- **Built for TiDB AgentX Hackathon 2025** *Transforming neurodivergent workflows into productivity superpowers*