import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, User, MessageSquare, Settings } from "lucide-react";

const personalitySchema = z.object({
  lovedOneName: z.string().min(1, "Name is required"),
  lovedOneRelation: z.string().min(1, "Relationship is required"),
  traits: z.object({
    personality: z.string().optional(),
    speakingStyle: z.string().optional(),
    humor: z.string().optional(),
    wisdom: z.string().optional(),
  }),
  memories: z.object({
    favoriteMemories: z.string().optional(),
    specialPhrases: z.string().optional(),
    importantDates: z.string().optional(),
    sharedActivities: z.string().optional(),
  }),
  preferences: z.object({
    topics: z.string().optional(),
    avoidTopics: z.string().optional(),
    responseLength: z.string().optional(),
    tone: z.string().optional(),
  }),
});

type PersonalityFormData = z.infer<typeof personalitySchema>;

export default function Personality() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: personality } = useQuery({
    queryKey: ["/api/personality"],
    enabled: isAuthenticated,
  });

  const form = useForm<PersonalityFormData>({
    resolver: zodResolver(personalitySchema),
    defaultValues: {
      lovedOneName: "",
      lovedOneRelation: "",
      traits: {
        personality: "",
        speakingStyle: "",
        humor: "",
        wisdom: "",
      },
      memories: {
        favoriteMemories: "",
        specialPhrases: "",
        importantDates: "",
        sharedActivities: "",
      },
      preferences: {
        topics: "",
        avoidTopics: "",
        responseLength: "medium",
        tone: "warm",
      },
    },
  });

  // Update form when personality data is loaded
  useEffect(() => {
    if (personality) {
      form.reset({
        lovedOneName: personality.lovedOneName || "",
        lovedOneRelation: personality.lovedOneRelation || "",
        traits: {
          personality: personality.traits?.personality || "",
          speakingStyle: personality.traits?.speakingStyle || "",
          humor: personality.traits?.humor || "",
          wisdom: personality.traits?.wisdom || "",
        },
        memories: {
          favoriteMemories: personality.memories?.favoriteMemories || "",
          specialPhrases: personality.memories?.specialPhrases || "",
          importantDates: personality.memories?.importantDates || "",
          sharedActivities: personality.memories?.sharedActivities || "",
        },
        preferences: {
          topics: personality.preferences?.topics || "",
          avoidTopics: personality.preferences?.avoidTopics || "",
          responseLength: personality.preferences?.responseLength || "medium",
          tone: personality.preferences?.tone || "warm",
        },
      });
    }
  }, [personality, form]);

  const savePersonality = useMutation({
    mutationFn: async (data: PersonalityFormData) => {
      const response = await apiRequest("POST", "/api/personality", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personality"] });
      toast({
        title: "Success",
        description: "Personality settings saved successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save personality settings.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PersonalityFormData) => {
    savePersonality.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Personality & Memories</h1>
          <p className="text-neutral-600">
            Customize how your loved one's AI responds by sharing their personality traits, 
            favorite memories, and speaking style.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lovedOneName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Grandma Rose" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lovedOneRelation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="grandmother">Grandmother</SelectItem>
                            <SelectItem value="grandfather">Grandfather</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personality Traits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Personality Traits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="traits.personality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Warm, caring, optimistic, always saw the good in people..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="traits.speakingStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speaking Style</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Gentle voice, used pet names, often said 'sweetheart'..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="traits.humor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sense of Humor</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Loved dad jokes, always found humor in daily life..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="traits.wisdom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wisdom & Advice</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Always said 'This too shall pass', believed in kindness..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Memories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Cherished Memories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="memories.favoriteMemories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Memories</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Baking cookies together, garden walks, bedtime stories..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memories.specialPhrases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Phrases</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., 'My little star', 'Remember what I always say...'"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="memories.importantDates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Important Dates</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Christmas traditions, birthday celebrations, anniversaries..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memories.sharedActivities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shared Activities</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Gardening, cooking, reading together, watching movies..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Conversation Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferences.topics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Topics</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Family stories, nature, cooking, books, faith..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferences.avoidTopics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics to Avoid</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Politics, controversial subjects, sad topics..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferences.responseLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Length</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short">Short & Sweet</SelectItem>
                            <SelectItem value="medium">Medium Length</SelectItem>
                            <SelectItem value="long">Detailed & Thoughtful</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferences.tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Tone</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warm">Warm & Nurturing</SelectItem>
                            <SelectItem value="cheerful">Cheerful & Upbeat</SelectItem>
                            <SelectItem value="wise">Wise & Thoughtful</SelectItem>
                            <SelectItem value="gentle">Gentle & Calm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={savePersonality.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {savePersonality.isPending ? "Saving..." : "Save Personality"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
      
      <Footer />
    </div>
  );
}
