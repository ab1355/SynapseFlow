import { useState } from "react";
import BrainDumpInterface from "../BrainDumpInterface";
import type { EnergyState } from "../EnergySelector";

export default function BrainDumpInterfaceExample() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (content: string, energyState: EnergyState) => {
    setIsProcessing(true);
    console.log("Processing brain dump:", { content, energyState });
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      console.log("Brain dump processed successfully!");
    }, 2000);
  };
  
  return (
    <BrainDumpInterface 
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
    />
  );
}