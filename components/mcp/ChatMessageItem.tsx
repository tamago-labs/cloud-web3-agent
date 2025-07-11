import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronRight, Copy, Check, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessage } from './types';

interface ChatMessageItemProps {
    message: ChatMessage;
    isLoading: boolean;
    isLast: boolean;
}

interface ToolResult {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'error';
    input?: any;
    output?: any;
    error?: string;
    startTime?: number;
    endTime?: number;
    duration?: number;
}

// Enhanced ChatMessage type to support tool results
interface EnhancedChatMessage extends ChatMessage {
    toolResults?: ToolResult[];
    hasToolCalls?: boolean;
}

// Tool Result Modal Component
const ToolResultModal: React.FC<{
    tool: ToolResult;
    isOpen: boolean;
    onClose: () => void;
}> = ({ tool, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'input' | 'output' | 'error'>('input');
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    if (!isOpen) return null;

    const copyToClipboard = async (text: string, section: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedSection(section);
            setTimeout(() => setCopiedSection(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const formatDuration = (startTime?: number, endTime?: number) => {
        if (!startTime || !endTime) return 'N/A';
        return `${endTime - startTime}ms`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'running':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(tool.status)}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Tool: {tool.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        tool.status === 'completed' 
                                            ? 'bg-green-100 text-green-700'
                                            : tool.status === 'error'
                                            ? 'bg-red-100 text-red-700'
                                            : tool.status === 'running'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {tool.status}
                                    </span>
                                    <span>Duration: {formatDuration(tool.startTime, tool.endTime)}</span>
                                    {tool.startTime && (
                                        <span>Started: {new Date(tool.startTime).toLocaleTimeString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('input')}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'input'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Input
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'output'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            disabled={!tool.output}
                        >
                            Output
                            {tool.output && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                    Available
                                </span>
                            )}
                        </button>
                        {tool.error && (
                            <button
                                onClick={() => setActiveTab('error')}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${
                                    activeTab === 'error'
                                        ? 'border-b-2 border-red-500 text-red-600'
                                        : 'text-red-500 hover:text-red-700'
                                }`}
                            >
                                Error
                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                    !
                                </span>
                            </button>
                        )}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'input' && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Tool Input Parameters</h4>
                                <button
                                    onClick={() => copyToClipboard(JSON.stringify(tool.input, null, 2), 'input')}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-600 transition-colors"
                                >
                                    {copiedSection === 'input' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
                                {JSON.stringify(tool.input, null, 2)}
                            </pre>
                        </div>
                    )}

                    {activeTab === 'output' && tool.output && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Tool Output</h4>
                                <button
                                    onClick={() => copyToClipboard(JSON.stringify(tool.output, null, 2), 'output')}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-600 transition-colors"
                                >
                                    {copiedSection === 'output' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
                                {JSON.stringify(tool.output, null, 2)}
                            </pre>
                        </div>
                    )}

                    {activeTab === 'error' && tool.error && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-red-700">Error Details</h4>
                                <button
                                    onClick={() => copyToClipboard(tool.error || '', 'error')}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-sm text-red-600 transition-colors"
                                >
                                    {copiedSection === 'error' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                                {tool.error}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div>Tool ID: {tool.id}</div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    message,
    isLoading,
    isLast
}) => {
    const [showToolResults, setShowToolResults] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<ToolResult | null>(null);
    
    const enhancedMessage = message as EnhancedChatMessage;

    // Parse tool calls and results from message content
    const parseToolInformation = (content: string) => {
        const toolResults: ToolResult[] = [];
        const toolPattern = /🔧 Using ([^.]+)\.\.\.\n(.*?)(?=🔧|✅|❌|$)/gs;
        const completedPattern = /✅ ([^.]+) completed/g;
        const errorPattern = /❌ ([^.]+) failed: (.+)/g;

        let match;
        let toolIndex = 0;

        // Extract tool usage
        while ((match = toolPattern.exec(content)) !== null) {
            const toolName = match[1].trim();
            toolResults.push({
                id: `tool-${toolIndex++}`,
                name: toolName,
                status: 'running',
                input: null
            });
        }

        // Update with completion status
        while ((match = completedPattern.exec(content)) !== null) {
            const toolName = match[1].trim();
            const tool = toolResults.find(t => t.name === toolName);
            if (tool) {
                tool.status = 'completed';
            }
        }

        // Update with error status
        while ((match = errorPattern.exec(content)) !== null) {
            const toolName = match[1].trim();
            const error = match[2].trim();
            const tool = toolResults.find(t => t.name === toolName);
            if (tool) {
                tool.status = 'error';
                tool.error = error;
            }
        }

        return toolResults;
    };

    // Clean content by removing tool execution messages for markdown rendering
    const cleanContentForMarkdown = (content: string) => {
        return content
            .replace(/🔧 Using [^.]+\.\.\.\n/g, '')
            .replace(/🔄 Executing [^.]+\.\.\.\n/g, '')
            .replace(/✅ [^.]+completed\n/g, '')
            .replace(/❌ [^.]+failed: [^\n]+\n/g, '')
            .replace(/🔧 Initializing MCP services: [^\n]+\n/g, '')
            .replace(/✅ MCP services ready\n\n/g, '')
            .trim();
    };

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Use real tool results if available, otherwise parse from content
    const toolResults = enhancedMessage.toolResults && enhancedMessage.toolResults.length > 0 
        ? enhancedMessage.toolResults 
        : parseToolInformation(message.message);
    
    const cleanContent = cleanContentForMarkdown(message.message);
    const hasToolCalls = toolResults.length > 0 || (message.mcpCalls && message.mcpCalls.length > 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-3 h-3 text-green-500" />;
            case 'error':
                return <XCircle className="w-3 h-3 text-red-500" />;
            case 'running':
                return <AlertCircle className="w-3 h-3 text-yellow-500 animate-pulse" />;
            default:
                return <Clock className="w-3 h-3 text-gray-500" />;
        }
    };

    return (
        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl rounded-xl px-6 py-4 ${
                message.type === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 shadow-sm'
            }`}>
                {/* Tool Usage Section for Assistant Messages */}
                {message.type === 'assistant' && hasToolCalls && (
                    <div className="mb-4 border border-gray-200 rounded-lg bg-gray-50">
                        <button
                            onClick={() => setShowToolResults(!showToolResults)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-gray-700">
                                    Tools Used ({toolResults.length})
                                </span>
                            </div>
                            {showToolResults ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                        
                        {showToolResults && (
                            <div className="border-t border-gray-200 p-3 space-y-2">
                                {toolResults.map((tool, idx) => (
                                    <div 
                                        key={tool.id} 
                                        className="bg-white rounded-md border border-gray-200 p-3 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(tool.status)}
                                                <span className="font-mono text-sm font-medium text-gray-900">
                                                    {tool.name}
                                                </span>
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    tool.status === 'completed' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : tool.status === 'error'
                                                        ? 'bg-red-100 text-red-700'
                                                        : tool.status === 'running'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {tool.status}
                                                </span>
                                            </div>
                                            
                                            <button
                                                onClick={() => setSelectedTool(tool)}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-xs font-medium transition-colors"
                                                title="View tool details"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View Details
                                            </button>
                                        </div>
                                        
                                        {tool.error && (
                                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                                <strong>Error:</strong> {tool.error}
                                            </div>
                                        )}
                                        
                                        {tool.startTime && tool.endTime && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                Duration: {tool.endTime - tool.startTime}ms
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Message Content with Markdown Support */}
                <div className="prose prose-sm max-w-none">
                    {message.type === 'user' ? (
                        // User messages remain as plain text with white styling
                        <div className="whitespace-pre-wrap leading-relaxed text-white">
                            {message.message}
                        </div>
                    ) : (
                        // Assistant messages with markdown rendering
                        <div className="markdown-content">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    // Custom rendering for code blocks
                                    code: ({ node, inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
                                        
                                        if (!inline && match) {
                                            return (
                                                <div className="relative">
                                                    <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-md">
                                                        <span>{match[1]}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(String(children), codeId)}
                                                            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            {copiedCode === codeId ? (
                                                                <>
                                                                    <Check size={14} />
                                                                    <span className="text-xs">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy size={14} />
                                                                    <span className="text-xs">Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <pre
                                                        className={`${className} !mt-0 !rounded-t-none overflow-x-auto`}
                                                        {...props}
                                                    >
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            );
                                        }
                                        
                                        return (
                                            <code
                                                className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    // Custom table styling
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-gray-50">{children}</thead>
                                    ),
                                    th: ({ children }) => (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-200">
                                            {children}
                                        </td>
                                    ),
                                    // Custom blockquote styling
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
                                            {children}
                                        </blockquote>
                                    ),
                                    // Custom list styling
                                    ul: ({ children }) => (
                                        <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-gray-700">{children}</li>
                                    ),
                                }}
                            >
                                {cleanContent}
                            </ReactMarkdown>
                            
                            {/* Loading indicator */}
                            {message.type === 'assistant' && isLoading && isLast && (
                                <span className="inline-block ml-1 w-2 h-5 bg-gray-400 animate-pulse"></span>
                            )}
                        </div>
                    )}
                </div>

                {/* Charts (if any) */}
                {message.charts && message.charts.length > 0 && (
                    <div className="mt-4 flex gap-3">
                        {message.charts.map((chart, idx) => (
                            <div key={idx} className="w-36 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 flex items-center justify-center group hover:shadow-md transition-shadow">
                                <div className="text-center">
                                    <span className="text-xs text-blue-700 font-medium">
                                        {chart === 'tvl-chart' ? 'TVL Trend' : 'Liquidity Map'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <div className={`text-xs mt-3 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                    {message.timestamp}
                </div>
            </div>

            {/* Tool Result Modal */}
            {selectedTool && (
                <ToolResultModal
                    tool={selectedTool}
                    isOpen={true}
                    onClose={() => setSelectedTool(null)}
                />
            )}
        </div>
    );
};

export default ChatMessageItem;