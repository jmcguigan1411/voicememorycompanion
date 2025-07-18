import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AudioUpload from "@/components/upload/AudioUpload";
import TrainingProgress from "@/components/upload/TrainingProgress";
import FileList from "@/components/upload/FileList";
import EthicsPrivacy from "@/components/common/EthicsPrivacy";

export default function Upload() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Voice Training</h1>
          <p className="text-neutral-600">
            Upload multiple audio recordings to train your loved one's voice model. 
            More recordings improve the quality and accuracy of generated speech.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload and Progress */}
          <div className="lg:col-span-1 space-y-6">
            <AudioUpload />
            <TrainingProgress />
            <EthicsPrivacy />
          </div>

          {/* Right Column: File List */}
          <div className="lg:col-span-2">
            <FileList />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
