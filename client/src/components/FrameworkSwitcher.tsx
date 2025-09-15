import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Kanban, 
  CheckSquare, 
  FolderTree, 
  Settings,
  Clock,
  Zap,
  AlertCircle,
  ChevronRight,
  Brain
} from "lucide-react";

// Types matching the API response format
export interface BrainDumpApiResponse {
  success: boolean;
  originalInput: string;
  energyState: string;
  processedAt: string;
  frameworks: {
    agile: {
      userStories: Array<{
        id: string;
        title: string;
        description: string;
        priority: string;
        storyPoints: number;
      }>;
    };
    kanban: {
      columns: {
        todo: Array<{
          id: string;
          title: string;
          description: string;
        }>;
        inProgress: Array<{
          id: string;
          title: string;
          description: string;
        }>;
        done: Array<{
          id: string;
          title: string;
          description: string;
        }>;
      };
    };
    gtd: {
      actions: Array<{
        id: string;
        title: string;
        context: string;
        energyRequired: string;
        timeEstimate: string;
      }>;
    };
    para: {
      classification: {
        type: string;
        category: string;
        actionable: boolean;
        item: {
          title: string;
          description: string;
        };
      };
    };
    custom: {
      energyOptimized: {
        recommendedTime: string;
        breakdownStrategy: string;
        cognitiveLoad: string;
      };
    };
  };
}

interface FrameworkSwitcherProps {
  data: BrainDumpApiResponse | null;
  className?: string;
}

