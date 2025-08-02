interface TypingIndicatorProps {
  username: string;
}

export function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
      <div className="w-8 h-8 bg-blue-300 rounded-full flex-shrink-0 flex items-center justify-center">
        <span className="text-blue-600 text-sm font-semibold">
          {username[0].toUpperCase()}
        </span>
      </div>
      <div className="message-bubble-received rounded-2xl rounded-bl-sm p-3 shadow-sm border border-gray-100">
        <div className="text-xs text-[var(--whatsapp-primary)] font-semibold mb-1">
          {username}
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">typing...</span>
        </div>
      </div>
    </div>
  );
}
