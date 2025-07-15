"use client"

import React, { useState } from 'react';
import { Settings, Download } from 'lucide-react';
import LeftPanel from './LeftPanel';
import ChatPanel from './ChatPanel';
import RightPanel from './RightPanel';

const OnlineClientContainer = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [leftPanelView, setLeftPanelView] = useState('conversations');
    const [refreshChatTrigger, setRefreshChatTrigger] = useState(0);
    const [refreshLeftPanelTrigger, setRefreshLeftPanelTrigger] = useState(0);
    const [generatedCharts, setGeneratedCharts] = useState<any[]>([]);

    // Handle loading a conversation
    const handleLoadConversation = (conversationId: string) => {
        setSelectedConversation(conversationId);
        // Trigger chat panel to load this conversation
        setRefreshChatTrigger(prev => prev + 1);
    };

    // Handle creating a new conversation
    const handleNewConversation = () => {
        setSelectedConversation(null);
        // Trigger chat panel to reset
        setRefreshChatTrigger(prev => prev + 1);
    };

    // Handle when a new conversation is created in ChatPanel
    const handleConversationCreated = (conversationId: string) => {
        setSelectedConversation(conversationId);
        // Refresh left panel to show new conversation
        setRefreshLeftPanelTrigger(prev => prev + 1);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
 
            {/* Main Content */}
             <div className="flex-1 flex overflow-hidden">
                <LeftPanel 
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    onLoadConversation={handleLoadConversation}
                    onNewConversation={handleNewConversation}
                    refreshTrigger={refreshLeftPanelTrigger}
                />
                
                <ChatPanel 
                    selectedConversation={selectedConversation}
                    onConversationCreated={handleConversationCreated}
                    refreshTrigger={refreshChatTrigger}
                    onChartsGenerated={setGeneratedCharts}
                />
                
                <RightPanel 
                    artifacts={generatedCharts}
                /> 
            </div> 
        </div>
    );
};

export default OnlineClientContainer;