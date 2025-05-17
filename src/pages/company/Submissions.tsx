import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Badge,
} from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Users, FileText } from "lucide-react";

interface Submission {
  id: string;
  challenge_id: string;
  challenge_title: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  submitted_at: string;
  score?: number;
  status: "pending" | "reviewed" | "rejected";
  feedback?: string;
  github_url?: string;
}

interface Participant {
  id: string;
  challenge_id: string;
  challenge_title: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  joined_at: string;
  has_submitted: boolean;
}

interface Challenge {
  id: string;
  title: string;
}

const CompanySubmissions = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("id, title")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching challenges:", error);
          return;
        }

        setChallenges(data || []);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (activeTab !== "submissions") return;
      
      setLoading(true);
      try {
        let query = supabase
          .from("submissions")
          .select(`
            id,
            challenge_id,
            challenges(title),
            user_id,
            profiles(full_name, email, avatar_url),
            submitted_at,
            score,
            status,
            feedback,
            github_url
          `);

        if (selectedChallenge !== "all") {
          query = query.eq("challenge_id", selectedChallenge);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching submissions:", error);
          return;
        }

        const formattedData = data?.map((item) => ({
          id: item.id,
          challenge_id: item.challenge_id,
          challenge_title: item.challenges?.title || "Untitled Challenge",
          user_id: item.user_id,
          user_name: item.profiles?.full_name || "Anonymous",
          user_email: item.profiles?.email || "",
          user_avatar: item.profiles?.avatar_url,
          submitted_at: item.submitted_at,
          score: item.score,
          status: item.status,
          feedback: item.feedback,
          github_url: item.github_url,
        }));

        setSubmissions(formattedData || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchParticipants = async () => {
      if (activeTab !== "participants") return;
      
      setLoading(true);
      try {
        let query = supabase
          .from("challenge_participants")
          .select(`
            id,
            challenge_id,
            challenges(title),
            user_id,
            profiles(full_name, email, avatar_url),
            joined_at,
            submissions(id)
          `);

        if (selectedChallenge !== "all") {
          query = query.eq("challenge_id", selectedChallenge);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching participants:", error);
          return;
        }

        const formattedData = data?.map((item) => ({
          id: item.id,
          challenge_id: item.challenge_id,
          challenge_title: item.challenges?.title || "Untitled Challenge",
          user_id: item.user_id,
          user_name: item.profiles?.full_name || "Anonymous",
          user_email: item.profiles?.email || "",
          user_avatar: item.profiles?.avatar_url,
          joined_at: item.joined_at,
          has_submitted: item.submissions && item.submissions.length > 0,
        }));

        setParticipants(formattedData || []);
      } catch (err) {
        console.error("Error fetching participants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "submissions") {
      fetchSubmissions();
    } else if (activeTab === "participants") {
      fetchParticipants();
    }
  }, [activeTab, selectedChallenge]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Submissions & Participants</h1>
          <p className="text-muted-foreground">
            Manage challenge submissions and view participant information
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
          >
            <option value="all">All Challenges</option>
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
          <Button disabled={submissions.length === 0}>
            <Download className="mr-1 h-4 w-4" />
            Export as CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="submissions" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="submissions">
            <FileText className="mr-1 h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="participants">
            <Users className="mr-1 h-4 w-4" />
            Participants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Submissions</CardTitle>
              <CardDescription>
                View and manage submissions for your challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No submissions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={submission.user_avatar || ""} />
                            <AvatarFallback>
                              {submission.user_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{submission.user_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {submission.user_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{submission.challenge_title}</TableCell>
                        <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              submission.status === "reviewed"
                                ? "success"
                                : submission.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {submission.status === "reviewed"
                              ? "Reviewed"
                              : submission.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {submission.score !== null && submission.score !== undefined
                            ? submission.score
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Participants</CardTitle>
              <CardDescription>
                View all users who have joined your challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading participants...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No participants found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Joined On</TableHead>
                      <TableHead>Submission Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.user_avatar || ""} />
                            <AvatarFallback>
                              {participant.user_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{participant.user_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {participant.user_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{participant.challenge_title}</TableCell>
                        <TableCell>{formatDate(participant.joined_at)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={participant.has_submitted ? "success" : "outline"}
                          >
                            {participant.has_submitted ? "Submitted" : "Not Submitted"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySubmissions;
