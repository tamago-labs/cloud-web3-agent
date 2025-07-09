import React from 'react';
import { Send, Loader2, Square, RefreshCw } from 'lucide-react';
import { MCPStatus } from './types';

interface ChatInputProps {
    message: string;
    isLoading: boolean;
    isStreaming?: boolean;
    mcpEnabled: boolean;
    mcpStatus: MCPStatus | null;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onMessageChange: (message: string) => void;
    onSendMessage: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onStopStreaming?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    message,
    isLoading,
    isStreaming = false,
    mcpEnabled,
    mcpStatus,
    textareaRef,
    onMessageChange,
    onSendMessage,
    onKeyPress,
    onStopStreaming
}) => {
    const placeholder = mcpEnabled && mcpStatus?.healthy ? 
        "Ask me to create files, check balances, analyze data..." : 
        "Ask about DeFi protocols, yield opportunities, portfolio analysis...";

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // Allow stopping with Escape key
        if (e.key === 'Escape' && isStreaming && onStopStreaming) {
            e.preventDefault();
            onStopStreaming();
            return;
        }
        
        // Prevent sending new messages while streaming
        if (isStreaming && e.key === 'Enter') {
            e.preventDefault();
            return;
        }
        
        onKeyPress(e);
    };

    return (
        <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex gap-4">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isStreaming ? "Response is being generated..." : placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] disabled:bg-gray-50 disabled:text-gray-500"
                    rows={1}
                    disabled={isLoading || isStreaming}
                />
                
                {/* Send/Stop Button */}
                {isStreaming ? (
                    <button
                        onClick={onStopStreaming}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2 font-medium min-w-[80px]"
                        title="Stop generating response (or press Escape)"
                    >
                        <Square className="w-4 h-4" />
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={onSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium min-w-[80px]"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                )}
            </div>
            
            {/* Status and Help Text */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                    {isStreaming ? (
                        <span className="text-blue-600 flex items-center gap-1">  
                            <div className="animate-spin rounded-full h-2.5 w-2.5 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                            Generating response... (Press Escape or click Stop to cancel)
                        </span>
                    ) : (
                        <span>Press Enter to send, Shift + Enter for new line</span>
                    )}
                </div>
                 
            </div>
             
        </div>
    );
};

export default ChatInput;
