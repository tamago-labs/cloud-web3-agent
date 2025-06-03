"use client";

import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ToolStatusBar from './ToolStatusBar';
import { LoadingPage } from '../Shared/LoadingStates';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  metadata?: {
    tokensUsed?: number;
    responseTime?: number;
    error?: string;
  };
}

interface ChatContainerProps {
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ className = "" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [usageQuota, setUsageQuota] = useState({ used: 47, limit: 1000 });

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'system',
      content: '👋 Welcome to the MCP Playground! I can help you test Web3 operations like checking wallet balances, sending tokens, getting price data, and more. What would you like to try?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Load enabled tools (mock data)
    setEnabledTools(['wallet_operations', 'price_feeds', 'defi_swaps']);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call to MCP proxy
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response based on user input
      const response = generateMockResponse(content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
        metadata: {
          tokensUsed: response.tokensUsed,
          responseTime: 1200
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update usage quota
      setUsageQuota(prev => ({ ...prev, used: prev.used + 1 }));

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        metadata: {
          error: 'API Error'
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'system',
      content: '👋 Welcome to the MCP Playground! I can help you test Web3 operations like checking wallet balances, sending tokens, getting price data, and more. What would you like to try?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-200px)] bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl overflow-hidden ${className}`}>
      {/* Tool Status Bar */}
      <ToolStatusBar 
        enabledTools={enabledTools}
        usageQuota={usageQuota}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          onClearChat={handleClearChat}
        />
      </div>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading || usageQuota.used >= usageQuota.limit}
        usageQuota={usageQuota}
      />
    </div>
  );
};

// Mock response generator
const generateMockResponse = (input: string) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('balance') || lowerInput.includes('wallet')) {
    return {
      content: `I can see your wallet balances:

• **ETH**: 1.5 ETH (~$3,245.67)
• **USDC**: 500 USDC
• **LINK**: 25 LINK (~$375.50)

Your total portfolio value is approximately **$4,121.17**

Would you like me to check balances for a specific token or perform any other wallet operations?`,
      toolsUsed: ['wallet_operations'],
      tokensUsed: 85
    };
  }
  
  if (lowerInput.includes('price') || lowerInput.includes('eth') || lowerInput.includes('bitcoin')) {
    return {
      content: `Here are the current prices:

• **ETH/USD**: $3,245.67 (+2.3% 24h)
• **BTC/USD**: $67,234.12 (+1.8% 24h) 
• **LINK/USD**: $15.02 (-0.5% 24h)

Market conditions: **Bullish** 📈
Fear & Greed Index: 72 (Greed)

Would you like price data for other tokens or market analysis?`,
      toolsUsed: ['price_feeds'],
      tokensUsed: 92
    };
  }
  
  if (lowerInput.includes('send') || lowerInput.includes('transfer')) {
    return {
      content: `I can help you send tokens! To proceed with a transfer, I'll need:

1. **Token type** (ETH, USDC, etc.)
2. **Amount** to send
3. **Recipient address** or ENS name
4. **Network** (if different from mainnet)

For example: "Send 0.1 ETH to alice.eth"

⚠️ **Security Note**: This is a playground environment. Real transactions require confirmation and will show gas estimates before execution.

What token would you like to send?`,
      toolsUsed: ['wallet_operations'],
      tokensUsed: 78
    };
  }
  
  if (lowerInput.includes('swap') || lowerInput.includes('trade')) {
    return {
      content: `I can help you swap tokens using DEX aggregators! Current best rates:

**Popular Pairs:**
• ETH → USDC: 1 ETH = 3,245.67 USDC (0.3% fee)
• USDC → LINK: 1 USDC = 0.0666 LINK (0.25% fee)
• ETH → WBTC: 1 ETH = 0.048 WBTC (0.3% fee)

**Available DEXs:** Uniswap V3, SushiSwap, 1inch

To proceed, specify:
- Token to swap FROM
- Token to swap TO  
- Amount

Example: "Swap 100 USDC to LINK"`,
      toolsUsed: ['defi_swaps', 'price_feeds'],
      tokensUsed: 95
    };
  }

  // Default response
  return {
    content: `I understand you want to: "${input}"

I can help you with:
• 💰 **Wallet operations** - Check balances, send tokens, view history
• 📊 **Price data** - Get real-time prices and market data
• 🔄 **DeFi swaps** - Trade tokens on decentralized exchanges
• 🏛️ **Governance** - Participate in DAO voting
• 🎨 **NFTs** - View collections and transfer NFTs

What would you like to try? You can ask me something like:
- "Check my wallet balance"
- "What's the price of ETH?"
- "Swap 100 USDC to LINK"`,
    toolsUsed: [],
    tokensUsed: 67
  };
};

export default ChatContainer;