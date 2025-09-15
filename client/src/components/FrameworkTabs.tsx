import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Kanban, 
  CheckSquare, 
  FileText, 
  FolderTree, 
  Settings,
  Clock,
  Target,
  Archive
} from "lucide-react";

export type FrameworkType = "agile" | "kanban" | "gtd" | "para" | "custom";

interface FrameworkData {
  agile: AgileStory[];
  kanban: KanbanCard[];
  gtd: GTDAction[];
  para: PARAItem[];
  custom: CustomItem[];
}

interface AgileStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: "low" | "medium" | "high";
  storyPoints: number;
}

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  labels: string[];
}

interface GTDAction {
  id: string;
  title: string;
  context: string;
  timeRequired: string;
  energy: "low" | "medium" | "high";
  nextAction: boolean;
}

interface PARAItem {
  id: string;
  title: string;
  type: "project" | "area" | "resource" | "archive";
  description: string;
}

interface CustomItem {
  id: string;
  title: string;
  description: string;
  metadata: Record<string, any>;
}

interface FrameworkTabsProps {
  data: Partial<FrameworkData>;
  activeFramework: FrameworkType;
  onFrameworkChange: (framework: FrameworkType) => void;
  className?: string;
}

const frameworkConfig = {
  agile: {
    label: "Agile",
    icon: Target,
    color: "bg-blue-100 text-blue-800"
  },
  kanban: {
    label: "Kanban", 
    icon: Kanban,
    color: "bg-green-100 text-green-800"
  },
  gtd: {
    label: "GTD",
    icon: CheckSquare,
    color: "bg-purple-100 text-purple-800"
  },
  para: {
    label: "PARA",
    icon: FolderTree,
    color: "bg-orange-100 text-orange-800"
  },
  custom: {
    label: "Custom",
    icon: Settings,
    color: "bg-gray-100 text-gray-800"
  }
};

export default function FrameworkTabs({ 
  data, 
  activeFramework, 
  onFrameworkChange, 
  className = "" 
}: FrameworkTabsProps) {
  
  const renderAgileView = (stories: AgileStory[] = []) => (
    <div className="space-y-4">
      {stories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No user stories generated yet
        </div>
      ) : (
        stories.map((story) => (
          <Card key={story.id} data-testid={`story-${story.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{story.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{story.storyPoints} SP</Badge>
                  <Badge 
                    variant={story.priority === "high" ? "destructive" : "outline"}
                    className={story.priority === "medium" ? "bg-amber-100 text-amber-800" : ""}
                  >
                    {story.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{story.description}</p>
              {story.acceptanceCriteria.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Acceptance Criteria:</h4>
                  <ul className="text-sm space-y-1">
                    {story.acceptanceCriteria.map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckSquare className="h-3 w-3 mt-0.5 text-muted-foreground" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderKanbanView = (cards: KanbanCard[] = []) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {["todo", "in-progress", "review", "done"].map((status) => (
        <div key={status} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            {status.replace("-", " ")}
          </h3>
          <div className="space-y-2">
            {cards.filter(card => card.status === status).map((card) => (
              <Card key={card.id} className="p-3" data-testid={`kanban-${card.id}`}>
                <h4 className="font-medium text-sm mb-2">{card.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
                {card.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {card.labels.map((label, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGTDView = (actions: GTDAction[] = []) => (
    <div className="space-y-4">
      {actions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No GTD actions generated yet
        </div>
      ) : (
        actions.map((action) => (
          <Card key={action.id} data-testid={`gtd-${action.id}`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{action.title}</h4>
                  {action.nextAction && (
                    <Badge variant="default" className="text-xs">Next Action</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {action.context}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {action.timeRequired}
                  </span>
                </div>
              </div>
              <Badge 
                variant="outline"
                className={
                  action.energy === "high" ? "bg-green-100 text-green-800" :
                  action.energy === "medium" ? "bg-amber-100 text-amber-800" :
                  "bg-red-100 text-red-800"
                }
              >
                {action.energy} energy
              </Badge>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderPARAView = (items: PARAItem[] = []) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {["project", "area", "resource", "archive"].map((type) => (
        <div key={type} className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            {type === "project" && <Target className="h-4 w-4" />}
            {type === "area" && <FolderTree className="h-4 w-4" />}
            {type === "resource" && <FileText className="h-4 w-4" />}
            {type === "archive" && <Archive className="h-4 w-4" />}
            {type}
          </h3>
          <div className="space-y-2">
            {items.filter(item => item.type === type).map((item) => (
              <Card key={item.id} className="p-3" data-testid={`para-${item.id}`}>
                <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustomView = (items: CustomItem[] = []) => (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No custom items generated yet
        </div>
      ) : (
        items.map((item) => (
          <Card key={item.id} data-testid={`custom-${item.id}`}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              {Object.keys(item.metadata).length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <Tabs value={activeFramework} onValueChange={(value) => onFrameworkChange(value as FrameworkType)} className={className}>
      <TabsList className="grid w-full grid-cols-5 mb-6">
        {Object.entries(frameworkConfig).map(([key, config]) => {
          const IconComponent = config.icon;
          const itemCount = data[key as FrameworkType]?.length || 0;
          
          return (
            <TabsTrigger 
              key={key} 
              value={key}
              data-testid={`tab-${key}`}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              <span className="hidden sm:inline">{config.label}</span>
              {itemCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                  {itemCount}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="agile" className="mt-0">
        {renderAgileView(data.agile)}
      </TabsContent>

      <TabsContent value="kanban" className="mt-0">
        {renderKanbanView(data.kanban)}
      </TabsContent>

      <TabsContent value="gtd" className="mt-0">
        {renderGTDView(data.gtd)}
      </TabsContent>

      <TabsContent value="para" className="mt-0">
        {renderPARAView(data.para)}
      </TabsContent>

      <TabsContent value="custom" className="mt-0">
        {renderCustomView(data.custom)}
      </TabsContent>
    </Tabs>
  );
}