import React, { useContext, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AccountContext } from '@/contexts/account';
import { ServerContext } from '@/contexts/server';
import { creditAPI, conversationAPI, messageAPI, toolResultAPI, enhancedMessageAPI, enhancedToolResultAPI, artifactAPI } from '@/lib/api';
import { X, Square, Trash2, BarChart3 } from 'lucide-react';
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts';

// Import our MCP components
import { MCPManagementModal } from "../../../mcp/MCPManagementModal"
import { MCPServerModal } from "../../../mcp/MCPServerModal"
import { ChatHeader } from '../../../mcp/ChatHeader';
import { ChatMessageItem } from '../../../mcp/ChatMessageItem';
import { WelcomeMessage } from '../../../mcp/WelcomeMessage';
import { ChatInput } from '../../../mcp/ChatInput';
import { ChatMessage, MCPStatus } from '../../../mcp/types';

import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../../amplify/data/resource";
import ArtifactSaveModal from '../ArtifactSaveModal';
import HowToUseModal from '../../../modals/HowToUseModal';

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

interface ChatPanelProps {
    selectedConversation: string | null;
    onConversationCreated: (conversationId: string) => void;
    refreshTrigger: number;
    onArtifactSaved?: () => void; // Only notify when saved, don't pass local state
}


interface MCPServer {
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    enabled: boolean;
    registered: boolean;
    lastSeen?: string;
    error?: string;
}

interface ToolResultData {
    id?: string; // Database ID once saved
    toolId: string;
    name: string;
    input?: any;
    output?: any;
    error?: string;
    duration?: number;
    status: 'pending' | 'running' | 'completed' | 'error';
    startTime?: number;
    endTime?: number;
    serverName?: string;
}

interface DatabaseToolResult {
    messageId: string;
    toolId: string;
    toolName: string;
    serverName?: string;
    status: 'pending' | 'running' | 'completed' | 'error';
    input?: any;
    output?: any;
    error?: string;
    duration?: number;
    metadata?: any;
}

// Enhanced ChatMessage type to support tool results
interface EnhancedChatMessage extends ChatMessage {
    toolResults?: ToolResultData[];
    hasToolCalls?: boolean;
}

// Add these interfaces with your existing ones
interface CreditInfo {
    current: number;
    used: number;
    total: number;
    remaining: number;
}

interface CostEstimate {
    aiCost: number;
    toolCost: number;
    totalCost: number;
}

// Define default/always-enabled servers
const DEFAULT_SERVERS = ['nodit', 'agent-base'];

