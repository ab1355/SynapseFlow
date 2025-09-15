import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Loader2 } from "lucide-react";
import EnergySelector, { type EnergyState } from "./EnergySelector";

interface BrainDumpInterfaceProps {
  onSubmit?: (content: string, energyState: EnergyState) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function BrainDumpInterface({ 
  onSubmit, 
  isProcessing = false, 
  className = "" 
}: BrainDumpInterfaceProps) {
  const [content, setContent] = useState("");
  const [energyState, setEnergyState] = useState<EnergyState>("medium");

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      console.log("Brain dump submitted:", { content, energyState });
      onSubmit(content.trim(), energyState);
      setContent("");
    }
  };

  const getAdaptiveSpacing = (state: EnergyState) => {
    switch (state) {
      case "low": return "space-y-6 p-8";
      case "high": return "space-y-3 p-4";
      case "hyperfocus": return "space-y-4 p-6";
      case "scattered": return "space-y-5 p-6";
      default: return "space-y-4 p-6";
    }
  };

  const getPlaceholder = (state: EnergyState) => {
    const placeholders = {
      low: "Take your time... what's on your mind?",
      medium: "What would you like to organize today?", 
      high: "Ready to tackle your thoughts? Let's go!",
      hyperfocus: "Deep focus mode - what's the priority?",
      scattered: "Let's collect those scattered thoughts..."
    };
    return placeholders[state];
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Brain Dump
        </CardTitle>
      </CardHeader>
      <CardContent className={getAdaptiveSpacing(energyState)}>
        <EnergySelector 
          energyState={energyState}
          onEnergyChange={setEnergyState}
        />
        
        <div className="space-y-3">
          <Textarea
            data-testid="input-brain-dump"
            placeholder={getPlaceholder(energyState)}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none text-base leading-relaxed"
            disabled={isProcessing}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {content.length > 0 && `${content.length} characters`}
            </div>
            <Button 
              data-testid="button-process-dump"
              onClick={handleSubmit}
              disabled={!content.trim() || isProcessing}
              size="sm"
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Process Thoughts
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}