import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Separator,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Input,
  Label,
  Textarea,
  Alert,
  AlertDescription
} from "@/components/ui";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Github,
  HelpCircle,
  Loader2,
  LucideIcon,
  Star,
  Upload,
  Users,
  Video,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import LeaderboardContent from "@/components/LeaderboardContent";

// Mock challenge data
const challengesData = [
  {
    id: "1",
    title: "LLM-based Summarization Engine",
    company: "AI Research Labs",
    companyLogo: "/placeholder.svg",
    description: "Build an LLM-powered engine that can summarize technical documents with high accuracy and low hallucination rates.",
    longDescription: `
      <p class="mb-4">Your task is to build a summarization engine that can process technical documents and produce concise, accurate summaries without hallucinations or factual errors.</p>
      
      <h3 class="text-lg font-semibold mb-2">Requirements:</h3>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Handle documents up to 20 pages in length</li>
        <li>Create summaries of variable length (short, medium, long)</li>
        <li>Maintain factual accuracy with minimal hallucination</li>
        <li>Support for technical content with field-specific terminology</li>
        <li>Proper handling of citations and references</li>
      </ul>
      
      <h3 class="text-lg font-semibold mb-2">Evaluation Criteria:</h3>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Accuracy: How factually correct is the summary?</li>
        <li>Conciseness: Does the summary capture key information without redundancy?</li>
        <li>Readability: Is the summary well-structured and easy to understand?</li>
        <li>Technical handling: How well does the system handle domain-specific terminology?</li>
        <li>Performance: How efficient is the system in terms of speed and resource usage?</li>
      </ul>
      
      <p class="mb-4">You may use any LLM or combination of models, but your solution should be well-documented and include a clear explanation of your approach.</p>
    `,
    difficulty: "Intermediate",
    participants: 128,
    deadline: "June 5, 2025",
    daysLeft: 5,
    tags: ["NLP", "LLM", "Summarization"],
    featured: true,
    prizes: [
      { position: "1st Place", reward: "$5,000 + Job Interview" },
      { position: "2nd Place", reward: "$2,500" },
      { position: "3rd Place", reward: "$1,000" },
    ],
    requirements: {
      submission: ["GitHub repository link", "2-minute demo video", "5-page presentation deck"],
      evaluation: ["Automated LLM scoring (40%)", "Human expert review (60%)"]
    }
  },
];

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const SubmissionStep: React.FC<StepProps> = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-arena-200 bg-arena-100 text-arena-600">
          {number}
        </div>
        <div className="h-full w-px bg-arena-200" />
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-arena-600" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// Supabase Client Setup (replace with your actual URL and anon key)
// It's recommended to store these in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Existing interfaces
  interface Challenge {
    id: string;
    title: string;
    company: string;
    company_logo_url?: string;
    description: string;
    long_description: string;
    difficulty: string;
    participants: number;
    deadline: string;
    daysLeft?: number;
    tags: string[];
    featured: boolean;
    prizes?: Array<{
      position: string;
      reward: string;
    }> | null;
    requirements?: {
      submission: string[];
      evaluation: string[];
    } | null;
  }

  interface SubmissionForm {
    github_url: string;
    video_url: string;
    presentation_url: string;
    description: string;
  }

  // Existing state
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChallengeJoined, setIsChallengeJoined] = useState(false);
  const [joiningChallenge, setJoiningChallenge] = useState(false);
  
  // New state for submission
  const [submissionForm, setSubmissionForm] = useState<SubmissionForm>({
    github_url: '',
    video_url: '',
    presentation_url: '',
    description: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (!id) {
        setError("No challenge ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .single(); // Use .single() as we expect one record or null

        if (supabaseError) {
          if (supabaseError.code === 'PGRST116') { // PGRST116: Row not found
            setChallenge(null); // Explicitly set to null if not found
          } else {
            throw supabaseError;
          }
        }
        
        if (data) {
          // Calculate daysLeft if deadline is present
          let daysLeftCalc = undefined;
          if (data.deadline) {
            const deadlineDate = new Date(data.deadline);
            const today = new Date();
            const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
            daysLeftCalc = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          setChallenge({ 
            ...data, 
            daysLeft: daysLeftCalc,
            // Ensure prizes and requirements are initialized if null
            prizes: data.prizes || [],
            requirements: data.requirements || { submission: [], evaluation: [] }
          } as Challenge);
        } else {
          setChallenge(null); // Ensure challenge is null if no data and no error other than not found
        }

      } catch (err: any) {
        console.error(`Error fetching challenge details for ID ${id}:`, err);
        setError(err.message || "Failed to fetch challenge details. Please ensure Supabase is configured correctly.");
      }
      setLoading(false);
    };

    fetchChallengeDetails();
  }, [id]);

  useEffect(() => {
    const checkIfJoined = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_participants')
          .select('*')
          .eq('challenge_id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
          console.error("Error checking participation:", error);
          return;
        }
        
        setIsChallengeJoined(!!data);
      } catch (err) {
        console.error("Error checking if user joined challenge:", err);
      }
    };
    
    const checkSubmissionStatus = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('challenge_id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking submission status:", error);
          return;
        }
        
        if (data) {
          setHasSubmitted(true);
          setSubmissionStatus(data.status || 'pending');
        }
      } catch (err) {
        console.error("Error checking submission status:", err);
      }
    };
    
    checkIfJoined();
    checkSubmissionStatus();
  }, [id, user]);

  const handleJoinChallenge = async () => {
    if (!user) {
      toast.error("You must be logged in to join a challenge");
      return;
    }
    
    if (!challenge) return;
    
    try {
      setJoiningChallenge(true);
      
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });
      
      if (error) {
        // Check for duplicate violation (user already joined)
        if (error.code === '23505') { // PostgreSQL unique violation code
          toast.error("You have already joined this challenge");
        } else {
          toast.error("Failed to join challenge: " + error.message);
          console.error("Error joining challenge:", error);
        }
      } else {
        setIsChallengeJoined(true);
        toast.success(`You've successfully joined "${challenge.title}"`);
      }
    } catch (err) {
      console.error("Error joining challenge:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setJoiningChallenge(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmissionForm({
      ...submissionForm,
      [name]: value
    });
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!submissionForm.github_url.trim()) {
      errors.github_url = "GitHub repository URL is required";
    } else if (!submissionForm.github_url.includes('github.com')) {
      errors.github_url = "Please provide a valid GitHub URL";
    }
    
    if (!submissionForm.video_url.trim()) {
      errors.video_url = "Demo video URL is required";
    }
    
    if (!submissionForm.presentation_url.trim()) {
      errors.presentation_url = "Presentation URL is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const triggerAutomaticEvaluation = async (submissionId: string) => {
    try {
      // This would typically be an API call to your evaluation service
      // For this example, we'll simulate the process with a timeout
      
      // In a real application, you might have an endpoint like:
      // await fetch('https://your-evaluation-service.com/evaluate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ submissionId })
      // });
      
      console.log(`Triggered automatic evaluation for submission ID: ${submissionId}`);
      
      // Simulate processing time
      setTimeout(async () => {
        // Update the submission status to reviewed after evaluation
        try {
          await supabase
            .from('submissions')
            .update({
              status: 'reviewed',
              score: Math.floor(Math.random() * 100), // Random score for demo purposes
              feedback: "Your submission has been automatically evaluated."
            })
            .eq('id', submissionId);
            
          setSubmissionStatus('reviewed');
          toast.success("Your submission has been evaluated!");
        } catch (err) {
          console.error("Error updating submission after evaluation:", err);
        }
      }, 5000); // 5 seconds delay to simulate processing
    } catch (err) {
      console.error("Error triggering evaluation:", err);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a solution");
      return;
    }
    
    if (!challenge || !id) return;
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert submission into the database
      const { data: submissionData, error } = await supabase
        .from('submissions')
        .insert({
          challenge_id: id,
          user_id: user.id,
          github_url: submissionForm.github_url,
          video_url: submissionForm.video_url,
          presentation_url: submissionForm.presentation_url,
          description: submissionForm.description,
          submitted_at: new Date().toISOString(),
          status: 'pending'
        })
        .select(); // Return the inserted record
      
      if (error) {
        // Check for duplicate submission
        if (error.code === '23505') {
          toast.error("You have already submitted a solution for this challenge");
        } else {
          toast.error("Failed to submit solution: " + error.message);
          console.error("Error submitting solution:", error);
        }
      } else {
        setHasSubmitted(true);
        setSubmissionStatus('pending');
        toast.success("Solution submitted successfully! It's now under review.");
        
        // Trigger automatic evaluation
        if (submissionData && submissionData.length > 0) {
          triggerAutomaticEvaluation(submissionData[0].id);
        }
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) {
    return (
      <div className="container py-12 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Challenge Not Found</h2>
        <p className="mt-2 text-muted-foreground">The challenge you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" asChild>
          <Link to="/challenges">Back to Challenges</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container space-y-6 pb-10 animate-fade-in">
      <div>
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/challenges">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to challenges
          </Link>
        </Button>

        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {challenge.title}
              {challenge.featured && (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={challenge.company_logo_url || '/placeholder.svg'} alt={challenge.company} />
                  <AvatarFallback>{challenge.company.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{challenge.company}</span>
              </div>
              <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
              <Badge variant="outline">{challenge.difficulty}</Badge>
              <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{challenge.participants} participants</span>
              </div>
              <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {challenge.deadline}</span>
              </div>
            </div>
          </div>
          <Button 
            className="shrink-0" 
            size="lg" 
            onClick={handleJoinChallenge} 
            disabled={isChallengeJoined || joiningChallenge}
          >
            {isChallengeJoined ? 
              "Challenge Joined" : 
              joiningChallenge ? 
                <>
                  <Loader2 className="animate-spin" />
                  Joining...
                </> : 
                "Join Challenge"
            }
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: challenge.long_description }} />
              <div className="mt-4 flex flex-wrap gap-2">
                {challenge.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenge.prizes && challenge.prizes.length > 0 ? (
                    challenge.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-yellow-100 text-yellow-600" : index === 1 ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-600"}`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{prize.position}</h3>
                          <p className="text-sm text-muted-foreground">{prize.reward}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No prizes have been specified for this challenge.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Submission</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {challenge.requirements && challenge.requirements.submission ? (
                      challenge.requirements.submission.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))
                    ) : (
                      <li>No submission requirements specified</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Evaluation Criteria</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {challenge.requirements && challenge.requirements.evaluation ? (
                      challenge.requirements.evaluation.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))
                    ) : (
                      <li>No evaluation criteria specified</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submission">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Solution</CardTitle>
            </CardHeader>
            <CardContent>
              {!isChallengeJoined ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to join the challenge before submitting a solution.
                  </AlertDescription>
                </Alert>
              ) : hasSubmitted ? (
                <div className="space-y-4">
                  <Alert className={`${submissionStatus === 'reviewed' ? 'bg-green-50' : 'bg-yellow-50'} border ${submissionStatus === 'reviewed' ? 'border-green-200' : 'border-yellow-200'}`}>
                    {submissionStatus === 'reviewed' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <AlertDescription className={submissionStatus === 'reviewed' ? 'text-green-800' : 'text-yellow-800'}>
                      {submissionStatus === 'reviewed' 
                        ? "Your submission has been reviewed and scored! Check the leaderboard for your ranking."
                        : "Your solution has been submitted and is currently being reviewed."}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    <SubmissionStep
                      number={1}
                      title="GitHub Repository"
                      description="Link your GitHub repository containing the code for your solution"
                      icon={Github}
                    />
                    <SubmissionStep
                      number={2}
                      title="Demo Video"
                      description="Upload a 2-minute demo video showcasing your solution"
                      icon={Video}
                    />
                    <SubmissionStep
                      number={3}
                      title="Presentation Deck"
                      description="Upload a presentation deck explaining your approach (5 pages max)"
                      icon={Upload}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitSolution} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub Repository URL *</Label>
                      <Input 
                        id="github_url" 
                        name="github_url"
                        placeholder="https://github.com/yourusername/your-repo" 
                        value={submissionForm.github_url}
                        onChange={handleInputChange}
                        className={formErrors.github_url ? 'border-red-500' : ''}
                      />
                      {formErrors.github_url && (
                        <p className="text-sm text-red-500">{formErrors.github_url}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video_url">Demo Video URL *</Label>
                      <Input 
                        id="video_url" 
                        name="video_url"
                        placeholder="https://www.youtube.com/watch?v=your-video-id" 
                        value={submissionForm.video_url}
                        onChange={handleInputChange}
                        className={formErrors.video_url ? 'border-red-500' : ''}
                      />
                      {formErrors.video_url && (
                        <p className="text-sm text-red-500">{formErrors.video_url}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="presentation_url">Presentation URL *</Label>
                      <Input 
                        id="presentation_url" 
                        name="presentation_url"
                        placeholder="https://docs.google.com/presentation/d/your-presentation-id" 
                        value={submissionForm.presentation_url}
                        onChange={handleInputChange}
                        className={formErrors.presentation_url ? 'border-red-500' : ''}
                      />
                      {formErrors.presentation_url && (
                        <p className="text-sm text-red-500">{formErrors.presentation_url}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Additional Notes (Optional)</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="Any additional information about your submission..." 
                        value={submissionForm.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Solution"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading submissions...</p>
                </div>
              ) : (
                <LeaderboardContent challengeId={id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengeDetails;