const frameworkConfig = {
  agile: {
    label: "Agile",
    icon: Target,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    description: "User stories and sprint planning"
  },
  kanban: {
    label: "Kanban", 
    icon: Kanban,
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    description: "Visual task board workflow"
  },
  gtd: {
    label: "GTD",
    icon: CheckSquare,
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    description: "Getting Things Done methodology"
  },
  para: {
    label: "PARA",
    icon: FolderTree,
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    description: "Projects, Areas, Resources, Archives"
  },
  custom: {
    label: "Custom",
    icon: Settings,
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
    description: "Energy-optimized neurodivergent approach"
  }
};

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const slideInVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function FrameworkSwitcher({ data, className = "" }: FrameworkSwitcherProps) {
  const [activeFramework, setActiveFramework] = useState("agile");

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Submit a brain dump to see your thoughts transformed into organized frameworks</p>
      </div>
    );
  }

  const renderAgileView = () => {
    const stories = data.frameworks.agile.userStories;
    
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {stories.map((story, index) => (
          <motion.div key={story.id} variants={slideInVariants}>
            <Card data-testid={`agile-story-${story.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    {story.title}
                  </CardTitle>
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
              <CardContent>
                <p className="text-sm text-muted-foreground">{story.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderKanbanView = () => {
    const { todo, inProgress, done } = data.frameworks.kanban.columns;
    const allCards = [...todo, ...inProgress, ...done];
    
    return (
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            To Do
          </h3>
          <motion.div variants={staggerContainer} className="space-y-2">
            {todo.map((card) => (
              <motion.div key={card.id} variants={slideInVariants}>
                <Card className="p-3" data-testid={`kanban-todo-${card.id}`}>
                  <h4 className="font-medium text-sm mb-2">{card.title}</h4>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4" />
            In Progress
          </h3>
          <div className="space-y-2">
            {inProgress.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-xs">
                Ready for your focused work
              </div>
            ) : (
              inProgress.map((card) => (
                <Card key={card.id} className="p-3" data-testid={`kanban-progress-${card.id}`}>
                  <h4 className="font-medium text-sm mb-2">{card.title}</h4>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Done
          </h3>
          <div className="space-y-2">
            {done.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-xs">
                Your achievements will appear here
              </div>
            ) : (
              done.map((card) => (
                <Card key={card.id} className="p-3" data-testid={`kanban-done-${card.id}`}>
                  <h4 className="font-medium text-sm mb-2">{card.title}</h4>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderGTDView = () => {
    const actions = data.frameworks.gtd.actions;
    
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {actions.map((action) => (
          <motion.div key={action.id} variants={slideInVariants}>
            <Card data-testid={`gtd-action-${action.id}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-purple-600" />
                    {action.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {action.context}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {action.timeEstimate}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    action.energyRequired === "Hyperfocus" ? "bg-purple-100 text-purple-800" :
                    action.energyRequired === "High" ? "bg-green-100 text-green-800" :
                    action.energyRequired === "Medium" ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }
                >
                  {action.energyRequired}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderPARAView = () => {
    const classification = data.frameworks.para.classification;
    
    return (
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <Card data-testid="para-classification">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-orange-600" />
              PARA Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge 
                  variant={classification.type === "Project" ? "default" : "outline"}
                  className="mb-2"
                >
                  Project
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Has deadline & outcome
                </p>
              </div>
              <div className="text-center">
                <Badge 
                  variant={classification.type === "Area" ? "default" : "outline"}
                  className="mb-2"
                >
                  Area
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Ongoing responsibility
                </p>
              </div>
              <div className="text-center">
                <Badge 
                  variant={classification.type === "Resource" ? "default" : "outline"}
                  className="mb-2"
                >
                  Resource
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Reference material
                </p>
              </div>
              <div className="text-center">
                <Badge 
                  variant={classification.type === "Archive" ? "default" : "outline"}
                  className="mb-2"
                >
                  Archive
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Inactive items
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">{classification.item.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{classification.item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Category: <strong>{classification.category}</strong></span>
                <Badge variant={classification.actionable ? "default" : "secondary"}>
                  {classification.actionable ? "Actionable" : "Reference"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCustomView = () => {
    const energyOptimized = data.frameworks.custom.energyOptimized;
    
    return (
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <Card data-testid="custom-energy-optimized">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-600" />
              Energy-Optimized Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recommended Time
                </h4>
                <Badge variant="outline" className="text-sm">
                  {energyOptimized.recommendedTime}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Strategy
                </h4>
                <Badge variant="outline" className="text-sm">
                  {energyOptimized.breakdownStrategy}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Cognitive Load
                </h4>
                <Badge 
                  variant="outline"
                  className={`text-sm ${
                    energyOptimized.cognitiveLoad === "high" ? "bg-red-100 text-red-800" :
                    energyOptimized.cognitiveLoad === "moderate" ? "bg-amber-100 text-amber-800" :
                    "bg-green-100 text-green-800"
                  }`}
                >
                  {energyOptimized.cognitiveLoad}
                </Badge>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-sm mb-2">Neurodivergent-Friendly Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Work with your energy patterns, not against them</li>
                <li>• Break tasks into manageable chunks based on your current state</li>
                <li>• Use visual cues and progress tracking for motivation</li>
                <li>• Allow for flexible scheduling and context switching</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header with original input */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Badge variant="outline" className={`${
                  data.energyState === "Hyperfocus" ? "bg-purple-100 text-purple-800" :
                  data.energyState === "High" ? "bg-green-100 text-green-800" :
                  data.energyState === "Medium" ? "bg-blue-100 text-blue-800" :
                  data.energyState === "Low" ? "bg-amber-100 text-amber-800" :
                  "bg-rose-100 text-rose-800"
                }`}>
                  {data.energyState} Energy
                </Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Original Brain Dump</h3>
                <p className="text-sm text-muted-foreground italic">"{data.originalInput}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Framework Switcher Tabs */}
      <Tabs value={activeFramework} onValueChange={setActiveFramework}>
        <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="framework-tabs">
          {Object.entries(frameworkConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                data-testid={`tab-${key}`}
                className="flex items-center gap-2 text-xs md:text-sm"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="agile" className="mt-0">
            {renderAgileView()}
          </TabsContent>

          <TabsContent value="kanban" className="mt-0">
            {renderKanbanView()}
          </TabsContent>

          <TabsContent value="gtd" className="mt-0">
            {renderGTDView()}
          </TabsContent>

          <TabsContent value="para" className="mt-0">
            {renderPARAView()}
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            {renderCustomView()}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}