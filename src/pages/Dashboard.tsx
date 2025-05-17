import { Link } from "react-router-dom";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Code, Trophy, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="container flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-arena-600" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container space-y-6">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-800">Error loading dashboard</h2>
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no data, show a placeholder state
  if (!data) {
    return (
      <div className="container space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.email}</h1>
          <p className="text-muted-foreground">Get started by joining challenges!</p>
        </header>

        <div className="p-6 bg-muted rounded-lg border">
          <h2 className="text-lg font-semibold">No Data Yet</h2>
          <p className="text-muted-foreground mb-4">Start your journey by joining challenges</p>
          <Link 
            to="/app/challenges" 
            className="px-4 py-2 bg-arena-600 text-white rounded-md hover:bg-arena-700"
          >
            Browse Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email?.split('@')[0]}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              <span>Rank: #{data.rank}</span>
            </Badge>
            <Badge className="badge badge-primary gap-1">
              <Award className="h-3 w-3" />
              <span>Top {data.percentile}%</span>
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
            <div className="text-3xl font-bold text-arena-600">{data.ongoingChallenges}</div>
          </CardContent>
          <CardFooter>
            {data.activeChallenges.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Next deadline: {data.activeChallenges[0].daysLeft} days
                </span>
              </Badge>
            )}
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Badges Earned</CardTitle>
            <CardDescription>Recognition for your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-arena-600">{data.badgesEarned}</div>
          </CardContent>
          <CardFooter className="flex gap-1">
            <Badge className="badge badge-primary">Top {data.percentile}%</Badge>
            <Badge variant="outline">Quick Solver</Badge>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Career Score</CardTitle>
            <CardDescription>Your cumulative performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-arena-600">{data.careerScore}</div>
            <Progress 
              value={data.nextLevelPoints > 0 ? (data.careerScore / (data.careerScore + data.nextLevelPoints)) * 100 : 100} 
              className="h-2" 
            />
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">
              {data.nextLevelPoints} points to reach the next level
            </span>
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
              {data.activeChallenges.length > 0 ? (
                data.activeChallenges.map((challenge) => (
                  <Link to={`/app/challenges/${challenge.id}`} key={challenge.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.company}</p>
                        </div>
                        <Badge variant={challenge.status === "Joined" ? "default" : "outline"}>
                          {challenge.status === "Joined" ? challenge.status : `${challenge.daysLeft} days left`}
                        </Badge>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You haven't joined any challenges yet.</p>
                  <Link 
                    to="/app/challenges" 
                    className="text-arena-600 hover:underline inline-block mt-2"
                  >
                    Browse Challenges
                  </Link>
                </div>
              )}
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
              {data.achievements.length > 0 ? (
                data.achievements.map((achievement, index) => (
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
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Complete challenges to earn achievements.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
