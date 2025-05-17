
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui";
import { Calendar, Clock, Filter, Search, Star, Users } from "lucide-react";

// Mock challenge data
const challengesData = [
  {
    id: "1",
    title: "LLM-based Summarization Engine",
    company: "AI Research Labs",
    description: "Build an LLM-powered engine that can summarize technical documents with high accuracy and low hallucination rates.",
    difficulty: "Intermediate",
    participants: 128,
    daysLeft: 5,
    tags: ["NLP", "LLM", "Summarization"],
    featured: true,
  },
  {
    id: "2",
    title: "Multimodal Content Classifier",
    company: "TechCorp Inc.",
    description: "Create a system that can classify content across text, images and video using a unified ML approach.",
    difficulty: "Advanced",
    participants: 87,
    daysLeft: 12,
    tags: ["Multimodal", "Classification", "Computer Vision"],
    featured: false,
  },
  {
    id: "3",
    title: "Conversational AI Assistant",
    company: "ChatSystems",
    description: "Develop a conversational AI assistant that can handle customer service inquiries for a retail company.",
    difficulty: "Intermediate",
    participants: 156,
    daysLeft: 8,
    tags: ["Conversational AI", "NLP", "Customer Service"],
    featured: true,
  },
  {
    id: "4",
    title: "Recommendation System Optimization",
    company: "StreamFlix",
    description: "Optimize a recommendation system for a streaming platform to improve user engagement and content discovery.",
    difficulty: "Advanced",
    participants: 92,
    daysLeft: 15,
    tags: ["Recommendations", "ML Optimization", "User Engagement"],
    featured: false,
  },
  {
    id: "5",
    title: "Real-time Object Detection",
    company: "SecurityTech",
    description: "Build a real-time object detection system for security cameras that can identify suspicious activities.",
    difficulty: "Advanced",
    participants: 73,
    daysLeft: 10,
    tags: ["Computer Vision", "Object Detection", "Real-time Processing"],
    featured: false,
  },
  {
    id: "6",
    title: "AI-powered Code Assistant",
    company: "DevTools Inc.",
    description: "Create an AI assistant that can help developers write better code through suggestions and bug detection.",
    difficulty: "Intermediate",
    participants: 134,
    daysLeft: 7,
    tags: ["Code Generation", "Developer Tools", "LLM"],
    featured: true,
  },
];

const difficultyColor = {
  Beginner: "green",
  Intermediate: "yellow",
  Advanced: "red",
};

const Challenges = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  const filteredChallenges = challengesData.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "featured") {
      return matchesSearch && challenge.featured;
    }
    
    return matchesSearch;
  });

  return (
    <div className="container space-y-6 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground">
          Discover and participate in real-world AI challenges
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter("all")}>All Challenges</TabsTrigger>
          <TabsTrigger value="featured" onClick={() => setFilter("featured")}>Featured</TabsTrigger>
          <TabsTrigger value="participated">My Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6 mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{challenge.title}</CardTitle>
                    {challenge.featured && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span>{challenge.company}</span>
                    <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
                    <Badge variant="outline">{challenge.difficulty}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {challenge.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {challenge.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/challenges/${challenge.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="featured" className="space-y-6 mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{challenge.title}</CardTitle>
                    {challenge.featured && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span>{challenge.company}</span>
                    <span className="inline-flex h-1 w-1 rounded-full bg-gray-300"></span>
                    <Badge variant="outline">{challenge.difficulty}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {challenge.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {challenge.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/challenges/${challenge.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="participated" className="mt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <div className="rounded-full bg-muted p-6">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No challenges yet</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm">
              You haven't participated in any challenges yet. Browse the available challenges and start your AI journey!
            </p>
            <Button className="mt-4">Browse Challenges</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
