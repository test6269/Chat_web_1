import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/App";
import { apiRequest } from "@/lib/queryClient";
import { MessageBubble } from "@/components/message-bubble";
import { TypingIndicator } from "@/components/typing-indicator";
import { 
  Users, 
  Search, 
  LogOut, 
  Paperclip, 
  Smile, 
  Send 
} from "lucide-react";
import type { Message } from "@shared/schema";

export default function Chat() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Fetch online users count
  const { data: onlineData } = useQuery<{ count: number }>({
    queryKey: ["/api/users/online"],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        content,
        senderId: user?.id,
        senderUsername: user?.username,
        type: "message",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setMessage("");
      setLastFetchTime(new Date());
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {
        userId: user?.id,
        username: user?.username,
      });
      return response.json();
    },
    onSuccess: () => {
      setUser(null);
      setLocation("/login");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && user) {
      sendMessageMutation.mutate(trimmedMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--whatsapp-bg)]">
      {/* Chat Header */}
      <header className="bg-[var(--whatsapp-dark)] text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--whatsapp-primary)] rounded-full flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Rudra Chat Room</h1>
              <p className="text-sm text-green-200">
                {onlineData?.count || 0} users online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-[var(--whatsapp-primary)] rounded-full text-white"
            >
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="p-2 hover:bg-[var(--whatsapp-primary)] rounded-full text-white"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-hidden relative">
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 chat-bg-pattern"></div>

        {/* Messages Area */}
        <div className="h-full overflow-y-auto p-4 pb-24 space-y-4 relative z-10">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user.id}
              showSender={msg.type === "message" && msg.senderId !== user.id}
            />
          ))}
          
          {/* Typing Indicator (placeholder for future implementation) */}
          {false && <TypingIndicator username="Someone" />}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-3 text-gray-500 hover:text-[var(--whatsapp-primary)] hover:bg-gray-100 rounded-full"
          >
            <Paperclip size={20} />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="resize-none pr-12 rounded-full border-gray-300 focus:ring-[var(--whatsapp-primary)] focus:border-[var(--whatsapp-primary)] min-h-[48px] max-h-32"
              rows={1}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--whatsapp-primary)] p-1"
            >
              <Smile size={20} />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="p-3 whatsapp-gradient text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Send size={20} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
