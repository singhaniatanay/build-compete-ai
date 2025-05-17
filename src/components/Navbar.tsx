import React, { useEffect } from "react";
import { Bell, Github, Moon, Sun, User, LogOut, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, signOut, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  // Log user object for debugging
  useEffect(() => {
    if (user) {
      console.log("User object:", user);
    }
  }, [user]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  // Check if user has GitHub connected
  const isGithubConnected = () => {
    // Check if user exists
    if (!user) return false;
    
    // Supabase stores OAuth provider info in various places
    // Check user_metadata first (contains 3rd party profile data)
    if (user.user_metadata?.avatar_url?.includes('github')) return true;
    
    // Check if provider is explicitly set
    if (user.app_metadata?.provider === 'github') return true;
    
    // Check identities (array of linked providers)
    const identities = user.identities || [];
    return identities.some(identity => identity.provider === 'github');
  };

  const handleGithubConnect = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (isGithubConnected()) {
      toast.success("GitHub is already connected to your account");
    } else {
      signInWithGithub();
    }
  };

  return (
    <header className="border-b bg-card px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-xl font-bold hidden sm:block">AI Challenge Arena</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-arena-600 text-[10px] text-white">
              3
            </span>
          </Button>
          
          <Button 
            variant={isGithubConnected() ? "secondary" : "outline"} 
            size="sm" 
            className={`gap-2 hidden md:flex ${isGithubConnected() ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800" : ""}`}
            onClick={handleGithubConnect}
          >
            {isGithubConnected() ? (
              <>
                <Check className="h-4 w-4" />
                <span>GitHub Connected</span>
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                <span>Connect GitHub</span>
              </>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/app/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
