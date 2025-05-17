import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ActiveChallenge = {
  id: string;
  title: string;
  company: string;
  progress: number;
  daysLeft: number;
  status: string;
};

export type Achievement = {
  title: string;
  description: string;
  date: string;
};

export type DashboardData = {
  ongoingChallenges: number;
  badgesEarned: number;
  careerScore: number;
  nextLevelPoints: number;
  activeChallenges: ActiveChallenge[];
  achievements: Achievement[];
  rank: number;
  percentile: number;
};

type ChallengeParticipation = {
  challenge_id: string;
  joined_at: string;
  challenges: {
    id: string;
    title: string;
    company: string;
    deadline: string;
  };
}

type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
  user_type?: "participant" | "company" | null;
  company_name?: string | null;
  score?: number | null;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch profile information
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        // Fetch user's challenges (participated)
        const { data: participatedChallenges, error: participationError } = await supabase
          .from('challenge_participants')
          .select('challenge_id, joined_at, challenges(id, title, company, deadline)')
          .eq('user_id', user.id);

        if (participationError) throw participationError;
        
        // Fetch user's submissions
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id);

        if (submissionsError) throw submissionsError;

        // Process challenges
        const now = new Date();
        const typedParticipatedChallenges = participatedChallenges as unknown as ChallengeParticipation[];
        const activeChallenges = typedParticipatedChallenges
          .filter(pc => pc.challenges) // Filter out any null challenges
          .map(pc => {
            const challenge = pc.challenges;
            const deadline = new Date(challenge.deadline);
            const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            // Check if user has submitted for this challenge
            const challengeSubmission = submissions.find(s => s.challenge_id === challenge.id);
            const status = challengeSubmission ? 'In Progress' : 'Joined';
            
            // Calculate progress (this is just an example - you may want a more sophisticated calculation)
            const progress = challengeSubmission ? 
              (challengeSubmission.status === 'reviewed' ? 100 : 50) : 0;
            
            return {
              id: challenge.id,
              title: challenge.title,
              company: challenge.company,
              progress: progress,
              daysLeft: daysLeft,
              status: status
            };
          })
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 3); // Get top 3
        
        // Create achievements list
        // This is simplified - in a real app, you might have an achievements table
        const achievements = submissions
          .filter(s => s.status === 'reviewed')
          .map(s => {
            return {
              title: s.score && s.score > 80 ? "High Score Achievement" : "Challenge Completed",
              description: `Score: ${s.score || 'N/A'} - ${s.feedback || 'No feedback provided'}`,
              date: new Date(s.submitted_at).toLocaleDateString()
            };
          })
          .slice(0, 3); // Get top 3
        
        // Calculate rank and percentile (this would typically be from a leaderboard or dedicated calculation)
        // Using placeholder values for now
        const rank = 42; // This would come from a rank calculation or leaderboard position
        const percentile = 10; // This would come from a percentile calculation
        
        // Get the career score from the profile
        const typedProfile = profileData as unknown as Profile | null;
        const careerScore = typedProfile?.score || 0;
        
        // Construct the dashboard data
        setData({
          ongoingChallenges: typedParticipatedChallenges.length,
          badgesEarned: 5, // Placeholder - could come from a badges table
          careerScore: careerScore,
          nextLevelPoints: 150, // Placeholder - could be calculated based on levels
          activeChallenges: activeChallenges,
          achievements: achievements,
          rank: rank,
          percentile: percentile
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { data, loading, error };
}; 