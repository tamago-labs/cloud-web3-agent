import React, { useContext, useState, useEffect } from 'react';
import { Plus, MessageSquare, ArrowLeft, Trash2 } from 'lucide-react';
import { AccountContext } from '@/contexts/account';
import { conversationAPI } from '@/lib/api';
import Link from "next/link";

interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface LeftPanelProps {
    selectedConversation: string | null;
    setSelectedConversation: (id: string | null) => void;
    onLoadConversation: (conversationId: string) => void;
    onNewConversation: () => void;
    refreshTrigger?: number;
}

const LeftPanel = ({ selectedConversation, setSelectedConversation, onLoadConversation, onNewConversation, refreshTrigger }: LeftPanelProps) => {
    const { profile } = useContext(AccountContext);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load conversations on component mount and when refreshTrigger changes
    useEffect(() => {
        if (profile) {
            loadConversations();
        }
    }, [profile, refreshTrigger]);

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            if (profile?.username) {
                const conversationsList: any = await conversationAPI.getUserConversations(profile.username);
                setConversations(conversationsList || []);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await conversationAPI.deleteConversation(conversationId);
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            if (selectedConversation === conversationId) {
                setSelectedConversation(null);
                onNewConversation();
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    const handleConversationClick = (conversation: Conversation) => {
        setSelectedConversation(conversation.id);
        onLoadConversation(conversation.id);
    };

    const handleNewConversation = () => {
        setSelectedConversation(null);
        onNewConversation();
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                {/* <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Online Client</h2>
                    <Link href="/" className="text-xs text-gray-500">
                        Back to Home
                    </Link>
                   
                </div> */}
                <button
                    onClick={handleNewConversation}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 group font-medium"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    New Conversation
                </button>

            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Loading conversations...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="p-4">
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                            <p className="text-gray-600 text-sm max-w-xs mx-auto">
                                Start your first conversation to analyze DeFi protocols, portfolios, or market trends
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => handleConversationClick(conv)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group relative ${selectedConversation === conv.id
                                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`font-medium text-sm leading-5 line-clamp-2 pr-8 ${selectedConversation === conv.id ? 'text-blue-900' : 'text-gray-900 group-hover:text-gray-700'
                                        }`}>
                                        {conv.title || 'Untitled Conversation'}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-shrink-0 absolute top-4 right-4">
                                        <button
                                            onClick={(e) => deleteConversation(conv.id, e)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all duration-200 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        {selectedConversation === conv.id && (
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-wrap gap-1">
                                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${selectedConversation === conv.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            Web3 AI
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                                        {formatTimestamp(conv.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;