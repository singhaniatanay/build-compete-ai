
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit,
  Eye,
  Trash2
} from "lucide-react";

const CompanyChallenges = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search challenges..." 
                  className="w-[200px] lg:w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: 1, 
                  title: "AI Image Classification System", 
                  status: "active",
                  submissionCount: 34,
                  deadline: "2025-06-15",
                },
                { 
                  id: 2, 
                  title: "Natural Language Processing API", 
                  status: "active",
                  submissionCount: 28,
                  deadline: "2025-06-30",
                },
                { 
                  id: 3, 
                  title: "Recommendation Engine Prototype", 
                  status: "draft",
                  submissionCount: 0,
                  deadline: null,
                },
                { 
                  id: 4, 
                  title: "Predictive Analytics Dashboard", 
                  status: "completed",
                  submissionCount: 42,
                  deadline: "2025-05-01",
                },
                { 
                  id: 5, 
                  title: "Real-time Data Processing System", 
                  status: "completed",
                  submissionCount: 37,
                  deadline: "2025-05-10",
                },
              ].map((challenge) => (
                <Card key={challenge.id} className="group overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{challenge.title}</h3>
                        <Badge 
                          variant={
                            challenge.status === "active" 
                              ? "default" 
                              : challenge.status === "draft" 
                              ? "outline" 
                              : "secondary"
                          }
                        >
                          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {challenge.status !== "draft" && (
                          <>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>{challenge.submissionCount} submissions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(challenge.deadline!).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </>
                        )}
                        {challenge.status === "draft" && (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            <span>Not published yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
              <div>Showing 5 of 5 challenges</div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanyChallenges;
