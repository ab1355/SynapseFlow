import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Tag } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  framework: "agile" | "kanban" | "gtd" | "para" | "custom";
  relevance: number;
  createdAt: string;
  tags: string[];
}

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
  results?: SearchResult[];
  isSearching?: boolean;
  className?: string;
}

const frameworkColors = {
  agile: "bg-blue-100 text-blue-800",
  kanban: "bg-green-100 text-green-800",
  gtd: "bg-purple-100 text-purple-800", 
  para: "bg-orange-100 text-orange-800",
  custom: "bg-gray-100 text-gray-800"
};

export default function SearchInterface({ 
  onSearch, 
  results = [], 
  isSearching = false,
  className = "" 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      console.log("Searching for:", query);
      onSearch(query.trim());
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-primary" />
          Semantic Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            data-testid="input-search"
            placeholder="Search across all frameworks and brain dumps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            data-testid="button-search"
            type="submit" 
            disabled={!query.trim() || isSearching}
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            data-testid="button-filters"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </form>

        {showFilters && (
          <div className="p-3 border rounded-md bg-muted/50 space-y-3">
            <h4 className="text-sm font-medium">Search Filters</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(frameworkColors).map((framework) => (
                <Badge 
                  key={framework}
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent"
                  data-testid={`filter-${framework}`}
                >
                  {framework.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="text-center py-4 text-muted-foreground">
            Searching with semantic analysis...
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Search Results ({results.length})
            </h3>
            {results.map((result) => (
              <Card 
                key={result.id} 
                className="p-3 hover-elevate cursor-pointer"
                data-testid={`result-${result.id}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full" 
                             style={{opacity: result.relevance}} />
                        {Math.round(result.relevance * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {result.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={frameworkColors[result.framework]}
                      >
                        {result.framework.toUpperCase()}
                      </Badge>
                      {result.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {result.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{result.tags.length - 2} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {result.createdAt}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {query && !isSearching && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}