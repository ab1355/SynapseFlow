import { useState } from "react";
import SearchInterface from "../SearchInterface";

//todo: remove mock functionality  
const mockResults = [
  {
    id: "1",
    title: "User Authentication System",
    description: "Implement secure login and registration with JWT tokens and password hashing",
    framework: "agile" as const,
    relevance: 0.95,
    createdAt: "2 days ago",
    tags: ["security", "backend", "priority"]
  },
  {
    id: "2", 
    title: "Energy State Tracking",
    description: "Track and analyze user energy patterns to optimize task recommendations",
    framework: "gtd" as const,
    relevance: 0.87,
    createdAt: "1 week ago",
    tags: ["analytics", "neurodivergent", "ux"]
  },
  {
    id: "3",
    title: "AI Processing Pipeline", 
    description: "Set up OpenAI integration for transforming brain dumps into structured frameworks",
    framework: "kanban" as const,
    relevance: 0.78,
    createdAt: "3 days ago", 
    tags: ["ai", "integration", "processing"]
  }
];

export default function SearchInterfaceExample() {
  const [results, setResults] = useState(mockResults);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    console.log("Searching for:", query);
    
    // Simulate semantic search
    setTimeout(() => {
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <SearchInterface 
      onSearch={handleSearch}
      results={results}
      isSearching={isSearching}
    />
  );
}