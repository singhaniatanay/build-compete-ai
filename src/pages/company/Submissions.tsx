
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileCheck, Eye, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CompanySubmissions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Challenge Submissions</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search submissions..." 
                  className="w-[200px] lg:w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Challenges</TabsTrigger>
                  <TabsTrigger value="image">Image Classification</TabsTrigger>
                  <TabsTrigger value="nlp">NLP API</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: 1, 
                  user: "Alex Johnson",
                  userAvatar: "AJ",
                  challenge: "AI Image Classification System",
                  submissionDate: "2025-06-02",
                  llmScore: 82,
                  humanScore: 79,
                  status: "reviewed"
                },
                { 
                  id: 2, 
                  user: "Sarah Miller",
                  userAvatar: "SM",
                  challenge: "AI Image Classification System",
                  submissionDate: "2025-06-01",
                  llmScore: 91,
                  humanScore: 88,
                  status: "reviewed"
                },
                { 
                  id: 3, 
                  user: "David Chen",
                  userAvatar: "DC",
                  challenge: "Natural Language Processing API",
                  submissionDate: "2025-05-29",
                  llmScore: 74,
                  humanScore: 71,
                  status: "reviewed"
                },
                { 
                  id: 4, 
                  user: "Emma Wilson",
                  userAvatar: "EW",
                  challenge: "Natural Language Processing API",
                  submissionDate: "2025-05-28",
                  llmScore: 95,
                  humanScore: 92,
                  status: "reviewed"
                },
                { 
                  id: 5, 
                  user: "Michael Taylor",
                  userAvatar: "MT",
                  challenge: "Predictive Analytics Dashboard",
                  submissionDate: "2025-05-15",
                  llmScore: 88,
                  humanScore: 85,
                  status: "reviewed"
                },
              ].map((submission) => (
                <Card key={submission.id}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="font-medium">{submission.userAvatar}</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{submission.user}</h3>
                          <div className="text-sm text-muted-foreground">{submission.challenge}</div>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="rounded-sm">
                              <FileCheck className="mr-1 h-3 w-3" />
                              Submitted {new Date(submission.submissionDate).toLocaleDateString()}
                            </Badge>
                            <Badge variant="secondary" className="rounded-sm">
                              Final Score: {Math.round((submission.llmScore * 0.4) + (submission.humanScore * 0.6))}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>LLM Score (40%)</span>
                            <span>{submission.llmScore}%</span>
                          </div>
                          <Progress value={submission.llmScore} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Human Score (60%)</span>
                            <span>{submission.humanScore}%</span>
                          </div>
                          <Progress value={submission.humanScore} className="h-1" />
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2 ml-auto md:ml-0">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
              <div>Showing 5 of 142 submissions</div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
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

export default CompanySubmissions;
