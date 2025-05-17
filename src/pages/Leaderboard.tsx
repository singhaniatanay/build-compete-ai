
import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { Award, ChevronDown, ChevronUp, Search, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Mock leaderboard data
const leaderboardData = [
  {
    rank: 1,
    name: "Alex Johnson",
    username: "alexj",
    score: 1254,
    challenges: 8,
    winRate: "75%",
    avatar: "AJ",
    badges: ["Top 1%", "Challenge Winner", "Quick Solver"],
  },
  {
    rank: 2,
    name: "Maria Rodriguez",
    username: "mariar",
    score: 1187,
    challenges: 7,
    winRate: "71%",
    avatar: "MR",
    badges: ["Top 1%", "Challenge Winner"],
  },
  {
    rank: 3,
    name: "David Kim",
    username: "davidk",
    score: 1056,
    challenges: 6,
    winRate: "67%",
    avatar: "DK",
    badges: ["Top 5%", "Quick Solver"],
  },
  {
    rank: 4,
    name: "Sarah Thompson",
    username: "saraht",
    score: 984,
    challenges: 5,
    winRate: "60%",
    avatar: "ST",
    badges: ["Top 5%"],
  },
  {
    rank: 5,
    name: "James Wilson",
    username: "jamesw",
    score: 932,
    challenges: 6,
    winRate: "50%",
    avatar: "JW",
    badges: ["Top 10%"],
  },
  {
    rank: 6,
    name: "Emily Chen",
    username: "emilyc",
    score: 897,
    challenges: 4,
    winRate: "75%",
    avatar: "EC",
    badges: ["Top 10%", "Quick Solver"],
  },
  {
    rank: 7,
    name: "Michael Brown",
    username: "michaelb",
    score: 856,
    challenges: 5,
    winRate: "60%",
    avatar: "MB",
    badges: ["Top 10%"],
  },
  {
    rank: 8,
    name: "Olivia Martinez",
    username: "oliviam",
    score: 823,
    challenges: 4,
    winRate: "50%",
    avatar: "OM",
    badges: ["Top 10%"],
  },
  {
    rank: 9,
    name: "Daniel Lee",
    username: "daniell",
    score: 791,
    challenges: 3,
    winRate: "67%",
    avatar: "DL",
    badges: ["Top 15%"],
  },
  {
    rank: 10,
    name: "Sophia Patel",
    username: "sophiap",
    score: 765,
    challenges: 4,
    winRate: "50%",
    avatar: "SP",
    badges: ["Top 15%"],
  },
];

// Your current rank in the leaderboard
const currentUser = {
  rank: 42,
  name: "John Doe",
  username: "johnd",
  score: 456,
  challenges: 3,
  winRate: "33%",
  avatar: "JD",
  badges: ["New Challenger"],
};

const Leaderboard = () => {
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = leaderboardData.filter(participant => 
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container space-y-6 animate-fade-in">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <Badge variant="secondary" className="px-3 py-1">Season 1</Badge>
        </div>
        <p className="text-muted-foreground">
          Global ranking of AI Challenge participants
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="global">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global Ranking</SelectItem>
              <SelectItem value="monthly">Monthly Leaders</SelectItem>
              <SelectItem value="challenge">By Challenge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-card border-b px-6">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-arena-600" />
            Global Rankings
          </CardTitle>
          <CardDescription>
            Based on cumulative score across all challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort("rank")}>
                    <div className="flex items-center gap-1">
                      Rank
                      {sortField === "rank" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                    <div className="flex items-center gap-1">
                      Score
                      {sortField === "score" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("challenges")}>
                    <div className="flex items-center gap-1">
                      Challenges
                      {sortField === "challenges" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("winRate")}>
                    <div className="flex items-center gap-1">
                      Win Rate
                      {sortField === "winRate" && (
                        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((participant) => (
                  <TableRow key={participant.username} className={participant.rank <= 3 ? "bg-arena-50/50" : ""}>
                    <TableCell className="font-medium">
                      {participant.rank <= 3 ? (
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          participant.rank === 1 
                            ? "bg-yellow-100 text-yellow-600" 
                            : participant.rank === 2 
                              ? "bg-gray-100 text-gray-600" 
                              : "bg-amber-100 text-amber-600"
                        }`}>
                          {participant.rank}
                        </div>
                      ) : (
                        participant.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{participant.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{participant.name}</span>
                          <span className="text-xs text-muted-foreground">@{participant.username}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{participant.score}</TableCell>
                    <TableCell className="hidden md:table-cell">{participant.challenges}</TableCell>
                    <TableCell className="hidden md:table-cell">{participant.winRate}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {participant.badges.map((badge, i) => (
                          <Badge key={i} variant={badge.includes("Top") ? "secondary" : "outline"} className="text-xs">
                            {badge === "Challenge Winner" || badge === "Top 1%" ? (
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" /> {badge}
                              </span>
                            ) : badge}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-arena-100 text-arena-600 font-medium">
                #{currentUser.rank}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-sm text-muted-foreground">Score: {currentUser.score}</span>
              </div>
            </div>
            <Button>Improve Ranking</Button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-semibold">{currentUser.challenges}</div>
              <div className="text-xs text-muted-foreground">Challenges</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-semibold">{currentUser.winRate}</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-semibold">{currentUser.badges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
