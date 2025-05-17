
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { MainLayout } from "./layouts/MainLayout";

// Landing page
import Landing from "./pages/Landing";

// Participant pages
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import ChallengeDetails from "./pages/ChallengeDetails";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyChallenges from "./pages/company/Challenges";
import CompanySubmissions from "./pages/company/Submissions";
import CompanyCandidates from "./pages/company/Candidates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />
            
            {/* Application routes with MainLayout */}
            <Route path="/app" element={<MainLayout />}>
              {/* Participant routes */}
              <Route index element={<Dashboard />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="challenges/:id" element={<ChallengeDetails />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Company routes */}
              <Route path="company" element={<CompanyDashboard />} />
              <Route path="company/challenges" element={<CompanyChallenges />} />
              <Route path="company/submissions" element={<CompanySubmissions />} />
              <Route path="company/candidates" element={<CompanyCandidates />} />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Redirect old routes to new ones */}
            <Route path="/challenges" element={<Navigate to="/app/challenges" />} />
            <Route path="/challenges/:id" element={<Navigate to="/app/challenges/:id" />} />
            <Route path="/leaderboard" element={<Navigate to="/app/leaderboard" />} />
            <Route path="/profile" element={<Navigate to="/app/profile" />} />
            <Route path="/company" element={<Navigate to="/app/company" />} />
            <Route path="/company/challenges" element={<Navigate to="/app/company/challenges" />} />
            <Route path="/company/submissions" element={<Navigate to="/app/company/submissions" />} />
            <Route path="/company/candidates" element={<Navigate to="/app/company/candidates" />} />
            
            {/* Catch all for non-application routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
