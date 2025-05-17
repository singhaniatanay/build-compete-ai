
import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Code, 
  Building, 
  Trophy, 
  Users, 
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              AI Challenge Arena
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-[800px]">
              Where AI practitioners solve real-world challenges and companies find top talent
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row mt-6">
            <Link to="/challenges">
              <Button className="gap-2">
                Browse Challenges <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/company">
              <Button variant="outline" className="gap-2">
                For Companies <Building className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground">
                Our platform connects AI practitioners with real-world challenges from companies
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Solve Challenges</h3>
              <p className="text-muted-foreground">
                Participate in real-world AI challenges posted by companies looking for talent
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Get Recognized</h3>
              <p className="text-muted-foreground">
                Earn badges and climb the leaderboard with your skills and innovative solutions
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Building className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Connect with Companies</h3>
              <p className="text-muted-foreground">
                Get noticed by companies looking for AI talent based on your actual skills
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Candidates Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                For AI Practitioners
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Showcase Your AI Skills
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Prove your abilities by solving real-world challenges and build a portfolio of work that matters
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Participate in challenges created by real companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Get your solutions scored by both AI and human judges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Earn badges and recognition for your skills</span>
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/challenges">
                  <Button className="gap-2">
                    Find Challenges <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last bg-muted flex items-center justify-center">
              <div className="text-muted-foreground">Candidate Journey Illustration</div>
            </div>
          </div>
        </div>
      </div>

      {/* For Companies Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full bg-muted flex items-center justify-center">
              <div className="text-muted-foreground">Company Dashboard Illustration</div>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                For Companies
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Find Top AI Talent
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Evaluate candidates based on how they solve your actual business problems
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Create challenges based on your specific business needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Review submissions with our hybrid scoring system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Connect directly with top-performing candidates</span>
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/company">
                  <Button className="gap-2">
                    Post a Challenge <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[900px] text-muted-foreground">
                Join our platform today and start your journey in the AI Challenge Arena
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/challenges">
                <Button className="gap-2">
                  Join as Participant <Users className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/company">
                <Button variant="outline" className="gap-2">
                  Join as Company <Building className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
