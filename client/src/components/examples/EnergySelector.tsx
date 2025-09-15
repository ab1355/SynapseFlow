import { useState } from "react";
import EnergySelector from "../EnergySelector";
import type { EnergyState } from "../EnergySelector";

export default function EnergySelectorExample() {
  const [energyState, setEnergyState] = useState<EnergyState>("medium");

  return (
    <EnergySelector 
      energyState={energyState} 
      onEnergyChange={setEnergyState} 
    />
  );
}