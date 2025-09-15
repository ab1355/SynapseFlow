import { useState } from "react";
import { Card } from "@/components/ui/card";
import BrainDumpInterface from "@/components/BrainDumpInterface";
import FrameworkSwitcher, { type BrainDumpApiResponse } from "@/components/FrameworkSwitcher";
import SearchInterface from "@/components/SearchInterface";
import ProgressOrchestration from "@/components/ProgressOrchestration";
import ThemeToggle from "@/components/ThemeToggle";
import { Brain, Sparkles } from "lucide-react";
import type { EnergyState } from "@/components/EnergySelector";

// State for storing API response from brain dump processing

export default function Home() {
  const [brainDumpResponse, setBrainDumpResponse] = useState<BrainDumpApiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBrainDumpSubmit = async (content: string, energyState: EnergyState) => {
    setIsProcessing(true);
    console.log("Processing brain dump:", { content, energyState });
    
    try {
      const response = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: content,
          energyState,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BrainDumpApiResponse = await response.json();
      console.log('Brain dump processed successfully:', result);
      
      // Update the UI with processed results
      setBrainDumpResponse(result);
      
    } catch (error) {
      console.error('Failed to process brain dump:', error);
      // TODO: Show user-friendly error message
    } finally {
      setIsProcessing(false);
    }
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

          {/* Framework Switcher */}
          <FrameworkSwitcher
            data={brainDumpResponse}
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