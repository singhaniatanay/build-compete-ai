
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Github, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CompanyCandidates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Pool</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Invite Candidates
          </Button>
          <Button>
            Contact Selected
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search candidates..." 
                className="w-full sm:w-[300px]"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Skills</Button>
              <Button variant="outline" size="sm">All Locations</Button>
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: 1,
                  name: "Alex Johnson",
                  avatar: "AJ",
                  skills: ["Python", "TensorFlow", "Computer Vision"],
                  location: "San Francisco, CA",
                  badges: ["Top 10%", "Challenge Winner"],
                  github: "github.com/alexj"
                },
                {
                  id: 2,
                  name: "Sarah Miller",
                  avatar: "SM",
                  skills: ["NLP", "PyTorch", "Data Science"],
                  location: "Boston, MA",
                  badges: ["Top 10%"],
                  github: "github.com/sarahm"
                },
                {
                  id: 3,
                  name: "David Chen",
                  avatar: "DC",
                  skills: ["JavaScript", "React", "Node.js"],
                  location: "Austin, TX",
                  badges: ["Rising Star"],
                  github: "github.com/davidc"
                },
                {
                  id: 4,
                  name: "Emma Wilson",
                  avatar: "EW",
                  skills: ["Machine Learning", "AWS", "Docker"],
                  location: "Seattle, WA",
                  badges: ["Challenge Winner"],
                  github: "github.com/emmaw"
                },
                {
                  id: 5,
                  name: "Michael Taylor",
                  avatar: "MT",
                  skills: ["Data Analysis", "SQL", "Tableau"],
                  location: "Chicago, IL",
                  badges: [],
                  github: "github.com/michaelt"
                },
              ].map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <span className="font-medium">{candidate.avatar}</span>
                      </div>
                      <div>
                        <div>{candidate.name}</div>
                        <div className="text-xs text-muted-foreground">{candidate.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="rounded-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="bg-arena-100 text-arena-800 dark:bg-arena-800 dark:text-arena-100 rounded-sm">
                          <Star className="mr-1 h-3 w-3 fill-current text-arena-600" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Github className="mr-2 h-3 w-3" />
                        GitHub
                      </Button>
                      <Button size="sm">Contact</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
            <div>Showing 5 of 76 candidates</div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompanyCandidates;
