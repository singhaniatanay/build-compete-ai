
import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Award, Code, Home, Users, Trophy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Challenges", path: "/challenges", icon: Code },
  { title: "Leaderboard", path: "/leaderboard", icon: BarChart3 },
];

export function AppSidebar() {
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
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
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
            <Award className="h-5 w-5 text-arena-500" />
            <span className="text-sm font-medium">AI Builder</span>
          </div>
          <SidebarTrigger className="lg:hidden" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
