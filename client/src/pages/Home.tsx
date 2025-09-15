import { useState } from "react";
import { Card } from "@/components/ui/card";
import BrainDumpInterface from "@/components/BrainDumpInterface";
import FrameworkTabs from "@/components/FrameworkTabs";
import SearchInterface from "@/components/SearchInterface";
import ProgressOrchestration from "@/components/ProgressOrchestration";
import ThemeToggle from "@/components/ThemeToggle";
import { Brain, Sparkles } from "lucide-react";
import type { EnergyState } from "@/components/EnergySelector";
import type { FrameworkType } from "@/components/FrameworkTabs";

//todo: remove mock functionality when backend is implemented
const mockFrameworkData = {
  agile: [
    {
      id: "1",
      title: "Implement Real-time Processing",
      description: "As a user, I want my brain dumps processed instantly so I can see immediate organizational value",
      acceptanceCriteria: [
        "Brain dump submits trigger immediate AI processing",
        "User sees progress indicator during processing", 
        "Results appear within 5 seconds",
        "Error handling for failed processing"
      ],
      priority: "high" as const,
      storyPoints: 8
    }
  ],
  kanban: [
    {
      id: "k1",
      title: "AI Processing Integration",
      description: "Connect OpenAI API for brain dump transformation",
      status: "in-progress" as const,
      labels: ["ai", "backend", "priority"]
    }
  ],
  gtd: [
    {
      id: "g1", 
      title: "Review AI processing accuracy",
      context: "@computer",
      timeRequired: "30 min",
      energy: "high" as const,
      nextAction: true
    }
  ],
  para: [
    {
      id: "p1",
      title: "AI Integration",
      type: "project" as const,
      description: "Implementing OpenAI for brain dump processing"
    }
  ],
  custom: []
};

export default function Home() {
  const [activeFramework, setActiveFramework] = useState<FrameworkType>("agile");
  const [frameworkData, setFrameworkData] = useState(mockFrameworkData);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBrainDumpSubmit = async (content: string, energyState: EnergyState) => {
    setIsProcessing(true);
    console.log("Processing brain dump:", { content, energyState });
    
    //todo: replace with actual AI processing
    setTimeout(() => {
      setIsProcessing(false);
      console.log("Brain dump processed successfully!");
      // In real implementation, this would update frameworkData with AI-processed results
    }, 3000);
  };

  const handleSearch = (query: string) => {
    console.log("Performing semantic search:", query);
    //todo: implement actual vector search
  };

  const handleProjectClick = (projectId: string) => {
    console.log("Navigate to project:", projectId);
    //todo: implement project navigation
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Synapse</h1>
                  <p className="text-sm text-muted-foreground">
                    Neurodivergent-Adaptive Productivity System
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-medium">Transform Scattered Thoughts</span>
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Capture your brain dumps and instantly transform them into organized productivity frameworks. 
                Synapse adapts to your energy state and cognitive needs, making productivity accessible for neurodivergent minds.
              </p>
            </div>
          </Card>

          {/* Brain Dump Interface */}
          <BrainDumpInterface 
            onSubmit={handleBrainDumpSubmit}
            isProcessing={isProcessing}
            data-testid="brain-dump-section"
          />

          {/* Framework Tabs */}
          <FrameworkTabs
            data={frameworkData}
            activeFramework={activeFramework}
            onFrameworkChange={setActiveFramework}
            data-testid="framework-section"
          />

          {/* Search and Progress in Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SearchInterface 
              onSearch={handleSearch}
              results={[]}
              data-testid="search-section"
            />
            <ProgressOrchestration 
              projects={[]}
              connections={[]}
              onProjectClick={handleProjectClick}
              data-testid="progress-section"
            />
          </div>

          {/* Footer */}
          <Card className="p-6 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Built for the <strong>TiDB AgentX Hackathon 2025</strong> • 
              Empowering neurodivergent productivity through adaptive AI
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}