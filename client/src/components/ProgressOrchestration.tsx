import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

interface ProjectConnection {
  id: string;
  fromProject: string;
  toProject: string;
  sharedTasks: number;
  impactLevel: "low" | "medium" | "high";
}

interface ProjectOverview {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  framework: "agile" | "kanban" | "gtd" | "para" | "custom";
  nextMilestone?: string;
  energyImpact: "low" | "medium" | "high";
}

interface ProgressOrchestrationProps {
  projects?: ProjectOverview[];
  connections?: ProjectConnection[];
  onProjectClick?: (projectId: string) => void;
  className?: string;
}

const frameworkColors = {
  agile: "bg-blue-100 text-blue-800",
  kanban: "bg-green-100 text-green-800", 
  gtd: "bg-purple-100 text-purple-800",
  para: "bg-orange-100 text-orange-800",
  custom: "bg-gray-100 text-gray-800"
};

const impactColors = {
  low: "text-gray-500",
  medium: "text-amber-500", 
  high: "text-red-500"
};

const energyColors = {
  low: "text-energy-low",
  medium: "text-energy-medium",
  high: "text-energy-high"
};

export default function ProgressOrchestration({ 
  projects = [], 
  connections = [], 
  onProjectClick,
  className = "" 
}: ProgressOrchestrationProps) {
  
  const getConnectionStrength = (impact: string) => {
    switch(impact) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-amber-200 bg-amber-50"; 
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Network className="h-5 w-5 text-primary" />
          Progress Orchestration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No projects to orchestrate yet
          </div>
        ) : (
          <>
            {/* Project Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="p-4 hover-elevate cursor-pointer"
                  data-testid={`project-${project.id}`}
                  onClick={() => onProjectClick?.(project.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm">{project.name}</h3>
                      <Zap className={`h-4 w-4 ${energyColors[project.energyImpact]}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={frameworkColors[project.framework]}
                      >
                        {project.framework.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3" />
                        {project.completedTasks}/{project.totalTasks}
                      </div>
                    </div>
                    
                    {project.nextMilestone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Next: {project.nextMilestone}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Project Connections */}
            {connections.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Cross-Project Impact
                </h3>
                <div className="space-y-2">
                  {connections.map((connection) => (
                    <Card 
                      key={connection.id} 
                      className={`p-3 ${getConnectionStrength(connection.impactLevel)}`}
                      data-testid={`connection-${connection.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {connection.fromProject}
                          </div>
                          <ArrowRight className={`h-4 w-4 ${impactColors[connection.impactLevel]}`} />
                          <div className="text-sm font-medium">
                            {connection.toProject}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${impactColors[connection.impactLevel]}`}
                          >
                            {connection.impactLevel} impact
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {connection.sharedTasks} shared tasks
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Recommended Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3"
                  data-testid="action-high-impact"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">Focus on High-Impact Tasks</div>
                    <div className="text-xs text-muted-foreground">
                      Complete tasks that advance multiple projects
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3"
                  data-testid="action-energy-match"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">Match Energy to Tasks</div>
                    <div className="text-xs text-muted-foreground">
                      Align current energy with optimal task selection
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}