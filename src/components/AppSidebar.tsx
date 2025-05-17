import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, Award, Code, Home, Users, Trophy, 
  Building, PlusSquare, Settings, CheckSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define menu items for participants
const participantMenuItems = [
  { title: "Dashboard", path: "/app", icon: Home },
  { title: "Challenges", path: "/app/challenges", icon: Code },
  { title: "Leaderboard", path: "/app/leaderboard", icon: BarChart3 },
];

// Define menu items for companies
const companyMenuItems = [
  { title: "Dashboard", path: "/app/company", icon: Home },
  { title: "My Challenges", path: "/app/company/challenges", icon: PlusSquare },
  { title: "Submissions", path: "/app/company/submissions", icon: CheckSquare },
  { title: "Candidates", path: "/app/company/candidates", icon: Users },
];

export function AppSidebar() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<"participant" | "company" | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        setUserType(data?.user_type as "participant" | "company" || "participant");
      } catch (err) {
        console.error('Error in fetchUserType:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserType();
  }, [user]);
  
  const isCompanyUser = userType === "company";
  const menuItems = isCompanyUser ? companyMenuItems : participantMenuItems;
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Trophy className="h-6 w-6 text-arena-600" />
          <div className="flex flex-col">
            <span className="font-bold text-lg">AI Challenge</span>
            <span className="text-xs text-muted-foreground">Arena</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                    isActive ? "bg-muted font-medium" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink
              to="/app/profile"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  isActive ? "bg-muted font-medium" : "text-muted-foreground"
                )
              }
            >
              <Settings className="h-4 w-4" />
              Profile Settings
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarTrigger className="bg-background">
        <SidebarMenuButton />
      </SidebarTrigger>
    </Sidebar>
  );
}
