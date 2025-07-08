import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { MCPStatus } from './types';

interface ChatInputProps {
    message: string;
    isLoading: boolean;
    mcpEnabled: boolean;
    mcpStatus: MCPStatus | null;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onMessageChange: (message: string) => void;
    onSendMessage: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    message,
    isLoading,
    mcpEnabled,
    mcpStatus,
    textareaRef,
    onMessageChange,
    onSendMessage,
    onKeyPress
}) => {
    const placeholder = mcpEnabled && mcpStatus?.healthy ? 
        "Ask me to create files, check balances, analyze data..." : 
        "Ask about DeFi protocols, yield opportunities, portfolio analysis...";

    return (
        <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex gap-4">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
                    rows={1}
                    disabled={isLoading}
                />
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
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send, Shift + Enter for new line</span>
                {mcpEnabled && mcpStatus?.healthy && (
                    <span className="text-green-600">🔧 MCP Tools Ready</span>
                )}
            </div>
        </div>
    );
};

export default ChatInput;
