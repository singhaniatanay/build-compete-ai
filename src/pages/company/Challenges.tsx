import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Edit,
  Eye,
  Trash2,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Challenge = {
  id: string;
  title: string;
  status: 'active' | 'draft' | 'completed';
  submissionCount: number;
  deadline: string | null;
  description: string;
  company: string;
  difficulty: string;
  tags: string[];
}

const CompanyChallenges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCompanyChallenges();
  }, [user]);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchTerm, activeTab]);

  const fetchCompanyChallenges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get company name for the current user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();
      
      if (!profileData?.company_name) {
        toast({
          title: "Company profile not found",
          description: "Please complete your company profile first.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch challenges for this company
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('company', profileData.company_name);
      
      if (error) throw error;
      
      // Get submission counts for each challenge
      const challengesWithSubmissions = await Promise.all(
        (data || []).map(async (challenge) => {
          const { count, error: countError } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('challenge_id', challenge.id);
          
          if (countError) {
            console.error("Error fetching submission count:", countError);
            return {
              ...challenge,
              status: determineStatus(challenge),
              submissionCount: 0
            };
          }
          
          return {
            ...challenge,
            status: determineStatus(challenge),
            submissionCount: count || 0
          };
        })
      );
      
      setChallenges(challengesWithSubmissions);
    } catch (error: any) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Failed to load challenges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (challenge: any): 'active' | 'draft' | 'completed' => {
    // Implement logic to determine challenge status
    const today = new Date();
    const deadline = new Date(challenge.deadline);
    
    // If the challenge doesn't have essential fields, consider it a draft
    if (!challenge.title || !challenge.description || !challenge.deadline) {
      return 'draft';
    }
    
    // If deadline has passed, it's completed
    if (deadline < today) {
      return 'completed';
    }
    
    // Otherwise, it's active
    return 'active';
  };

  const filterChallenges = () => {
    let filtered = [...challenges];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(challenge => challenge.status === activeTab);
    }
    
    setFilteredChallenges(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCreateChallenge = () => {
    navigate("/app/company/challenges/new");
  };

  const handleViewChallenge = (id: string) => {
    navigate(`/app/company/challenges/${id}`);
  };

  const handleEditChallenge = (id: string) => {
    navigate(`/app/company/challenges/${id}/edit`);
  };

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleDeleteChallenge = async () => {
    if (!confirmDeleteId) return;
    
    try {
      setDeleteLoading(true);
      
      // Delete challenge
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', confirmDeleteId);
      
      if (error) throw error;
      
      // Update state
      setChallenges(challenges.filter(c => c.id !== confirmDeleteId));
      toast({
        title: "Challenge deleted",
        description: "The challenge has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting challenge:", error);
      toast({
        title: "Failed to delete challenge",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
        <Button onClick={handleCreateChallenge}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search challenges..." 
                  className="w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredChallenges.length > 0 ? (
              <div className="space-y-4">
                {filteredChallenges.map((challenge) => (
                  <Card key={challenge.id} className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{challenge.title}</h3>
                          <Badge 
                            variant={
                              challenge.status === "active" 
                                ? "default" 
                                : challenge.status === "draft" 
                                ? "outline" 
                                : "secondary"
                            }
                          >
                            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {challenge.status !== "draft" && (
                            <>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>{challenge.submissionCount} submissions</span>
                              </div>
                              {challenge.deadline && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(challenge.deadline).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          {challenge.status === "draft" && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              <span>Not published yet</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewChallenge(challenge.id)}
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditChallenge(challenge.id)}
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(challenge.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No challenges found</p>
                <Button onClick={handleCreateChallenge}>Create Your First Challenge</Button>
              </div>
            )}
          </CardContent>
          {filteredChallenges.length > 0 && (
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                <div>Showing {filteredChallenges.length} of {challenges.length} challenges</div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      <AlertDialog open={!!confirmDeleteId} onOpenChange={() => confirmDeleteId && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this challenge?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All data related to this challenge including submissions will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteChallenge}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyChallenges;
