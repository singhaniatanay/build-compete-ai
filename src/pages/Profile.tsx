import React, { useEffect, useState } from "react";
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Calendar, Edit, Github, Mail, MapPin, Trophy, Upload, User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define types for profile data
interface ProfileData {
  name: string;
  username: string;
  avatar: string | null;
  email: string;
  location: string | null;
  github: string | null;
  bio: string | null;
  joinedDate: string;
  stats: {
    score: number;
    rank: number;
    challenges: number;
    badges: string[];
  };
  skills: string[];
  achievements: {
    title: string;
    description: string;
    date: string;
    icon: React.FC<any>;
  }[];
  submissions: {
    challengeId: string;
    challenge: string;
    company: string;
    rank: number | null;
    score: number | null;
    date: string;
    status: string;
  }[];
}

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch user challenge participations
        const { data: participations, error: participationsError } = await supabase
          .from('challenge_participants')
          .select('*, challenges(*)')
          .eq('user_id', user.id);
          
        if (participationsError) throw participationsError;
        
        // Fetch user submissions
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('*, challenges(*)')
          .eq('user_id', user.id);
          
        if (submissionsError) throw submissionsError;
        
        // Calculate user score (sum of all submission scores or 0)
        const totalScore = submissions?.reduce((sum, submission) => sum + (submission.score || 0), 0) || 0;

        // Format the data to match our UI requirements
        const formattedProfile: ProfileData = {
          name: profileData?.full_name || user.email?.split('@')[0] || "Anonymous User",
          username: user.email?.split('@')[0] || "user",
          avatar: profileData?.avatar_url,
          email: user.email || "",
          location: null,
          github: null,
          bio: null,
          joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          stats: {
            score: totalScore,
            rank: 0,
            challenges: participations?.length || 0,
            badges: ["New User"],
          },
          skills: [],
          achievements: [
            {
              title: "Joined Build & Compete AI",
              description: "Started your AI building journey with us",
              date: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              icon: Trophy,
            },
          ],
          submissions: submissions?.map(submission => ({
            challengeId: submission.challenge_id,
            challenge: submission.challenges.title,
            company: submission.challenges.company,
            rank: null,
            score: submission.score || null,
            date: new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            status: capitalized(submission.status) || "Pending",
          })) || []
        };
        
        // Add participation entries that don't have submissions yet
        const submittedChallengeIds = new Set(submissions?.map(s => s.challenge_id) || []);
        const joinedChallenges = participations?.filter(p => !submittedChallengeIds.has(p.challenge_id)) || [];
        
        joinedChallenges.forEach(participation => {
          formattedProfile.submissions.push({
            challengeId: participation.challenge_id,
            challenge: participation.challenges.title,
            company: participation.challenges.company,
            rank: null,
            score: null,
            date: new Date(participation.joined_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            status: "Joined",
          });
        });
        
        setProfileData(formattedProfile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Fallback to basic profile in case of errors
        setProfileData({
          name: user.email?.split('@')[0] || "User",
          username: user.email?.split('@')[0] || "user",
          avatar: null,
          email: user.email || "",
          location: null,
          github: null,
          bio: null,
          joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          stats: {
            score: 0,
            rank: 0,
            challenges: 0,
            badges: ["New User"],
          },
          skills: [],
          achievements: [],
          submissions: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user]);

  // Helper function to capitalize first letter
  function capitalized(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold">Profile Not Found</h2>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader className="relative">
            <Button variant="outline" size="icon" className="absolute right-6 top-6">
              <Edit className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {profileData.avatar ? (
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                ) : (
                  <AvatarFallback className="text-xl">{profileData.name.charAt(0)}{profileData.name.split(" ")[1]?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <CardTitle>{profileData.name}</CardTitle>
              <CardDescription>@{profileData.username}</CardDescription>
              <div className="mt-2 flex gap-1">
                {profileData.stats.badges.map((badge, i) => (
                  <Badge key={i} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-semibold">{profileData.stats.score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-semibold">#{profileData.stats.rank || '-'}</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-semibold">{profileData.stats.challenges}</div>
                <div className="text-xs text-muted-foreground">Challenges</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-semibold">{profileData.stats.badges.length}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              {profileData.bio && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData.bio}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              {profileData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
              )}
              {profileData.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileData.github}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {profileData.joinedDate}</span>
              </div>
            </div>
            
            <Separator />
            
            {profileData.skills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {profileData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="submissions">
            <TabsList>
              <TabsTrigger value="submissions">Challenge Submissions</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submissions" className="space-y-4 mt-4">
              <h2 className="text-xl font-bold">Challenge Submissions</h2>
              
              {profileData.submissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No submissions yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                      You haven't submitted any solutions to challenges yet. Browse challenges and start your AI journey!
                    </p>
                    <Button className="mt-4">Browse Challenges</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {profileData.submissions.map((submission, i) => (
                    <Card key={i} className="card-hover">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{submission.challenge}</CardTitle>
                            <CardDescription>{submission.company}</CardDescription>
                          </div>
                          <Badge variant={submission.status === "Reviewed" ? "secondary" : submission.status === "Joined" ? "default" : "outline"}>
                            {submission.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Rank</p>
                            <p className="font-medium">
                              {submission.rank !== null ? `#${submission.rank}` : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-medium">
                              {submission.score !== null ? submission.score : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Submitted</p>
                            <p className="font-medium">{submission.date}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-4 mt-4">
              <h2 className="text-xl font-bold">Achievements</h2>
              
              {profileData.achievements.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Award className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No achievements yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                      Complete challenges and earn achievements to display here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {profileData.achievements.map((achievement, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="rounded-full bg-arena-100 p-2 h-10 w-10 flex items-center justify-center">
                            <achievement.icon className="h-5 w-5 text-arena-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
