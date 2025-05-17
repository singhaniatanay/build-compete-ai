import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"participant" | "company">("participant");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGithub } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const signUpResult = await signUp(email, password);
      
      // After signup, update the profile with user type and company name if applicable
      if (signUpResult?.user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: signUpResult.user.id,
            email: email,
            user_type: userType,
            company_name: userType === 'company' ? companyName : null,
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error("Error updating profile:", error);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    
    try {
      // Store user type in localStorage to use after GitHub OAuth
      localStorage.setItem('userType', userType);
      if (userType === 'company') {
        localStorage.setItem('companyName', companyName);
      }
      
      await signInWithGithub();
    } catch (error) {
      console.error("GitHub login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Sign up for a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-type">I am a</Label>
            <Select 
              value={userType} 
              onValueChange={(value) => setUserType(value as "participant" | "company")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="participant">Participant</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userType === "company" && (
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required={userType === "company"}
              />
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGitHubLogin}
            disabled={isLoading || (userType === "company" && !companyName)}
          >
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>

          <div className="relative my-4">
            <Separator className="absolute inset-0 m-auto" />
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading || (userType === "company" && !companyName)}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
