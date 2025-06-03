import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { LoadingSpinner } from '../Shared/LoadingStates';
import { Trash2 } from 'lucide-react';
import type { ChatMessage } from './ChatContainer';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onClearChat: () => void;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onClearChat,
  className = "" 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with clear button */}
      <div className="flex justify-between items-center p-4 border-b border-teal-800/50">
        <div className="text-sm text-teal-300">
          {messages.length - 1} messages • Playground Mode
        </div>
        <button
          onClick={onClearChat}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-teal-400 hover:text-white hover:bg-teal-800/50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center space-x-3 text-teal-400">
            <LoadingSpinner size="sm" />
            <span className="text-sm">MCP Agent is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
