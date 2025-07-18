import { formatDistanceToNow } from "date-fns";
import VoicePlayer from "./VoicePlayer";

interface MessageBubbleProps {
  message: {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    audioUrl?: string;
    audioDuration?: number;
    createdAt: string;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-xs lg:max-w-md">
        <div className={`p-3 rounded-xl ${
          isUser 
            ? 'bg-primary text-white rounded-br-md' 
            : 'bg-neutral-100 rounded-bl-md'
        }`}>
          <p className={`text-sm ${isUser ? 'text-white' : 'text-neutral-800'}`}>
            {message.content}
          </p>
          
          {/* Voice Playback Controls for AI messages */}
          {!isUser && message.audioUrl && (
            <div className="mt-3">
              <VoicePlayer 
                audioUrl={message.audioUrl} 
                duration={message.audioDuration || 0}
              />
            </div>
          )}
        </div>
        
        <p className={`text-xs text-neutral-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timeAgo}
          {!isUser && " • Generated with AI"}
        </p>
      </div>
    </div>
  );
}
