import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Send, Loader2 } from "lucide-react";

type EnergyState = "High" | "Medium" | "Low" | "Hyperfocus" | "Scattered";

interface BrainDumpInputProps {
  onSubmit?: (data: { input: string; energyState: EnergyState }) => void;
  className?: string;
}

const energyStates: { 
  value: EnergyState; 
  label: string; 
  color: string; 
  bgColor: string;
  placeholder: string;
}[] = [
  {
    value: "High",
    label: "High",
    color: "text-green-700",
    bgColor: "bg-green-50 hover:bg-green-100 border-green-200 data-[active=true]:bg-green-100 data-[active=true]:border-green-300",
    placeholder: "Ready to tackle complex thoughts? Let's organize your high-energy ideas..."
  },
  {
    value: "Medium",
    label: "Medium", 
    color: "text-blue-700",
    bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200 data-[active=true]:bg-blue-100 data-[active=true]:border-blue-300",
    placeholder: "What's on your mind today? Share your thoughts and let's structure them..."
  },
  {
    value: "Low",
    label: "Low",
    color: "text-amber-700", 
    bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200 data-[active=true]:bg-amber-100 data-[active=true]:border-amber-300",
    placeholder: "Take your time... what gentle thoughts would you like to organize?"
  },
  {
    value: "Hyperfocus",
    label: "Hyperfocus",
    color: "text-purple-700",
    bgColor: "bg-purple-50 hover:bg-purple-100 border-purple-200 data-[active=true]:bg-purple-100 data-[active=true]:border-purple-300",
    placeholder: "In the zone? Let's capture this focused energy and transform it into structured progress..."
  },
  {
    value: "Scattered",
    label: "Scattered", 
    color: "text-rose-700",
    bgColor: "bg-rose-50 hover:bg-rose-100 border-rose-200 data-[active=true]:bg-rose-100 data-[active=true]:border-rose-300",
    placeholder: "Feeling scattered? Let's collect those wandering thoughts and give them structure..."
  }
];

export default function BrainDumpInput({ onSubmit, className = "" }: BrainDumpInputProps) {
  const [input, setInput] = useState("");
  const [energyState, setEnergyState] = useState<EnergyState>("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentEnergyConfig = energyStates.find(state => state.value === energyState);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          energyState,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Brain dump processed:', result);
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({ input: input.trim(), energyState });
      }
      
      // Clear input after successful submission
      setInput("");
      
    } catch (error) {
      console.error('Failed to process brain dump:', error);
      // TODO: Show user-friendly error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
          <Brain className="h-6 w-6 text-blue-600" />
          Brain Dump Interface
        </CardTitle>
        <p className="text-sm text-gray-600 leading-relaxed">
          Capture your thoughts without pressure. Choose your current energy level and let your mind flow freely.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Energy State Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Current Energy State
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {energyStates.map((state) => (
              <Button
                key={state.value}
                variant="outline"
                size="sm"
                data-active={energyState === state.value}
                onClick={() => setEnergyState(state.value)}
                className={`
                  h-auto py-3 px-3 transition-all duration-200 border-2
                  ${state.bgColor} ${state.color}
                  hover:shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                `}
                disabled={isSubmitting}
                data-testid={`energy-${state.value.toLowerCase()}`}
              >
                <span className="font-medium text-xs text-center">
                  {state.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Brain Dump Textarea */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Your Thoughts
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentEnergyConfig?.placeholder || "Share your thoughts..."}
            className="min-h-[200px] w-full resize-none text-base leading-relaxed 
                     border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                     bg-white placeholder:text-gray-400 placeholder:italic"
            disabled={isSubmitting}
            data-testid="brain-dump-input"
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {input.length > 0 && `${input.length} characters`}
            </span>
            <span className="italic">
              No judgment, no structure needed - just think out loud
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isSubmitting}
            size="lg"
            className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-medium
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            data-testid="submit-brain-dump"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Transform My Thoughts
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}