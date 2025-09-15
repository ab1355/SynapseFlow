import { useState } from "react";
import FrameworkTabs, { type FrameworkType } from "../FrameworkTabs";

//todo: remove mock functionality
const mockData = {
  agile: [
    {
      id: "1",
      title: "User Login System",
      description: "As a user, I want to securely login to access my personalized productivity dashboard",
      acceptanceCriteria: [
        "User can enter username and password",
        "System validates credentials", 
        "Success redirects to dashboard",
        "Failed login shows error message"
      ],
      priority: "high" as const,
      storyPoints: 8
    },
    {
      id: "2", 
      title: "Task Categorization",
      description: "As a user, I want to categorize tasks by energy level required",
      acceptanceCriteria: [
        "Tasks can be tagged with energy levels",
        "Filter tasks by energy state",
        "Visual indicators for energy requirements"
      ],
      priority: "medium" as const,
      storyPoints: 5
    }
  ],
  kanban: [
    {
      id: "k1",
      title: "Set up authentication",
      description: "Implement secure login/logout functionality",
      status: "in-progress" as const,
      labels: ["backend", "security"]
    },
    {
      id: "k2", 
      title: "Design energy selector UI",
      description: "Create intuitive energy state selection component",
      status: "done" as const,
      labels: ["frontend", "ux"]
    },
    {
      id: "k3",
      title: "Integrate OpenAI API",
      description: "Connect AI processing for brain dumps",
      status: "todo" as const,
      labels: ["ai", "integration"]
    }
  ],
  gtd: [
    {
      id: "g1",
      title: "Research authentication libraries",
      context: "@computer",
      timeRequired: "30 min",
      energy: "medium" as const,
      nextAction: true
    },
    {
      id: "g2",
      title: "Call client about project requirements", 
      context: "@phone",
      timeRequired: "15 min",
      energy: "high" as const,
      nextAction: false
    },
    {
      id: "g3",
      title: "Review code documentation",
      context: "@computer",
      timeRequired: "45 min", 
      energy: "low" as const,
      nextAction: true
    }
  ],
  para: [
    {
      id: "p1",
      title: "Synapse Development",
      type: "project" as const,
      description: "Build neurodivergent-adaptive productivity system"
    },
    {
      id: "p2",
      title: "Health & Wellness",
      type: "area" as const,
      description: "Maintaining physical and mental health routines"
    },
    {
      id: "p3",
      title: "AI/ML Resources",
      type: "resource" as const,
      description: "Collection of articles, tools, and research papers"
    },
    {
      id: "p4",
      title: "Old Project Ideas",
      type: "archive" as const,
      description: "Archived concepts and prototypes from previous work"
    }
  ],
  custom: [
    {
      id: "c1",
      title: "Energy Management Protocol",
      description: "Custom workflow for managing cognitive energy throughout the day",
      metadata: {
        frequency: "Daily",
        duration: "15 minutes", 
        priority: "High",
        tools: ["Timer", "Journal", "Energy Tracker"]
      }
    }
  ]
};

export default function FrameworkTabsExample() {
  const [activeFramework, setActiveFramework] = useState<FrameworkType>("agile");

  return (
    <FrameworkTabs 
      data={mockData}
      activeFramework={activeFramework}
      onFrameworkChange={setActiveFramework}
    />
  );
}