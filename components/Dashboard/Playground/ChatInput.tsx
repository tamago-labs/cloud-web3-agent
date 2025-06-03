import React, { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  usageQuota: { used: number; limit: number };
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  usageQuota,
  className = "" 
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "Check my wallet balance",
    "What's the price of ETH?",
    "Swap 100 USDC to LINK",
    "Send 0.1 ETH to alice.eth",
    "Show my NFT collection",
    "Get gas price estimates"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const isAtLimit = usageQuota.used >= usageQuota.limit;

  return (
    <div className={`border-t border-teal-800/50 ${className}`}>
      {/* Usage indicator */}
      <div className="px-4 py-2 bg-teal-900/30 text-sm text-teal-300">
        Messages used: {usageQuota.used}/{usageQuota.limit}
        {isAtLimit && (
          <span className="text-red-400 ml-2">• Monthly limit reached</span>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="p-4 border-b border-teal-800/50">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-teal-300">Try these suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-teal-800/50 hover:bg-teal-700/50 text-teal-200 rounded-full border border-teal-700/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              placeholder={isAtLimit ? "Monthly message limit reached" : "Type your message here..."}
              disabled={disabled || isAtLimit}
              className="w-full bg-teal-800/30 border border-teal-700/50 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:border-teal-500 focus:ring-0 resize-none min-h-[44px] max-h-32 disabled:opacity-50"
              rows={1}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || disabled || isAtLimit}
            className="flex items-center justify-center w-11 h-11 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {!showSuggestions && !isAtLimit && (
          <button
            type="button"
            onClick={() => setShowSuggestions(true)}
            className="mt-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            💡 Show suggestions
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;