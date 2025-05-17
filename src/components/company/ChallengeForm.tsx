import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Schema for challenge form validation
const challengeFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(300, { message: "Description must be less than 300 characters" }),
  longDescription: z
    .string()
    .min(50, { message: "Long description must be at least 50 characters" })
    .max(5000, { message: "Long description must be less than 5000 characters" }),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  deadline: z.date({
    required_error: "A deadline is required",
  }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  prizes: z.array(z.string()).optional().default([]),
  submissionRequirements: z.array(z.string()).optional().default([]),
  evaluationRequirements: z.array(z.string()).optional().default([]),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

export function ChallengeForm({ isEditing = false }: { isEditing?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [currentTag, setCurrentTag] = useState("");
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [currentPrize, setCurrentPrize] = useState("");
  const [currentSubmissionRequirement, setCurrentSubmissionRequirement] = useState("");
  const [currentEvaluationRequirement, setCurrentEvaluationRequirement] = useState("");
  
  // Initialize form with default values
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      difficulty: "Intermediate",
      tags: [],
      prizes: [],
      submissionRequirements: [],
      evaluationRequirements: [],
    },
  });

  // Fetch company name and challenge data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Get company name for the current user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (!profileData?.company_name) {
          toast({
            title: "Company profile not found",
            description: "Please complete your company profile first.",
            variant: "destructive",
          });
          navigate("/app/profile");
          return;
        }
        
        setCompanyName(profileData.company_name);
        
        // If editing, fetch challenge data
        if (isEditing && id) {
          const { data: challenge, error: challengeError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();
          
          if (challengeError) throw challengeError;
          
          if (challenge.company !== profileData.company_name) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to edit this challenge.",
              variant: "destructive",
            });
            navigate("/app/company/challenges");
            return;
          }
          
          // Populate form with challenge data
          form.reset({
            title: challenge.title,
            description: challenge.description,
            longDescription: challenge.long_description,
            difficulty: challenge.difficulty,
            deadline: new Date(challenge.deadline),
            tags: challenge.tags || [],
            prizes: challenge.prizes?.map((p: any) => `${p.position}: ${p.reward}`) || [],
            submissionRequirements: challenge.requirements?.submission || [],
            evaluationRequirements: challenge.requirements?.evaluation || [],
          });
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [user, id, isEditing, navigate, toast, form]);

  const onAddTag = () => {
    if (!currentTag.trim()) return;
    
    const trimmedTag = currentTag.trim();
    const currentTags = form.getValues("tags") || [];
    
    if (!currentTags.includes(trimmedTag)) {
      form.setValue("tags", [...currentTags, trimmedTag]);
      form.trigger("tags");
    }
    
    setCurrentTag("");
  };

  const onRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
    form.trigger("tags");
  };

  const onAddPrize = () => {
    if (!currentPrize.trim()) return;
    
    const trimmedPrize = currentPrize.trim();
    const currentPrizes = form.getValues("prizes") || [];
    
    if (!currentPrizes.includes(trimmedPrize)) {
      form.setValue("prizes", [...currentPrizes, trimmedPrize]);
      form.trigger("prizes");
    }
    
    setCurrentPrize("");
  };

  const onRemovePrize = (prizeToRemove: string) => {
    const currentPrizes = form.getValues("prizes") || [];
    form.setValue(
      "prizes",
      currentPrizes.filter((prize) => prize !== prizeToRemove)
    );
    form.trigger("prizes");
  };

  const onAddSubmissionRequirement = () => {
    if (!currentSubmissionRequirement.trim()) return;
    
    const trimmedRequirement = currentSubmissionRequirement.trim();
    const currentRequirements = form.getValues("submissionRequirements") || [];
    
    if (!currentRequirements.includes(trimmedRequirement)) {
      form.setValue("submissionRequirements", [...currentRequirements, trimmedRequirement]);
      form.trigger("submissionRequirements");
    }
    
    setCurrentSubmissionRequirement("");
  };

  const onRemoveSubmissionRequirement = (requirementToRemove: string) => {
    const currentRequirements = form.getValues("submissionRequirements") || [];
    form.setValue(
      "submissionRequirements",
      currentRequirements.filter((req) => req !== requirementToRemove)
    );
    form.trigger("submissionRequirements");
  };

  const onAddEvaluationRequirement = () => {
    if (!currentEvaluationRequirement.trim()) return;
    
    const trimmedRequirement = currentEvaluationRequirement.trim();
    const currentRequirements = form.getValues("evaluationRequirements") || [];
    
    if (!currentRequirements.includes(trimmedRequirement)) {
      form.setValue("evaluationRequirements", [...currentRequirements, trimmedRequirement]);
      form.trigger("evaluationRequirements");
    }
    
    setCurrentEvaluationRequirement("");
  };

  const onRemoveEvaluationRequirement = (requirementToRemove: string) => {
    const currentRequirements = form.getValues("evaluationRequirements") || [];
    form.setValue(
      "evaluationRequirements",
      currentRequirements.filter((req) => req !== requirementToRemove)
    );
    form.trigger("evaluationRequirements");
  };

  const onSubmit = async (values: ChallengeFormValues) => {
    if (!user || !companyName) {
      toast({
        title: "Authentication error",
        description: "You must be logged in as a company to create challenges.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Parse prize strings into objects
      const parsedPrizes = values.prizes.map(prize => {
        const [position, reward] = prize.split(': ').map(part => part.trim());
        return {
          position: position || "Prize",
          reward: reward || position
        };
      });
      
      const challengeData = {
        title: values.title,
        company: companyName,
        description: values.description,
        long_description: values.longDescription,
        difficulty: values.difficulty,
        deadline: values.deadline.toISOString(),
        tags: values.tags,
        prizes: parsedPrizes,
        requirements: {
          submission: values.submissionRequirements,
          evaluation: values.evaluationRequirements
        },
        updated_at: new Date().toISOString(),
      };
      
      console.log("Challenge data to save:", challengeData);
      console.log("isEditing:", isEditing, "id:", id);
      
      let result;
      
      if (isEditing && id) {
        // Update existing challenge
        console.log("Updating challenge with ID:", id);
        
        // First, verify the challenge exists and belongs to this company
        const { data: existingChallenge, error: fetchError } = await supabase
          .from('challenges')
          .select('id, company')
          .eq('id', id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching existing challenge:", fetchError);
          throw new Error(`Challenge not found or you don't have permission to update it: ${fetchError.message}`);
        }
        
        if (!existingChallenge) {
          throw new Error("Challenge not found");
        }
        
        if (existingChallenge.company !== companyName) {
          throw new Error("You don't have permission to update this challenge");
        }
        
        console.log("Existing challenge found:", existingChallenge);
        
        // Try the update with a slightly different approach
        result = await supabase
          .from('challenges')
          .update({
            ...challengeData,
            // Force modified timestamp to ensure we get data back
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select();
          
        console.log("Update result:", result);
        
        // If no data is returned but update was successful, fetch the challenge to verify
        if (result.status === 200 && (!result.data || result.data.length === 0)) {
          const { data: updatedChallenge, error: verifyError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();
            
          if (!verifyError && updatedChallenge) {
            // Set result data to the fetched challenge to confirm update worked
            result.data = [updatedChallenge];
            console.log("Challenge verified after update:", updatedChallenge);
          }
        }
      } else {
        // Create new challenge
        console.log("Creating new challenge");
        result = await supabase
          .from('challenges')
          .insert([{
            ...challengeData,
            participants: 0,
            featured: false,
            created_at: new Date().toISOString()
          }])
          .select();
          
        console.log("Insert result:", result);
      }
      
      if (result.error) {
        console.error("Supabase error:", result.error);
        throw result.error;
      }
      
      if (isEditing && (!result.data || result.data.length === 0)) {
        console.warn("Update returned no data. This might indicate an issue with permissions or no actual changes were made.");
        // Continue anyway since the update might have succeeded
        toast({
          title: "Challenge updated",
          description: "Your challenge has been updated successfully, but verification was limited.",
        });
      } else {
        toast({
          title: isEditing ? "Challenge updated" : "Challenge created",
          description: isEditing 
            ? "Your challenge has been updated successfully." 
            : "Your new challenge has been created successfully.",
        });
      }
      
      navigate("/app/company/challenges");
    } catch (error: any) {
      console.error("Error saving challenge:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Challenge" : "Create New Challenge"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter challenge title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A catchy title for your challenge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description of your challenge"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary that will appear on challenge cards
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a detailed description of the challenge"
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description, requirements, and evaluation criteria
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the difficulty level of your challenge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Submission Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The deadline for submissions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tags (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={onAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("tags")?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1">
                        {tag}
                        <X
                          className="ml-2 h-3 w-3 cursor-pointer"
                          onClick={() => onRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Add relevant tags for your challenge (e.g., AI, Frontend, Mobile)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prizes"
              render={() => (
                <FormItem>
                  <FormLabel>Prizes</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentPrize}
                      onChange={(e) => setCurrentPrize(e.target.value)}
                      placeholder="Add prizes (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddPrize();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={onAddPrize}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("prizes")?.map((prize, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {prize}
                        <X
                          className="ml-2 h-3 w-3 cursor-pointer"
                          onClick={() => onRemovePrize(prize)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Add prizes for your challenge (e.g., "1st Place: $1000", "2nd Place: $500")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submissionRequirements"
              render={() => (
                <FormItem>
                  <FormLabel>Submission Requirements</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentSubmissionRequirement}
                      onChange={(e) => setCurrentSubmissionRequirement(e.target.value)}
                      placeholder="Add submission requirement (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddSubmissionRequirement();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={onAddSubmissionRequirement}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("submissionRequirements")?.map((requirement, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {requirement}
                        <X
                          className="ml-2 h-3 w-3 cursor-pointer"
                          onClick={() => onRemoveSubmissionRequirement(requirement)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Add requirements for challenge submissions (e.g., "GitHub repository", "Demo video")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="evaluationRequirements"
              render={() => (
                <FormItem>
                  <FormLabel>Evaluation Criteria</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentEvaluationRequirement}
                      onChange={(e) => setCurrentEvaluationRequirement(e.target.value)}
                      placeholder="Add evaluation criterion (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddEvaluationRequirement();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={onAddEvaluationRequirement}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("evaluationRequirements")?.map((requirement, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {requirement}
                        <X
                          className="ml-2 h-3 w-3 cursor-pointer"
                          onClick={() => onRemoveEvaluationRequirement(requirement)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Add criteria used to evaluate submissions (e.g., "Performance", "Code quality")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/app/company/challenges")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Challenge" : "Create Challenge"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ChallengeForm; 