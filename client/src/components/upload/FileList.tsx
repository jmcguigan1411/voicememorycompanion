import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileAudio, Play, Trash2, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function FileList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: audioFiles, isLoading } = useQuery({
    queryKey: ["/api/audio/files"],
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: number) => {
      await apiRequest("DELETE", `/api/audio/${fileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audio/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/voice-model"] });
      toast({
        title: "Success",
        description: "Audio file deleted successfully.",
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
        description: "Failed to delete audio file.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'poor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audio Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-neutral-200 rounded"></div>
                  <div>
                    <div className="w-32 h-4 bg-neutral-200 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-neutral-200 rounded"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-neutral-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Files ({audioFiles?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {audioFiles && audioFiles.length > 0 ? (
          <div className="space-y-3">
            {audioFiles.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{file.originalName}</p>
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(file.duration)}</span>
                      <span>•</span>
                      <span>{formatFileSize(file.fileSize)}</span>
                      {file.quality && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className={getQualityColor(file.quality)}>
                            {file.quality}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // TODO: Implement audio playback
                      toast({
                        title: "Coming Soon",
                        description: "Audio playback will be available soon.",
                      });
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile.mutate(file.id)}
                    disabled={deleteFile.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <FileAudio className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
            <p>No audio files uploaded yet.</p>
            <p className="text-sm">Upload your first recording to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
