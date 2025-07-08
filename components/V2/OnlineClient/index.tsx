"use client"

import React, { useState } from 'react';
import { Settings, Download } from 'lucide-react';
import LeftPanel from './LeftPanel';
import ChatPanel from './ChatPanel';
import RightPanel from './RightPanel';

const OnlineClientContainer = () => {

    const [selectedConversation, setSelectedConversation] = useState(1);
    const [leftPanelView, setLeftPanelView] = useState('conversations');

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
 
            {/* Main Content */}
             <div className="flex-1 flex overflow-hidden">
                <LeftPanel 
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    leftPanelView={leftPanelView}
                    setLeftPanelView={setLeftPanelView}
                />
                
                <ChatPanel 
                   // selectedConversation={selectedConversation}
                />
                
                <RightPanel /> 
            </div> 
        </div>
    );
};

export default OnlineClientContainer;