const MainArea = ({ selectedConversation, onConversationCreated, refreshTrigger, onArtifactSaved }: ChatPanelProps) => {

    const { loadServers } = useContext(ServerContext)
    const { profile } = useContext(AccountContext);

    const [{ data, isLoading: isExtracting, hasError }, extractChartData] = useAIGeneration("extractChartData");

    const [allServers, setServers] = useState<any>([])

    // Chat state
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<EnhancedChatMessage[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(selectedConversation);

    // Streaming control state
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamController, setStreamController] = useState<AbortController | null>(null);

    // Message deletion state
    const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // AI Model state
    const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');

    // MCP state
    const [mcpEnabled, setMcpEnabled] = useState(true);
    const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
    const [showMcpModal, setShowMcpModal] = useState(false);

    // MCP Server selection state 
    const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
    const [showMcpServerModal, setShowMcpServerModal] = useState(false);
    const [activeToolResults, setActiveToolResults] = useState<Map<string, ToolResultData>>(new Map());

    const [userCredits, setUserCredits] = useState<CreditInfo | null>(null);
    const [estimatedCost, setEstimatedCost] = useState<CostEstimate | null>(null);
    const [showCreditWarning, setShowCreditWarning] = useState(false);

    // Analytics conversion state
    const [convertingToChart, setConvertingToChart] = useState<string | null>(null);

    const [showArtifactModal, setShowArtifactModal] = useState(false);
    const [editingArtifact, setEditingArtifact] = useState<any>(null);
    const [isSavingArtifact, setIsSavingArtifact] = useState(false);
    const [showHowToUseModal, setShowHowToUseModal] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Helper function to check if server is default
    const isDefaultServer = (serverName: string) => {
        return DEFAULT_SERVERS.includes(serverName);
    };

    // Helper function to generate chart colors
    const generateChartColor = (index: number): string => {
        const colors = [
            '#627EEA', // Ethereum Blue
            '#2775CA', // USDC Blue
            '#F7931A', // Bitcoin Orange
            '#6B7280', // Gray
            '#10B981', // Green
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#8B5CF6', // Purple
            '#06B6D4', // Cyan
            '#84CC16'  // Lime
        ];
        return colors[index % colors.length];
    };


    // Convert message to analytics chart
    const handleConvertToAnalytics = async (messageId: string, content: string, toolResults?: any[]) => {
        setConvertingToChart(messageId);
        setEditingArtifact(null);
        setShowArtifactModal(false);

        try {
            console.log('Converting to analytics:', { messageId, content, toolResults });

            // Prepare comprehensive data for AI analysis
            let analysisText = content;

            // Include tool results data if available
            if (toolResults && toolResults.length > 0) {
                const toolData = toolResults
                    .filter(tr => tr.status === 'completed' && tr.output)
                    .map(tr => {
                        const outputStr = typeof tr.output === 'string' ? tr.output : JSON.stringify(tr.output);
                        return `Tool: ${tr.name}\nResult: ${outputStr}`;
                    })
                    .join('\n\n');

                if (toolData) {
                    analysisText = `${content}\n\nTool Results:\n${toolData}`;
                }
            }

            console.log('Sending to AI:', { analysisText, toolResults: toolResults || [] });

            // Call AI service to extract chart data
            extractChartData({
                conversationText: analysisText,
                toolResults: JSON.stringify(toolResults || [])
            });

        } catch (error) {
            console.error('Failed to convert to analytics:', error);
            alert(`Failed to create chart: ${error instanceof Error ? error.message : 'Failed to create chart. Please try again.'}`);
            setConvertingToChart(null);
        }
    };

    // Handle AI generation result
    useEffect(() => {
        if (data && convertingToChart) {
            console.log('AI Chart Data Generated:', data);

            try {
                // Validate AI response structure
                if (!data.dataName || !data.dataValue || !Array.isArray(data.dataName) || !Array.isArray(data.dataValue)) {
                    throw new Error('Invalid data structure returned from AI');
                }

                if (data.dataName.length === 0 || data.dataValue.length === 0) {
                    throw new Error('No chart data found in the conversation');
                }

                // Transform AI response to match expected chart format
                const chartData = [];
                const maxLength = Math.min(data?.dataName.length, data.dataValue.length);

                for (let i = 0; i < maxLength; i++) {
                    if (data.dataValue[i] && data.dataName[i]) {
                        const value = parseFloat(`${data.dataValue[i]}`);
                        if (isNaN(value)) {
                            console.warn(`Invalid value at index ${i}: ${data.dataValue[i]}`);
                            continue;
                        }

                        chartData.push({
                            name: String(data.dataName[i]).trim(),
                            value: value,
                            color: generateChartColor(i)
                        });
                    }
                }

                if (chartData.length === 0) {
                    throw new Error('No valid data points found for charting');
                }

                // Prepare artifact data for the save modal
                setEditingArtifact({
                    title: data.title?.trim() || 'Web3 Analytics Chart',
                    description: `Generated from AI conversation analysis`,
                    chartType: data.chartType || 'bar',
                    data: chartData,
                    totalValue: data.totalValue?.trim() || '',
                    change: data.change?.trim() || '',
                    category: 'Portfolio Analytics',
                    tags: ['AI Generated', 'Conversation'],
                    isPublic: false
                });
                setShowArtifactModal(true);

            } catch (error) {
                console.error('Error processing AI chart data:', error);
                alert(`Failed to create chart: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setConvertingToChart(null);
            }

        } else if (hasError && convertingToChart) {
            console.error('AI Generation Error:', hasError);
            alert('AI service error: Failed to extract chart data from the conversation.');
            setConvertingToChart(null);
        }
    }, [data, hasError, convertingToChart]); // Remove onChartsGenerated dependency

    useEffect(() => { 
        loadServers().then(setServers)
    }, []);

    // Handle artifact save
    const handleSaveArtifact = async (artifactData: any) => {
        if (!profile?.id || !currentConversationId) return;

        setIsSavingArtifact(true);
        try {
            // Find the latest assistant message for linking
            const latestAssistantMessage = [...chatHistory].reverse().find(msg => msg.type === 'assistant');

            await artifactAPI.createArtifact({
                userId: profile.id,
                messageId: latestAssistantMessage?.id,
                title: artifactData.title,
                description: artifactData.description,
                chartType: artifactData.chartType,
                data: artifactData.data,
                totalValue: artifactData.totalValue,
                change: artifactData.change,
                category: artifactData.category,
                tags: artifactData.tags,
                isPublic: artifactData.isPublic,
                sourceData: {
                    conversationId: currentConversationId,
                    messageId: latestAssistantMessage?.id,
                    generatedAt: new Date().toISOString()
                }
            });

            // Reset all conversion states
            setConvertingToChart(null);
            setEditingArtifact(null);
            setShowArtifactModal(false);

            // Notify parent that artifact was saved (triggers RightPanel refresh)
            if (onArtifactSaved) {
                onArtifactSaved();
            }

            alert('Artifact saved successfully!');
        } catch (error) {
            console.error('Error saving artifact:', error);
            alert('Failed to save artifact. Please try again.');
            throw error;
        } finally {
            setIsSavingArtifact(false);
        }
    };

    // Loading Modal Component
    const LoadingModal = ({ isOpen, messageId }: { isOpen: boolean; messageId: string | null }) => {
        if (!isOpen || !messageId) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ zIndex: 9998 }}>
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full mx-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Creating Analytics Artifact
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        AI is analyzing your data and generating insights...
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            This may take a few seconds depending on data complexity
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load MCP status and servers on component mount
    useEffect(() => {
        loadMCPStatus();
        loadMCPServers();
    }, []);

    // Load user credits when component mounts
    useEffect(() => {
        if (profile?.id) {
            loadUserCredits();
        }
    }, [profile]);

    // Function to load user credits
    const loadUserCredits = async () => {
        if (!profile?.id) return;

        try {
            const credits = await creditAPI.getUserCredits(profile.id);
            setUserCredits(credits);

            // Show warning if credits are low
            if (credits.current < 0.10) { // Less than $0.10
                setShowCreditWarning(true);
            }
        } catch (error) {
            console.error('Error loading user credits:', error);
        }
    };


    // Function to estimate cost before sending message
    const estimateMessageCost = (message: string, enabledServers: string[]): CostEstimate => {
        const inputTokens = creditAPI.estimateTokens(message);
        const outputTokens = Math.max(inputTokens * 2, 1000); // Rough estimate: output is usually 2x input

        // AI cost
        const aiCost = creditAPI.calculateAICost(selectedModel, inputTokens, outputTokens);

        // Tool cost (estimate based on enabled servers)
        const estimatedToolCalls = Math.min(enabledServers.length, 3); // Max 3 tools typically
        const toolCost = creditAPI.calculateToolCost(estimatedToolCalls);

        return {
            aiCost,
            toolCost,
            totalCost: aiCost + toolCost
        };
    };

    // Enhanced message input handler with cost estimation
    const handleMessageChange = (newMessage: string) => {
        setMessage(newMessage);

        if (newMessage.trim() && userCredits) {
            const enabledServers = getEnabledServers();
            const cost = estimateMessageCost(newMessage.trim(), enabledServers);
            setEstimatedCost(cost);

            // Check if user has enough credits
            if (cost.totalCost > userCredits.current) {
                setShowCreditWarning(true);
            } else {
                setShowCreditWarning(false);
            }
        } else {
            setEstimatedCost(null);
            setShowCreditWarning(false);
        }
    };

    const loadMCPStatus = async () => {
        if (!mcpEnabled) return;

        try {
            const response = await fetch('/api/mcp');
            const data = await response.json();

            if (data.success) {
                setMcpStatus(data.status);
            } else {
                setMcpStatus({
                    healthy: false,
                    connectedServers: [],
                    registeredServers: [],
                    serviceUrl: '',
                    error: data.error
                });
            }
        } catch (error) {
            console.error('Failed to load MCP status:', error);
            setMcpStatus({
                healthy: false,
                connectedServers: [],
                registeredServers: [],
                serviceUrl: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {

        }
    };

    const loadMCPServers = async () => {
        try {
            const response = await fetch('/api/mcp/servers');
            const data = await response.json();

            if (data.success) {
                // Transform the server data to match our interface
                const transformedServers: MCPServer[] = data.servers.map((server: any) => {
                    const isDefault = isDefaultServer(server.name);
                    const previousEnabled = mcpServers.find(s => s.name === server.name)?.enabled ?? false;

                    return {
                        name: server.name,
                        description: server.description,
                        status: server.connected ? 'connected' : (server.error ? 'error' : 'disconnected'),
                        tools: server.tools || 0,
                        // Default servers are always enabled, others preserve their previous state
                        enabled: isDefault ? true : (server.connected ? previousEnabled : false),
                        registered: server.registered,
                        lastSeen: server.lastSeen,
                        error: server.error
                    };
                });

                setMcpServers(transformedServers);
            } else {
                console.error('Failed to load MCP servers:', data.error);
            }
        } catch (error) {
            console.error('Error loading MCP servers:', error);
        } finally {

        }
    };

    // Handle selectedConversation changes from parent
    useEffect(() => {
        if (selectedConversation !== currentConversationId) {
            setCurrentConversationId(selectedConversation);
            if (selectedConversation) {
                loadConversation(selectedConversation);
            } else {
                setChatHistory([]);
            }
        }
    }, [selectedConversation, refreshTrigger]);

    // Update parent when conversation is created
    useEffect(() => {
        if (currentConversationId && currentConversationId !== selectedConversation) {
            onConversationCreated(currentConversationId);
        }
    }, [currentConversationId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamController) {
                streamController.abort();
            }
        };
    }, [streamController]);



    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [message]);

    const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const getCurrentTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle MCP server selection - updated to handle default servers
    const handleServerToggle = (serverName: string, enabled: boolean) => {
        // Don't allow disabling default servers
        if (isDefaultServer(serverName) && !enabled) {
            return;
        }

        setMcpServers(prev => prev.map(server =>
            server.name === serverName
                ? { ...server, enabled }
                : server
        ));
    };

    // Get enabled server names for API call - includes default servers
    const getEnabledServers = () => {
        return mcpServers
            .filter(server => {
                // Include if it's a default server OR if it's enabled and connected
                return (isDefaultServer(server.name) && server.status === 'connected') ||
                    (server.enabled && server.status === 'connected');
            })
            .map(server => server.name);
    };

    // Stop streaming function
    const handleStopStreaming = () => {
        if (streamController) {
            streamController.abort();
            setStreamController(null);
        }
        setIsStreaming(false);
        setIsLoading(false);

        // Update the last message to indicate it was stopped
        setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage && lastMessage.type === 'assistant' && lastMessage.message) {
                lastMessage.message += '\n\n*[Response stopped by user]*';
            }
            return newHistory;
        });
    };



    // Delete single message function
    const handleDeleteMessage = async (messageId: string) => {
        setDeletingMessages(prev => new Set(prev).add(messageId));

        try {
            // Remove from UI immediately for better UX
            setChatHistory(prev => prev.filter(msg => msg.id !== messageId));
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            // Revert the UI change if API call failed
            if (currentConversationId) {
                loadConversation(currentConversationId);
            }
        } finally {
            setDeletingMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(messageId);
                return newSet;
            });
        }
    };

    // Clear all messages function
    const handleClearAllMessages = async () => {
        if (!currentConversationId) return;

        const confirmClear = window.confirm('Are you sure you want to clear all messages in this conversation?');
        if (!confirmClear) return;

        try {
            setChatHistory([]);
        } catch (error) {
            console.error('Error clearing messages:', error);
            // Reload conversation if clear failed
            if (currentConversationId) {
                loadConversation(currentConversationId);
            }
        }
    };



    const handleStreamingWithDatabaseSave = async (
        reader: ReadableStreamDefaultReader<Uint8Array>,
        conversationId: string,
        userId: string,
        fullConversationHistory: any,
        currentUserMessage: any
    ) => {
        const decoder = new TextDecoder();
        let accumulatedMessage = '';
        let currentToolResults: ToolResultData[] = [];
        const activeTools = new Map<string, ToolResultData>();

        // Calculate input tokens from FULL conversation context
        let totalInputTokens = 0;

        // Calculate tokens for entire conversation history that will be sent to AI
        const fullConversation = [...fullConversationHistory, currentUserMessage];
        for (const msg of fullConversation) {
            if (msg.message) {
                totalInputTokens += creditAPI.estimateTokens(msg.message);
            }
            // Also include tool results in token calculation if they're part of context
            if (msg.toolResults && msg.toolResults.length > 0) {
                for (const toolResult of msg.toolResults) {
                    if (toolResult.output) {
                        const outputText = typeof toolResult.output === 'string' ?
                            toolResult.output : JSON.stringify(toolResult.output);
                        totalInputTokens += creditAPI.estimateTokens(outputText);
                    }
                }
            }
        }

        let totalOutputTokens = 0;

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (streamController && streamController.signal.aborted) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) throw new Error(data.error);

                            if (data.chunk) {
                                const chunkData = data.chunk;

                                if (typeof chunkData === 'string') {
                                    accumulatedMessage += chunkData;
                                    totalOutputTokens += creditAPI.estimateTokens(chunkData);
                                } else if (chunkData.type) {
                                    switch (chunkData.type) {
                                        case 'text':
                                            accumulatedMessage += chunkData.content;
                                            totalOutputTokens += creditAPI.estimateTokens(chunkData.content);
                                            break;

                                        case 'tool_start':
                                            if (chunkData.toolCall) {
                                                const toolResult: ToolResultData = {
                                                    toolId: chunkData.toolCall.id,
                                                    name: chunkData.toolCall.name,
                                                    input: chunkData.toolCall.input || {},
                                                    status: 'pending',
                                                    startTime: Date.now(),
                                                    serverName: extractServerName(chunkData.toolCall.name)
                                                };

                                                activeTools.set(toolResult.toolId, toolResult);
                                                setActiveToolResults(new Map(activeTools));

                                                // Save tool usage cost immediately
                                                await creditAPI.logUsageAndDeductCredits({
                                                    userId: userId,
                                                    serverId: toolResult.serverName,
                                                    conversationId: conversationId,
                                                    type: 'tool',
                                                    toolName: toolResult.name,
                                                    success: true
                                                });


                                            }
                                            accumulatedMessage += chunkData.content;
                                            break;

                                        case 'tool_result':
                                        case 'tool_progress':
                                        case 'tool_complete':
                                        case 'tool_error':
                                            // Handle tool state updates
                                            if (chunkData.toolCall || chunkData.toolResult) {
                                                const toolId = chunkData.toolCall?.id || chunkData.toolResult?.toolId;
                                                const existing = activeTools.get(toolId);

                                                if (existing) {
                                                    // Update tool state
                                                    if (chunkData.toolResult?.input) existing.input = chunkData.toolResult.input;
                                                    if (chunkData.toolResult?.output) existing.output = chunkData.toolResult.output;
                                                    if (chunkData.toolResult?.error) existing.error = chunkData.toolResult.error;
                                                    if (chunkData.toolCall?.output) existing.output = chunkData.toolCall.output;
                                                    if (chunkData.toolCall?.error) existing.error = chunkData.toolCall.error;

                                                    // Update status based on chunk type
                                                    if (chunkData.type === 'tool_progress') existing.status = 'running';
                                                    if (chunkData.type === 'tool_complete') {
                                                        existing.status = 'completed';
                                                        existing.endTime = Date.now();
                                                        existing.duration = existing.endTime - (existing.startTime || 0);
                                                        currentToolResults.push({ ...existing });
                                                    }
                                                    if (chunkData.type === 'tool_error') {
                                                        existing.status = 'error';
                                                        existing.endTime = Date.now();
                                                        existing.duration = existing.endTime - (existing.startTime || 0);
                                                        currentToolResults.push({ ...existing });
                                                    }

                                                    activeTools.set(existing.toolId, existing);
                                                    setActiveToolResults(new Map(activeTools));
                                                }
                                            }
                                            if (chunkData.content) {
                                                accumulatedMessage += chunkData.content;
                                            }
                                            break;
                                    }
                                }

                                // Update chat message in UI
                                setChatHistory(prev => {
                                    const newHistory = [...prev];
                                    const lastMessage = newHistory[newHistory.length - 1] as EnhancedChatMessage;
                                    if (lastMessage && lastMessage.type === 'assistant') {
                                        lastMessage.message = accumulatedMessage;
                                        lastMessage.toolResults = [...currentToolResults];
                                        lastMessage.hasToolCalls = currentToolResults.length > 0;
                                    }
                                    return newHistory;
                                });
                            }

                            if (data.done) {
                                // NOW save the complete assistant message to database (ONCE)
                                if (accumulatedMessage.trim()) {
                                    try {
                                        // Save the assistant message
                                        const savedAssistantMessage = await messageAPI.createMessage({
                                            conversationId: conversationId,
                                            messageId: generateId(),
                                            sender: 'assistant',
                                            content: accumulatedMessage,
                                            timestamp: new Date().toISOString(),
                                            position: chatHistory.length + 1
                                        });

                                        // Save tool results if any
                                        if (currentToolResults.length > 0 && savedAssistantMessage?.id) {
                                            for (const toolResult of currentToolResults) {
                                                await toolResultAPI.createToolResult({
                                                    messageId: savedAssistantMessage.id,
                                                    toolId: toolResult.toolId,
                                                    toolName: toolResult.name,
                                                    serverName: toolResult.serverName,
                                                    status: toolResult.status,
                                                    input: JSON.stringify(toolResult.input),
                                                    output: JSON.stringify(toolResult.output),
                                                    error: toolResult.error,
                                                    duration: toolResult.duration,
                                                    metadata: JSON.stringify({
                                                        startTime: toolResult.startTime,
                                                        endTime: toolResult.endTime
                                                    })
                                                });
                                            }
                                        }

                                        // Log AI usage cost
                                        if (totalInputTokens > 0 || totalOutputTokens > 0) {
                                            await creditAPI.logUsageAndDeductCredits({
                                                userId: userId,
                                                conversationId: conversationId,
                                                messageId: savedAssistantMessage?.id,
                                                type: 'ai',
                                                model: selectedModel,
                                                inputTokens: totalInputTokens,
                                                outputTokens: totalOutputTokens,
                                                success: true
                                            });
                                        }

                                    } catch (saveError) {
                                        console.error('Failed to save assistant message:', saveError);
                                    }
                                }
                                break;
                            }
                        } catch (parseError) {
                            console.error('Error parsing SSE data:', parseError);
                        }
                    }
                }
            }
        } catch (readError) {
            if (streamController && !streamController.signal.aborted) {
                console.error('Error reading stream:', readError);
                throw readError;
            }
        } finally {
            reader.releaseLock();
        }
    };

    // Helper function to extract server name from tool name
    const extractServerName = (toolName: string): string => {
        // Tool names are in format "serverName__toolName"
        const parts = toolName.split('__');
        return parts.length > 1 ? parts[0] : 'unknown';
    };

    // Enhanced handleSendMessage with credit tracking
    const handleSendMessageWithCredits = async () => {
        if (!message.trim() || isLoading || isStreaming || !profile?.id) return;

        // Check credits before sending
        if (userCredits && estimatedCost && estimatedCost.totalCost > userCredits.current) {
            alert('Insufficient credits. Please add more credits to continue.');
            return;
        }

        const userMessage: EnhancedChatMessage = {
            id: generateId(),
            type: 'user',
            message: message.trim(),
            timestamp: getCurrentTimestamp(),
            toolResults: [],
            hasToolCalls: false
        };

        setChatHistory(prev => [...prev, userMessage]);
        const currentMessage = message.trim();
        setMessage('');
        setIsLoading(true);
        setIsStreaming(true);

        // Create abort controller for this request
        const controller = new AbortController();
        setStreamController(controller);

        // Reset tool tracking
        setActiveToolResults(new Map());

        try {
            // Handle conversation creation if needed
            let activeConversationId = currentConversationId;
            if (!activeConversationId && profile?.username) {
                const title = currentMessage.substring(0, 50) + (currentMessage.length > 50 ? '...' : '');
                const newConversation = await conversationAPI.createConversation(profile.username, title);

                if (newConversation) {
                    activeConversationId = newConversation.id;
                    setCurrentConversationId(newConversation.id);

                    // Track conversation creation cost
                    await creditAPI.logUsageAndDeductCredits({
                        userId: profile.id,
                        conversationId: newConversation.id,
                        type: 'conversation',
                        success: true
                    });
                }
            }

            // Save user message to database
            if (activeConversationId) {
                await messageAPI.createMessage({
                    conversationId: activeConversationId,
                    messageId: generateId(),
                    sender: 'user',
                    content: currentMessage,
                    timestamp: new Date().toISOString(),
                    position: chatHistory.length
                });
            }

            const enabledServers = getEnabledServers();
            console.log("enabledServers (including defaults):", enabledServers);

            // Send request to chat API with MCP enabled
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatHistory,
                    currentMessage: currentMessage,
                    selectedModel: selectedModel,
                    mcpConfig: {
                        enabledServers: enabledServers
                    }
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create assistant message in UI only
            const assistantMessage: EnhancedChatMessage = {
                id: generateId(),
                type: 'assistant',
                message: '',
                timestamp: getCurrentTimestamp(),
                mcpCalls: [],
                toolResults: [],
                hasToolCalls: false
            };

            setChatHistory(prev => [...prev, assistantMessage]);

            // Read streaming response and save to database at the end
            const reader = response.body?.getReader();
            if (reader && activeConversationId) {
                // Pass the full conversation history for proper token calculation
                await handleStreamingWithDatabaseSave(reader, activeConversationId, profile.id, chatHistory, userMessage);
            }

            // Reload user credits after completion
            await loadUserCredits();

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Streaming cancelled by user');
            } else {
                console.error('Chat error:', error);

                const errorMessage: EnhancedChatMessage = {
                    id: generateId(),
                    type: 'assistant',
                    message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please try again.`,
                    timestamp: getCurrentTimestamp(),
                    toolResults: [],
                    hasToolCalls: false
                };

                setChatHistory(prev => [...prev, errorMessage]);
            }
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
            setStreamController(null);
            setActiveToolResults(new Map());
            setEstimatedCost(null);
        }
    };

    // Enhanced loadConversation function to load tool results from database
    const loadConversation = async (conversationId: string) => {
        try {
            const data = await conversationAPI.getConversationWithMessages(conversationId);

            // Convert database messages to UI format
            const messages: EnhancedChatMessage[] = data.messages.map((msg: any) => ({
                id: msg.messageId || msg.id,
                type: msg.sender,
                message: msg.content,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                toolResults: msg.toolResults ? msg.toolResults.map((tr: any) => ({
                    id: tr.id,
                    toolId: tr.toolId,
                    name: tr.toolName,
                    input: tr.input ? (typeof tr.input === 'string' ? JSON.parse(tr.input) : tr.input) : {},
                    output: tr.output ? (typeof tr.output === 'string' ? JSON.parse(tr.output) : tr.output) : null,
                    error: tr.error,
                    status: tr.status,
                    startTime: tr.createdAt ? new Date(tr.createdAt).getTime() : new Date(tr.createdAt).getTime(),
                    endTime: tr.updatedAt ? new Date(tr.updatedAt).getTime() : new Date(tr.updatedAt).getTime(),
                    duration: tr.duration,
                    serverName: tr.serverName
                })) : [],
                hasToolCalls: msg.toolResults && msg.toolResults.length > 0
            }));

            setChatHistory(messages);
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isStreaming) {
                handleSendMessageWithCredits();
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* MCP Management Modal */}
            <MCPManagementModal
                isOpen={showMcpModal}
                onClose={() => setShowMcpModal(false)}
                mcpStatus={mcpStatus}
                onStatusUpdate={loadMCPStatus}
            />

            {/* MCP Server Selection Modal */}
            <MCPServerModal
                isOpen={showMcpServerModal}
                onClose={() => setShowMcpServerModal(false)}
                servers={mcpServers}
                onServerToggle={handleServerToggle}
                onRefresh={loadMCPServers}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete this message? This action cannot be undone.</p>
                        <div className="flex space-x-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credit Warning Modal */}
            {showCreditWarning && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Low Credits Warning</h3>
                        <p className="text-gray-600 mb-4">
                            {userCredits && estimatedCost && estimatedCost.totalCost > userCredits.current
                                ? 'You don\'t have enough credits for this message.'
                                : 'Your credit balance is low. Consider adding more credits.'
                            }
                        </p>
                        <div className="flex space-x-3 justify-end">
                            <button
                                onClick={() => setShowCreditWarning(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Continue
                            </button>
                            <button
                                onClick={() => {/* Open add credits modal */ }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add Credits
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Chat Header with Enhanced Server Selection */}
            <ChatHeader
                isStreaming={isStreaming}
                hasMessages={chatHistory.length > 0}
                onStopStreaming={handleStopStreaming}
                onClearMessages={handleClearAllMessages}
                onOpenHowToUse={() => setShowHowToUseModal(true)}
            />

            {!profile && (
                <>
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-900">
                        <h2 className="text-xl font-semibold mb-2">You're not logged in</h2>
                        <p className="mb-4 text-gray-600">Please log in to access this AI chat panel</p>
                        <Link
                            href="/dashboard"
                            className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                </>
            )}

            {/* How to Use Modal - Global */}
            <HowToUseModal
                isOpen={showHowToUseModal}
                onClose={() => setShowHowToUseModal(false)}
            />

            {profile && (
                <CreditDisplay credits={userCredits} estimatedCost={estimatedCost} />
            )}

            {profile && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {chatHistory.length === 0 ? (
                            <WelcomeMessage
                                mcpEnabled={mcpEnabled}
                                mcpStatus={mcpStatus}
                                onPromptClick={setMessage}
                            />
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div key={msg.id} className="relative group">
                                    <ChatMessageItem
                                        message={msg}
                                        isLoading={isLoading && index === chatHistory.length - 1}
                                        isLast={index === chatHistory.length - 1}
                                        onConvertToAnalytics={handleConvertToAnalytics}
                                        isConverting={convertingToChart === msg.id}
                                        isExtracting={isExtracting}
                                    />

                                    {/* Delete Message Button */}
                                    <button
                                        onClick={() => setShowDeleteConfirm(msg.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
                                        title="Delete this message"
                                        disabled={deletingMessages.has(msg.id)}
                                    >
                                        {deletingMessages.has(msg.id) ? (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                        ) : (
                                            <X size={16} className="text-gray-400 hover:text-red-600" />
                                        )}
                                    </button>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <ChatInput
                        message={message}
                        isLoading={isLoading}
                        isStreaming={isStreaming}
                        mcpEnabled={mcpEnabled}
                        mcpStatus={mcpStatus}
                        mcpServers={mcpServers}
                        servers={allServers}
                        selectedModel={selectedModel}
                        textareaRef={textareaRef}
                        onMessageChange={handleMessageChange}
                        onSendMessage={handleSendMessageWithCredits}
                        onKeyPress={handleKeyPress}
                        onStopStreaming={handleStopStreaming}
                        onModelChange={setSelectedModel}
                        onServerToggle={handleServerToggle}
                        onOpenServerModal={() => setShowMcpServerModal(true)}
                    />

                    {/* Loading Modal */}
                    <LoadingModal
                        isOpen={convertingToChart !== null || isExtracting}
                        messageId={convertingToChart}
                    />

                    {/* How to Use Modal */}
                    <HowToUseModal
                        isOpen={showHowToUseModal}
                        onClose={() => setShowHowToUseModal(false)}
                    />

                    {/* Artifact Save Modal */}
                    <ArtifactSaveModal
                        isOpen={showArtifactModal}
                        onClose={() => {
                            setShowArtifactModal(false);
                            setEditingArtifact(null);
                            setConvertingToChart(null);
                        }}
                        editingArtifact={editingArtifact}
                        onSave={handleSaveArtifact}
                        isSaving={isSavingArtifact}
                    />
                </>
            )}
        </div>
    );
};

MainArea.defaultProps = {
    selectedConversation: null,
    onConversationCreated: () => { },
    refreshTrigger: 0,
    onArtifactSaved: () => { } // Add this
};


// Credit display component
const CreditDisplay: React.FC<{ credits: CreditInfo | null; estimatedCost: CostEstimate | null }> = ({
    credits,
    estimatedCost
}) => {
    if (!credits) return null;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 text-sm">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Credits:</span>
                    <span className={`font-medium ${credits.current < 0.10 ? 'text-red-600' :
                        credits.current < 1.00 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        ${credits.current.toFixed(4)}
                    </span>
                </div>
            </div>

            <Link
                href="/dashboard"
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
            >
                Add Credits
            </Link>
        </div>
    );
};


export default MainArea;