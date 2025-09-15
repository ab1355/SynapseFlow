import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Battery, Focus, Shuffle } from "lucide-react";

export type EnergyState = "low" | "medium" | "high" | "hyperfocus" | "scattered";

interface EnergySelectorProps {
  energyState: EnergyState;
  onEnergyChange: (state: EnergyState) => void;
  className?: string;
}

const energyConfig = {
  low: {
    label: "Low Energy",
    description: "Need gentle, simple tasks",
    icon: Battery,
    color: "text-energy-low",
    bgColor: "bg-energy-low/10 hover:bg-energy-low/20",
    borderColor: "border-energy-low/30"
  },
  medium: {
    label: "Medium Energy", 
    description: "Balanced productivity mode",
    icon: Brain,
    color: "text-energy-medium",
    bgColor: "bg-energy-medium/10 hover:bg-energy-medium/20",
    borderColor: "border-energy-medium/30"
  },
  high: {
    label: "High Energy",
    description: "Ready for complex tasks",
    icon: Zap,
    color: "text-energy-high", 
    bgColor: "bg-energy-high/10 hover:bg-energy-high/20",
    borderColor: "border-energy-high/30"
  },
  hyperfocus: {
    label: "Hyperfocus",
    description: "Deep work mode",
    icon: Focus,
    color: "text-energy-hyperfocus",
    bgColor: "bg-energy-hyperfocus/10 hover:bg-energy-hyperfocus/20",
    borderColor: "border-energy-hyperfocus/30"
  },
  scattered: {
    label: "Scattered",
    description: "Need organization help",
    icon: Shuffle,
    color: "text-energy-scattered",
    bgColor: "bg-energy-scattered/10 hover:bg-energy-scattered/20",
    borderColor: "border-energy-scattered/30"
  },
};

export default function EnergySelector({ energyState, onEnergyChange, className = "" }: EnergySelectorProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Current Energy State</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {Object.entries(energyConfig).map(([key, config]) => {
            const isSelected = energyState === key;
            const IconComponent = config.icon;
            
            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                data-testid={`energy-${key}`}
                onClick={() => onEnergyChange(key as EnergyState)}
                className={`
                  flex flex-col gap-1 h-auto py-3 px-2 transition-all duration-200
                  ${isSelected 
                    ? `${config.bgColor} ${config.borderColor} border ${config.color}` 
                    : `hover:${config.bgColor} hover:${config.borderColor}`
                  }
                `}
              >
                <IconComponent className={`h-4 w-4 ${isSelected ? config.color : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${isSelected ? config.color : "text-muted-foreground"}`}>
                  {config.label}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center opacity-75">
                  {config.description}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}