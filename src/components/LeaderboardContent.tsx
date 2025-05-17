import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

interface LeaderboardSubmission {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  score: number;
  submitted_at: string;
  github_url?: string;
}

interface LeaderboardContentProps {
  challengeId?: string;
}

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ challengeId }) => {
  const [submissions, setSubmissions] = useState<LeaderboardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!challengeId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // First fetch the submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select(`
            id,
            user_id,
            score,
            submitted_at,
            github_url
          `)
          .eq("challenge_id", challengeId)
          .eq("status", "reviewed") // Only show reviewed submissions
          .order("score", { ascending: false });
        
        if (submissionsError) throw submissionsError;
        if (!submissionsData || submissionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        console.log("Submissions data:", submissionsData);
        
        // Then fetch user profiles directly with a join
        // This approach does a direct join with auth.users which should work better
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', submissionsData.map(sub => sub.user_id));
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Profiles data:", profilesData);
        
        // Create a map of user_id to profile data for easy lookup
        const profilesMap: Record<string, any> = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }
        
        console.log("Profiles map:", profilesMap);
        
        // Combine the data
        const formattedData = submissionsData.map((item) => {
          const profile = profilesMap[item.user_id];
          console.log(`Lookup for user_id ${item.user_id}:`, profile);
          
          return {
            id: item.id,
            user_id: item.user_id,
            user_name: profile ? profile.full_name || "Unnamed User" : "Anonymous User",
            user_avatar: profile ? profile.avatar_url : undefined,
            score: item.score || 0,
            submitted_at: item.submitted_at,
            github_url: item.github_url
          };
        });
        
        console.log("Final formatted data:", formattedData);
        setSubmissions(formattedData);
      } catch (err: any) {
        console.error("Error fetching submissions:", err);
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [challengeId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No scored submissions yet. Be the first to submit your solution!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead className="hidden lg:table-cell">Repository</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission, index) => (
            <TableRow key={submission.id} className={index < 3 ? "bg-arena-50/50" : ""}>
              <TableCell className="font-medium">
                {index < 3 ? (
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    index === 0 
                      ? "bg-yellow-100 text-yellow-600" 
                      : index === 1 
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-amber-100 text-amber-600"
                  }`}>
                    {index + 1}
                  </div>
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={submission.user_avatar || ""} />
                    <AvatarFallback>
                      {submission.user_name
                        .split(" ")
                        .map((n) => n?.[0] || "")
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{submission.user_name}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs w-fit mt-1">
                        <Trophy className="h-3 w-3 mr-1" /> Leader
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{submission.score}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(submission.submitted_at)}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {submission.github_url ? (
                  <a 
                    href={submission.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Code
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardContent; 