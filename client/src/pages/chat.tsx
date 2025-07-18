import { useAuth } from "@/hooks/useAuth";
import { useParams } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Chat() {
  const { isAuthenticated, isLoading } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const chatId = params.id ? parseInt(params.id) : undefined;

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
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Voice Chat</h1>
          <p className="text-neutral-600">
            Have a heartfelt conversation with your loved one's voice. 
            Share memories, ask questions, and create new moments together.
          </p>
        </div>

        <ChatInterface chatId={chatId} />
      </main>
      
      <Footer />
    </div>
  );
}
