import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AudioUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadAudio = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/audio/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/voice-model"] });
      toast({
        title: "Success",
        description: "Audio file uploaded successfully!",
      });
      setUploadProgress(0);
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
        title: "Upload Failed",
        description: error.message || "Failed to upload audio file",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an audio file (MP3 or M4A).",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }
      
      setUploadProgress(10);
      uploadAudio.mutate(file);
    }
  }, [uploadAudio, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/mp4': ['.m4a'],
      'audio/x-m4a': ['.m4a'],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Training</span>
          <div className="flex items-center space-x-2">
            {uploadAudio.isSuccess && <CheckCircle className="w-5 h-5 text-accent" />}
            {uploadAudio.isError && <AlertCircle className="w-5 h-5 text-destructive" />}
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
              Ready
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-neutral-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudUpload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600 mb-2">
            {isDragActive 
              ? "Drop the audio file here..." 
              : "Drop audio files here or click to upload"
            }
          </p>
          <p className="text-xs text-neutral-500">Supports MP3, M4A (max 50MB each)</p>
        </div>

        {/* Upload Progress */}
        {uploadAudio.isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Uploading...</span>
              <span className="text-primary font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        <Button 
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          disabled={uploadAudio.isPending}
          className="w-full"
          variant="outline"
        >
          {uploadAudio.isPending ? "Uploading..." : "Choose Files"}
        </Button>
      </CardContent>
    </Card>
  );
}
