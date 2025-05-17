
import React, { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const location = useLocation();
  const isCompanyRoute = location.pathname.startsWith('/app/company');
  const [activeTab, setActiveTab] = useState(isCompanyRoute ? "company" : "participant");
  
  const menuItems = activeTab === "company" ? companyMenuItems : participantMenuItems;
  
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
        <div className="px-4 py-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="participant">Participant</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  end={item.path === "/app" || item.path === "/app/company"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 px-4 py-2 rounded-md transition-colors w-full",
                      {
                        "bg-sidebar-accent text-sidebar-accent-foreground":
                          isActive,
                        "hover:bg-sidebar-accent/50": !isActive,
                      }
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === "company" ? (
              <>
                <Building className="h-5 w-5 text-arena-500" />
                <span className="text-sm font-medium">Company Mode</span>
              </>
            ) : (
              <>
                <Award className="h-5 w-5 text-arena-500" />
                <span className="text-sm font-medium">AI Builder</span>
              </>
            )}
          </div>
          <SidebarTrigger className="lg:hidden" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
