"use client"

import React, { useState, useContext } from 'react';
import { Settings, Download } from 'lucide-react';
import LeftPanel from './LeftPanel';
import ChatPanel from './ChatPanel';
import RightPanel from './RightPanel';
import { AccountContext } from '@/contexts/account';

const OnlineClientContainer = () => {

    const { profile } = useContext(AccountContext)

    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [refreshChatTrigger, setRefreshChatTrigger] = useState(0);
    const [refreshLeftPanelTrigger, setRefreshLeftPanelTrigger] = useState(0);
    const [refreshRightPanelTrigger, setRefreshRightPanelTrigger] = useState(0);



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

    // Handle when artifacts are saved/updated/deleted - triggers RightPanel refresh
    const handleArtifactUpdate = () => {
        setRefreshRightPanelTrigger(prev => prev + 1);
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
                    onArtifactSaved={handleArtifactUpdate}
                />

                <RightPanel
                    refreshTrigger={refreshRightPanelTrigger}
                    onArtifactUpdate={handleArtifactUpdate}
                />
            </div>
        </div>
    );
};

export default OnlineClientContainer;