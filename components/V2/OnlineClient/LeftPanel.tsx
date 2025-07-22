import React, { useContext, useState, useEffect } from 'react';
import { Plus, MessageSquare, ArrowLeft, Trash2, Edit2, TrendingUp, PieChart, Search, MessageCircle, Bot } from 'lucide-react';
import { AccountContext } from '@/contexts/account';
import { conversationAPI } from '@/lib/api';
import Link from "next/link";
import RenameConversationModal from '../../modals/RenameConversationModal';

interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    category?: string;
    metadata?: any;
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
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renamingConversation, setRenamingConversation] = useState<Conversation | null>(null);
    const [isRenaming, setIsRenaming] = useState(false);

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

    const handleRename = (conversation: Conversation, e: React.MouseEvent) => {
        e.stopPropagation();
        setRenamingConversation(conversation);
        setShowRenameModal(true);
    };

    const handleRenameSubmit = async (newTitle: string) => {
        if (!renamingConversation) return;
        
        setIsRenaming(true);
        try {
            await conversationAPI.updateConversationTitle(renamingConversation.id, newTitle);
            setConversations(prev => prev.map(conv => 
                conv.id === renamingConversation.id 
                    ? { ...conv, title: newTitle }
                    : conv
            ));
        } catch (error) {
            console.error('Error renaming conversation:', error);
            throw error;
        } finally {
            setIsRenaming(false);
        }
    };

    const categorizeConversation = (title: string, content?: string): string => {
        const text = (title + ' ' + (content || '')).toLowerCase();
        
        if (text.match(/\b(defi|yield|protocol|tvl|liquidity|apy|apr|farming|staking)\b/)) {
            return 'DeFi Analysis';
        }
        if (text.match(/\b(portfolio|balance|token|wallet|holdings|assets)\b/)) {
            return 'Portfolio';
        }
        if (text.match(/\b(price|market|trend|chart|analysis|research)\b/)) {
            return 'Market Research';
        }
        if (text.match(/\b(nft|collection|opensea|mint|metadata)\b/)) {
            return 'NFT Analysis';
        }
        return 'General Chat';
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'DeFi Analysis': return <TrendingUp className="w-3 h-3" />;
            case 'Portfolio': return <PieChart className="w-3 h-3" />;
            case 'Market Research': return <Search className="w-3 h-3" />;
            case 'NFT Analysis': return <Bot className="w-3 h-3" />;
            default: return <MessageCircle className="w-3 h-3" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'DeFi Analysis': return 'bg-green-100 text-green-700';
            case 'Portfolio': return 'bg-blue-100 text-blue-700';
            case 'Market Research': return 'bg-purple-100 text-purple-700';
            case 'NFT Analysis': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-600';
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
                        {conversations.map((conv) => {
                            const category = categorizeConversation(conv.title);
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => handleConversationClick(conv)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group relative ${selectedConversation === conv.id
                                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className={`font-medium text-sm leading-5 line-clamp-2 pr-16 ${selectedConversation === conv.id ? 'text-blue-900' : 'text-gray-900 group-hover:text-gray-700'
                                            }`}>
                                            {conv.title || 'Untitled Conversation'}
                                        </h3>
                                        <div className="flex items-center gap-1 flex-shrink-0 absolute top-4 right-4">
                                            <button
                                                onClick={(e) => handleRename(conv, e)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all duration-200 p-1 hover:bg-blue-50 rounded"
                                                title="Rename conversation"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => deleteConversation(conv.id, e)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all duration-200 p-1 hover:bg-red-50 rounded"
                                                title="Delete conversation"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                            {selectedConversation === conv.id && (
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-1"></div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-wrap gap-1">
                                            <span className={`px-2 py-1 text-xs rounded-md font-medium flex items-center gap-1 ${
                                                selectedConversation === conv.id
                                                    ? getCategoryColor(category).replace('100', '200') 
                                                    : getCategoryColor(category)
                                            }`}>
                                                {getCategoryIcon(category)}
                                                {category}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                                            {formatTimestamp(conv.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rename Modal */}
            <RenameConversationModal
                isOpen={showRenameModal}
                onClose={() => {
                    setShowRenameModal(false);
                    setRenamingConversation(null);
                }}
                currentTitle={renamingConversation?.title || ''}
                onSave={handleRenameSubmit}
                isSaving={isRenaming}
            />
        </div>
    );
};

export default LeftPanel;