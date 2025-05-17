
import React from "react";
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
  TabsTrigger
} from "@/components/ui";
import {
  Calendar,
  ChevronLeft,
  Github,
  HelpCircle,
  LucideIcon,
  Star,
  Upload,
  Users,
  Video
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const challenge = challengesData.find(c => c.id === id);

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
                  <AvatarImage src={challenge.companyLogo} alt={challenge.company} />
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
          <Button className="shrink-0" size="lg">
            Enter Challenge
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
              <div dangerouslySetInnerHTML={{ __html: challenge.longDescription }} />
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
                  {challenge.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-yellow-100 text-yellow-600" : index === 1 ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-600"}`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{prize.position}</h3>
                        <p className="text-sm text-muted-foreground">{prize.reward}</p>
                      </div>
                    </div>
                  ))}
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
                    {challenge.requirements.submission.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Evaluation Criteria</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {challenge.requirements.evaluation.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
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
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button>Submit Solution</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  The leaderboard will be available once participants start submitting their solutions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengeDetails;
