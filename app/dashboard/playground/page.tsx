"use client";

import React from 'react';
import ChatContainer from '@/components/Dashboard/Playground/ChatContainer';

export default function PlaygroundPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    MCP Playground
                </h1>
                <p className="text-lg text-teal-200 max-w-3xl">
                    Test your MCP tools directly in this interactive chat interface
                </p>
            </div>

            {/* Chat Interface */}
            <ChatContainer />
        </div>
    );
}