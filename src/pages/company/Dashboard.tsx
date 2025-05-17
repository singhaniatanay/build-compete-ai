import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, FileText, Trophy, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [dashboardStats, setDashboardStats] = useState({
    activeChallenges: 0,
    totalSubmissions: 0,
    candidatesEngaged: 0,
    averageScore: 0,
  });
  
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [topChallenges, setTopChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get company profile to filter challenges by company
        const { data: profileData } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .single();
          
        const companyName = profileData?.company_name;
        
        if (!companyName) {
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile.",
            variant: "destructive",
          });
          return;
        }
        
        // Fetch active challenges count
        const { data: challenges, error: challengesError } = await supabase
          .from('challenges')
          .select('id')
          .eq('company', companyName);
          
        if (challengesError) throw challengesError;
        
        const challengeIds = challenges?.map(challenge => challenge.id) || [];
        
        // Fetch submissions for the company's challenges
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .in('challenge_id', challengeIds)
          .order('submitted_at', { ascending: false });
          
        if (submissionsError) throw submissionsError;
        
        // Fetch associated profiles and challenges separately
        let submissionsWithDetails = [];
        
        if (submissions && submissions.length > 0) {
          // Get unique user IDs from submissions
          const userIds = [...new Set(submissions.map(s => s.user_id))];
          
          // Fetch profiles for these users
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
            
          if (profilesError) throw profilesError;
          
          // Create a lookup map for profiles
          const profilesMap = profilesData?.reduce((map, profile) => {
            map[profile.id] = profile;
            return map;
          }, {} as Record<string, any>) || {};
          
          // Fetch challenges data
          const { data: challengesData, error: challengesDataError } = await supabase
            .from('challenges')
            .select('id, title')
            .in('id', challengeIds);
            
          if (challengesDataError) throw challengesDataError;
          
          // Create a lookup map for challenges
          const challengesMap = challengesData?.reduce((map, challenge) => {
            map[challenge.id] = challenge;
            return map;
          }, {} as Record<string, any>) || {};
          
          // Join the data manually
          submissionsWithDetails = submissions.map(submission => ({
            ...submission,
            profiles: profilesMap[submission.user_id] || null,
            challenges: challengesMap[submission.challenge_id] || null
          }));
        }
        
        // Fetch participants count
        const { data: participants, error: participantsError } = await supabase
          .from('challenge_participants')
          .select('user_id')
          .in('challenge_id', challengeIds);
          
        if (participantsError) throw participantsError;
        
        // Calculate unique participants
        const uniqueParticipants = new Set(participants?.map(p => p.user_id));
        
        // Calculate average score
        const scores = submissionsWithDetails?.map(sub => sub.score).filter(score => score !== null) || [];
        const averageScore = scores.length > 0 
          ? scores.reduce((sum, score) => sum + (score || 0), 0) / scores.length 
          : 0;
        
        // Set dashboard stats
        setDashboardStats({
          activeChallenges: challengeIds.length,
          totalSubmissions: submissionsWithDetails?.length || 0,
          candidatesEngaged: uniqueParticipants.size,
          averageScore: parseFloat(averageScore.toFixed(1)),
        });
        
        // Set recent submissions
        setRecentSubmissions(submissionsWithDetails.slice(0, 5) || []);
        
        // Fetch top challenges based on participation
        const { data: topChallengesData, error: topChallengesError } = await supabase
          .from('challenges')
          .select('*, challenge_participants(count)')
          .eq('company', companyName)
          .order('participants', { ascending: false })
          .limit(5);
          
        if (topChallengesError) throw topChallengesError;
        
        setTopChallenges(topChallengesData || []);
        
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Failed to load dashboard data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const handleCreateChallenge = () => {
    navigate("/app/company/challenges/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
        <Button onClick={handleCreateChallenge}>Create Challenge</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeChallenges}</div>
            <p className="text-xs text-muted-foreground">Total active challenges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Across all challenges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates Engaged</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.candidatesEngaged}</div>
            <p className="text-xs text-muted-foreground">Unique participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all submissions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Latest submissions across your challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">Loading submissions...</div>
            ) : recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{submission.challenges?.title || 'Unnamed Challenge'}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>by {submission.profiles?.full_name || 'Anonymous User'}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/app/company/submissions/${submission.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No submissions found
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Challenges</CardTitle>
            <CardDescription>
              Challenges with highest participation rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">Loading challenges...</div>
            ) : topChallenges.length > 0 ? (
              <div className="space-y-4">
                {topChallenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {challenge.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
                          {challenge.participants} Submissions
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full">
                          Active
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/app/company/challenges/${challenge.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No challenges found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
