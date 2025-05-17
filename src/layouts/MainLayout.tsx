import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const MainLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
