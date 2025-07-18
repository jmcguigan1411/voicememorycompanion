import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function TrainingProgress() {
  const { data: voiceModel } = useQuery({
    queryKey: ["/api/voice-model"],
  });

  const { data: audioFiles } = useQuery({
    queryKey: ["/api/audio/files"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'training':
        return <Clock className="w-5 h-5 text-secondary" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0 minutes';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const progress = voiceModel?.progress || 0;
  const status = voiceModel?.status || 'training';
  const totalFiles = audioFiles?.length || 0;
  const totalDuration = audioFiles?.reduce((sum: number, file: any) => sum + (file.duration || 0), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Training Progress</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Model Training</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalFiles}</div>
            <div className="text-neutral-600">Audio Files</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{formatDuration(totalDuration)}</div>
            <div className="text-neutral-600">Voice Data</div>
          </div>
        </div>

        <div className="text-xs text-neutral-500 space-y-1">
          <p>• Upload at least 5 audio files for optimal results</p>
          <p>• Longer recordings improve voice quality</p>
          <p>• Clear audio produces better synthesis</p>
        </div>

        {status === 'ready' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Voice model is ready!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">You can now start chatting with your loved one's voice.</p>
          </div>
        )}

        {status === 'training' && totalFiles > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Training in progress...</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">Your voice model is being trained. This may take a few minutes.</p>
          </div>
        )}

        {totalFiles === 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Upload audio files to begin</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Start by uploading voice recordings to train your model.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
