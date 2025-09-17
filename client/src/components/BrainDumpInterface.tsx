import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Loader2, Paperclip, X } from "lucide-react";
import EnergySelector, { type EnergyState } from "./EnergySelector";

interface BrainDumpInterfaceProps {
  onSubmit?: (content: string, energyState: EnergyState) => void;
  onFileSubmit?: (file: File, energyState: EnergyState) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function BrainDumpInterface({ 
  onSubmit, 
  onFileSubmit,
  isProcessing = false, 
  className = "" 
}: BrainDumpInterfaceProps) {
  const [content, setContent] = useState("");
  const [energyState, setEnergyState] = useState<EnergyState>("medium");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (file && onFileSubmit) {
      onFileSubmit(file, energyState);
    } else if (content.trim() && onSubmit) {
      onSubmit(content.trim(), energyState);
      setContent("");
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
    if (file) return "File selected. Ready to process.";
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
            disabled={isProcessing || !!file}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={handleFileButtonClick}
                disabled={isProcessing || !!content}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
              )}
               <div className="text-sm text-muted-foreground">
                {content.length > 0 && `${content.length} characters`}
              </div>
            </div>

            <Button 
              data-testid="button-process-dump"
              onClick={handleSubmit}
              disabled={(!content.trim() && !file) || isProcessing}
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