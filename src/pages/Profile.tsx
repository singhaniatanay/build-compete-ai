
import React from "react";
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
import { Award, Calendar, Edit, Github, Mail, MapPin, Trophy, Upload, User } from "lucide-react";

// Mock profile data
const profileData = {
  name: "John Doe",
  username: "johndoe",
  avatar: null,
  email: "john.doe@example.com",
  location: "San Francisco, CA",
  github: "github.com/johndoe",
  bio: "AI engineer with expertise in LLMs and computer vision. Passionate about building practical AI solutions that solve real-world problems.",
  joinedDate: "May 2023",
  stats: {
    score: 456,
    rank: 42,
    challenges: 3,
    badges: ["New Challenger"],
  },
  skills: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "NLP", "LLM Fine-tuning"],
  achievements: [
    {
      title: "First Challenge Completed",
      description: "Successfully submitted a solution to your first challenge",
      date: "3 weeks ago",
      icon: Trophy,
    },
    {
      title: "Badge Earned: New Challenger",
      description: "Awarded to users who enter their first challenge",
      date: "3 weeks ago",
      icon: Award,
    },
  ],
  submissions: [
    {
      challengeId: "1",
      challenge: "LLM-based Summarization Engine",
      company: "AI Research Labs",
      rank: 18,
      score: 456,
      date: "3 weeks ago",
      status: "Completed",
    },
    {
      challengeId: "3",
      challenge: "Conversational AI Assistant",
      company: "ChatSystems",
      rank: null,
      score: null,
      date: "1 week ago",
      status: "In Progress",
    },
  ],
};

const Profile = () => {
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
                <AvatarFallback className="text-xl">{profileData.name.charAt(0)}{profileData.name.split(" ")[1]?.charAt(0)}</AvatarFallback>
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
                <div className="text-2xl font-semibold">#{profileData.stats.rank}</div>
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
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.bio}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.github}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {profileData.joinedDate}</span>
              </div>
            </div>
            
            <Separator />
            
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
                          <Badge variant={submission.status === "Completed" ? "secondary" : "outline"}>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
