import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Music, MessageSquare, Play } from "lucide-react";

interface MemoryCapsuleCardProps {
  capsule: {
    id: number;
    title: string;
    description?: string;
    icon?: string;
    messageCount: number;
    totalDuration: number;
    createdAt: string;
    chatId: number;
  };
}

export default function MemoryCapsuleCard({ capsule }: MemoryCapsuleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(capsule.createdAt), { addSuffix: true });
  
  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getIcon = () => {
    // Map icon strings to actual icons
    if (capsule.icon?.includes('heart')) return Heart;
    if (capsule.icon?.includes('birthday') || capsule.icon?.includes('cake')) return Calendar;
    if (capsule.icon?.includes('music')) return Music;
    return MessageSquare; // default
  };

  const Icon = getIcon();

  const getIconColor = () => {
    if (capsule.icon?.includes('heart')) return "text-red-400";
    if (capsule.icon?.includes('birthday') || capsule.icon?.includes('cake')) return "text-secondary";
    if (capsule.icon?.includes('music')) return "text-purple-400";
    return "text-primary";
  };

  const handleReplay = () => {
    // Navigate to the specific chat
    window.location.href = `/chat/${capsule.chatId}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${getIconColor()}`} />
            <span className="text-sm font-medium text-neutral-800 line-clamp-1">
              {capsule.title}
            </span>
          </div>
          <span className="text-xs text-neutral-500 whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        
        {capsule.description && (
          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
            {capsule.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-neutral-500">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{capsule.messageCount} message{capsule.messageCount !== 1 ? 's' : ''}</span>
            </span>
            <span>•</span>
            <span>{formatDuration(capsule.totalDuration)} duration</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplay}
            className="text-primary text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-3 h-3 mr-1" />
            Replay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
