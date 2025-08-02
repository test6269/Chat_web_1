import { CheckCheck, UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
}

export function MessageBubble({ message, isOwn, showSender }: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // System messages (join/leave)
  if (message.type === "join" || message.type === "leave") {
    return (
      <div className="flex justify-center">
        <div className={cn(
          "px-4 py-2 rounded-full text-sm border",
          message.type === "join" 
            ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
            : "bg-red-100 text-red-800 border-red-200"
        )}>
          {message.type === "join" ? (
            <UserPlus className="inline mr-2" size={14} />
          ) : (
            <UserMinus className="inline mr-2" size={14} />
          )}
          {message.content}
        </div>
      </div>
    );
  }

  // Regular messages
  if (isOwn) {
    return (
      <div className="flex justify-end">
        <div className="message-bubble-sent rounded-2xl rounded-br-sm p-3 shadow-sm max-w-xs lg:max-w-md">
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div className="text-xs text-gray-600 mt-1 text-right flex items-center justify-end space-x-1">
            <span>{formatTime(message.timestamp)}</span>
            <CheckCheck className="text-blue-500" size={12} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
        <span className="text-gray-600 text-sm font-semibold">
          {message.senderUsername[0].toUpperCase()}
        </span>
      </div>
      <div className="message-bubble-received rounded-2xl rounded-bl-sm p-3 shadow-sm border border-gray-100">
        {showSender && (
          <div className="text-xs text-[var(--whatsapp-primary)] font-semibold mb-1">
            {message.senderUsername}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
