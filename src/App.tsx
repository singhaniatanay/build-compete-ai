
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { MainLayout } from "./layouts/MainLayout";

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
            <Route path="/" element={<MainLayout />}>
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
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
