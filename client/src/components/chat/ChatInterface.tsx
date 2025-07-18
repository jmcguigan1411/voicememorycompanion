import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import MessageBubble from "./MessageBubble";
import { Send, Save, Settings } from "lucide-react";

interface ChatInterfaceProps {
  chatId?: number;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState<number | null>(chatId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: personality } = useQuery({
    queryKey: ["/api/personality"],
  });

  const { data: voiceModel } = useQuery({
    queryKey: ["/api/voice-model"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chats", currentChatId, "messages"],
    enabled: !!currentChatId,
  });

  const { data: chat } = useQuery({
    queryKey: ["/api/chats", currentChatId],
    enabled: !!currentChatId,
  });

  // Create new chat if none exists
  const createChat = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chats", {
        title: "New Conversation",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentChatId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
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
        description: "Failed to create chat.",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!currentChatId) {
        throw new Error("No chat selected");
      }
      const response = await apiRequest("POST", `/api/chats/${currentChatId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", currentChatId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      setMessage("");
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
        description: "Failed to send message.",
        variant: "destructive",
      });
    },
  });

  // Save as memory capsule
  const saveAsMemoryCapsule = useMutation({
    mutationFn: async () => {
      if (!currentChatId || !messages || messages.length === 0) {
        throw new Error("No messages to save");
      }
      
      const messageCount = messages.length;
      const totalDuration = messages
        .filter((msg: any) => msg.audioDuration)
        .reduce((sum: number, msg: any) => sum + msg.audioDuration, 0);
      
      const response = await apiRequest("POST", "/api/memory-capsules", {
        chatId: currentChatId,
        title: chat?.title || "Untitled Conversation",
        description: messages[0]?.content?.substring(0, 100) + "...",
        icon: "fas fa-heart",
        messageCount,
        totalDuration,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memory-capsules"] });
      toast({
        title: "Success",
        description: "Conversation saved as Memory Capsule!",
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
        description: "Failed to save memory capsule.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create chat if none exists
  useEffect(() => {
    if (!currentChatId && !createChat.isPending) {
      createChat.mutate();
    }
  }, [currentChatId, createChat]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!currentChatId) {
      toast({
        title: "Error",
        description: "Please wait for chat to be created.",
        variant: "destructive",
      });
      return;
    }

    if (voiceModel?.status !== 'ready') {
      toast({
        title: "Voice Model Not Ready",
        description: "Please upload more audio files to train the voice model.",
        variant: "destructive",
      });
      return;
    }

    sendMessage.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const lovedOneName = personality?.lovedOneName || "Your Loved One";
  const lovedOneRelation = personality?.lovedOneRelation || "";

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="p-4 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80" />
              <AvatarFallback>{lovedOneName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-neutral-800">{lovedOneName}</h4>
              <p className="text-xs text-accent">
                {voiceModel?.status === 'ready' ? 'Voice model active' : 'Voice model training'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => saveAsMemoryCapsule.mutate()}
              disabled={!messages || messages.length === 0 || saveAsMemoryCapsule.isPending}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = '/personality'}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((msg: any, index: number) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-neutral-600 mb-2">Start a conversation with {lovedOneName}</p>
              <p className="text-sm text-neutral-500">
                Share a memory or ask a question to begin
              </p>
            </div>
          </div>
        )}

        {sendMessage.isPending && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-neutral-100 p-3 rounded-xl rounded-bl-md">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-neutral-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Chat Input */}
      <div className="p-4 border-t border-neutral-200 flex-shrink-0">
        <div className="flex space-x-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share a memory or ask a question..."
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-neutral-500">
            Responses are generated by AI and may not reflect actual views
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => saveAsMemoryCapsule.mutate()}
            disabled={!messages || messages.length === 0 || saveAsMemoryCapsule.isPending}
            className="text-secondary text-xs font-medium hover:underline"
          >
            Save as Memory Capsule
          </Button>
        </div>
      </div>
    </Card>
  );
}
