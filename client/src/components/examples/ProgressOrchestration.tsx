import { useState } from "react";
import ProgressOrchestration from "../ProgressOrchestration";

//todo: remove mock functionality
const mockProjects = [
  {
    id: "1",
    name: "Synapse Core System",
    progress: 75,
    totalTasks: 12,
    completedTasks: 9,
    framework: "agile" as const,
    nextMilestone: "Beta Release",
    energyImpact: "high" as const
  },
  {
    id: "2", 
    name: "User Experience Polish",
    progress: 45,
    totalTasks: 8,
    completedTasks: 4,
    framework: "kanban" as const,
    nextMilestone: "Design Review",
    energyImpact: "medium" as const
  },
  {
    id: "3",
    name: "Documentation & Testing",
    progress: 30,
    totalTasks: 6, 
    completedTasks: 2,
    framework: "gtd" as const,
    nextMilestone: "Test Suite Complete",
    energyImpact: "low" as const
  },
  {
    id: "4",
    name: "AI Integration Pipeline", 
    progress: 85,
    totalTasks: 5,
    completedTasks: 4,
    framework: "para" as const,
    nextMilestone: "Production Deploy",
    energyImpact: "high" as const
  }
];

const mockConnections = [
  {
    id: "c1",
    fromProject: "Synapse Core System",
    toProject: "User Experience Polish",
    sharedTasks: 3,
    impactLevel: "high" as const
  },
  {
    id: "c2", 
    fromProject: "AI Integration Pipeline",
    toProject: "Synapse Core System",
    sharedTasks: 2,
    impactLevel: "medium" as const
  },
  {
    id: "c3",
    fromProject: "Documentation & Testing", 
    toProject: "User Experience Polish",
    sharedTasks: 1,
    impactLevel: "low" as const
  }
];

export default function ProgressOrchestrationExample() {
  const handleProjectClick = (projectId: string) => {
    console.log("Project clicked:", projectId);
  };

  return (
    <ProgressOrchestration 
      projects={mockProjects}
      connections={mockConnections}
      onProjectClick={handleProjectClick}
    />
  );
}