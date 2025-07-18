import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MemoryCapsuleCard from "@/components/memory/MemoryCapsuleCard";
import { Button } from "@/components/ui/button";
import { Plus, Archive } from "lucide-react";

export default function MemoryCapsules() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: memoryCapsules, isLoading: capsulesLoading } = useQuery({
    queryKey: ["/api/memory-capsules"],
    enabled: isAuthenticated,
  });

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Memory Capsules</h1>
            <p className="text-neutral-600">
              Your saved conversations and precious moments, preserved forever.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/chat'}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Chat
          </Button>
        </div>

        {capsulesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-neutral-200 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-3"></div>
                <div className="h-3 bg-neutral-200 rounded mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded mb-4"></div>
                <div className="h-3 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : memoryCapsules && memoryCapsules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memoryCapsules.map((capsule: any) => (
              <MemoryCapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Archive className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Memory Capsules Yet</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Start chatting with your loved one to create your first memory capsule. 
              Every meaningful conversation can be saved and replayed.
            </p>
            <Button 
              onClick={() => window.location.href = '/chat'}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Your First Chat
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
