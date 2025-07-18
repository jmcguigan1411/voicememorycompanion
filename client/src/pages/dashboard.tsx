import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuickActions from "@/components/common/QuickActions";
import EthicsPrivacy from "@/components/common/EthicsPrivacy";
import AudioUpload from "@/components/upload/AudioUpload";
import ChatInterface from "@/components/chat/ChatInterface";
import MemoryCapsuleCard from "@/components/memory/MemoryCapsuleCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
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

  const { data: voiceModel } = useQuery({
    queryKey: ["/api/voice-model"],
    enabled: isAuthenticated,
  });

  const { data: memoryCapsules } = useQuery({
    queryKey: ["/api/memory-capsules"],
    enabled: isAuthenticated,
  });

  const { data: personality } = useQuery({
    queryKey: ["/api/personality"],
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
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                  Welcome back, {user?.firstName || 'Friend'}
                </h2>
                <p className="text-neutral-600 mb-4">
                  {voiceModel?.status === 'ready' 
                    ? "Continue preserving precious memories through voice. Your loved one's voice model is ready to chat."
                    : "Start by uploading voice recordings to train your loved one's voice model."
                  }
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {voiceModel?.status === 'ready' ? (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    ) : (
                      <Clock className="w-5 h-5 text-secondary" />
                    )}
                    <span className="text-sm font-medium">
                      Voice Model: {voiceModel?.status === 'ready' ? 'Ready' : 'Training'}
                    </span>
                  </div>
                  {voiceModel?.status === 'ready' && (
                    <div className="flex items-center space-x-2 text-secondary">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Ready to chat</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                  alt="Sound waves visualization" 
                  className="w-48 h-32 object-cover rounded-xl opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Audio Upload & Training */}
          <div className="lg:col-span-1 space-y-6">
            <AudioUpload />
            <EthicsPrivacy />
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>

        {/* Memory Capsules Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-800">Recent Memory Capsules</h3>
            <Button 
              variant="ghost" 
              className="text-primary font-medium text-sm hover:underline"
              onClick={() => window.location.href = '/memory-capsules'}
            >
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memoryCapsules?.slice(0, 3).map((capsule: any) => (
              <MemoryCapsuleCard key={capsule.id} capsule={capsule} />
            ))}
            {(!memoryCapsules || memoryCapsules.length === 0) && (
              <div className="col-span-full text-center py-8 text-neutral-500">
                No memory capsules yet. Start chatting to create your first memory capsule!
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
