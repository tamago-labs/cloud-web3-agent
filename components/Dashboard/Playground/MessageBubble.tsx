import React from 'react';
import { User, Bot, Info, Clock, Zap } from 'lucide-react';
import type { ChatMessage } from './ChatContainer';

interface MessageBubbleProps {
  message: ChatMessage;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, className = "" }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '&bull;')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line || '<br>' }} />
      ));
  };

  if (isSystem) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg px-4 py-3 max-w-2xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-100">
              {formatContent(message.content)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`flex space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-teal-600' 
            : 'bg-purple-600'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message content */}
        <div className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message bubble */}
          <div className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-teal-600 text-white'
              : 'bg-teal-800/50 border border-teal-700/50 text-teal-50'
          }`}>
            <div className="text-sm leading-relaxed">
              {formatContent(message.content)}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-3 text-xs text-teal-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(message.timestamp)}</span>
            </div>

            {/* Tools used */}
            {message.toolsUsed && message.toolsUsed.length > 0 && (
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Tools: {message.toolsUsed.join(', ')}</span>
              </div>
            )}

            {/* Performance metrics */}
            {message.metadata && (
              <div className="flex items-center space-x-2">
                {message.metadata.tokensUsed && (
                  <span>{message.metadata.tokensUsed} tokens</span>
                )}
                {message.metadata.responseTime && (
                  <span>{message.metadata.responseTime}ms</span>
                )}
                {message.metadata.error && (
                  <span className="text-red-400">Error: {message.metadata.error}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
