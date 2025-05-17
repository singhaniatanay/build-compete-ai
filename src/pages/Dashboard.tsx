
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Code, Trophy } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              <span>Rank: #42</span>
            </Badge>
            <Badge className="badge badge-primary gap-1">
              <Award className="h-3 w-3" />
              <span>Top 10%</span>
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">Your AI challenge journey at a glance</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ongoing Challenges</CardTitle>
            <CardDescription>Challenges you're currently working on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-arena-600">2</div>
          </CardContent>
          <CardFooter>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              <span>Next deadline: 3 days</span>
            </Badge>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Badges Earned</CardTitle>
            <CardDescription>Recognition for your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-arena-600">5</div>
          </CardContent>
          <CardFooter className="flex gap-1">
            <Badge className="badge badge-primary">Top 10%</Badge>
            <Badge variant="outline">Quick Solver</Badge>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Career Score</CardTitle>
            <CardDescription>Your cumulative performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-arena-600">856</div>
            <Progress value={85} className="h-2" />
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">150 points to reach the next level</span>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-arena-600" /> Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "LLM-based Summarization Engine",
                  company: "AI Research Labs",
                  progress: 65,
                  daysLeft: 5,
                },
                {
                  title: "Multimodal Content Classifier",
                  company: "TechCorp Inc.",
                  progress: 30,
                  daysLeft: 12,
                },
              ].map((challenge, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.company}</p>
                    </div>
                    <Badge variant="outline">{challenge.daysLeft} days left</Badge>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-arena-600" /> Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Top 10% Badge Earned",
                  description: "Ranked in the top 10% for Image Recognition Challenge",
                  date: "2 days ago",
                },
                {
                  title: "Challenge Completed",
                  description: "Successfully completed the NLP Document Analysis challenge",
                  date: "1 week ago",
                },
                {
                  title: "First Submission",
                  description: "Made your first challenge submission",
                  date: "3 weeks ago",
                },
              ].map((achievement, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="rounded-full bg-arena-100 p-2 mt-1">
                    <Award className="h-4 w-4 text-arena-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
