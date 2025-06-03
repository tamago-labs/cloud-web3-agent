import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Download, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../Shared/LoadingStates';

interface ApiKeyData {
  apiKey: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt?: string;
}

interface ApiKeySectionProps {
  className?: string;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({ className = "" }) => {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const fetchApiKey = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setApiKeyData({
          apiKey: 'mcp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
          keyPrefix: 'mcp_1a2b3c4d',
          isActive: true,
          lastUsedAt: '2 minutes ago'
        });
      } catch (error) {
        console.error('Error fetching API key:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleCopyKey = async () => {
    if (!apiKeyData?.apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKeyData.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleRegenerateKey = async () => {
    setRegenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Generate new mock key
      const newKey = 'mcp_' + Math.random().toString(36).substring(2, 50);
      setApiKeyData(prev => prev ? {
        ...prev,
        apiKey: newKey,
        keyPrefix: newKey.substring(0, 12)
      } : null);
    } catch (error) {
      console.error('Error regenerating API key:', error);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownloadConfig = () => {
    const config = {
      mcpServers: {
        "mcp-web3": {
          command: "npx",
          args: ["-y", "@tamago-labs/mcp-web3"],
          env: {
            API_KEY: apiKeyData?.apiKey,
            ENDPOINT: "https://api.tamagolabs.com/mcp"
          },
          disabled: false,
          autoApprove: []
        }
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claude_desktop_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const displayKey = showFullKey 
    ? apiKeyData?.apiKey 
    : apiKeyData?.keyPrefix + '••••••••••••••••••••••••••••••••••••••••';

  if (loading) {
    return (
      <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <LoadingSpinner size="sm" />
          <h2 className="text-xl font-semibold text-white">Loading API Access...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          🔑 Your MCP Access
        </h2>
        <div className="flex items-center space-x-2 text-sm">
          {apiKeyData?.isActive ? (
            <span className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Active
            </span>
          ) : (
            <span className="text-red-400">Inactive</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* API Key Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-teal-200">API Key</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-teal-800/30 border border-teal-700 rounded-lg px-3 py-2 font-mono text-sm text-white">
              {displayKey}
            </div>
            <button
              onClick={() => setShowFullKey(!showFullKey)}
              className="p-2 text-teal-300 hover:text-white transition-colors"
              title={showFullKey ? 'Hide key' : 'Show key'}
            >
              {showFullKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopyKey}
              className="flex items-center space-x-1 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
              disabled={!apiKeyData?.apiKey}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Endpoint */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-teal-200">Endpoint</label>
          <div className="bg-teal-800/30 border border-teal-700 rounded-lg px-3 py-2 font-mono text-sm text-white">
            https://api.tamagolabs.com/mcp
          </div>
        </div>

        {/* Last Used */}
        {apiKeyData?.lastUsedAt && (
          <div className="text-sm text-teal-300">
            Last used: {apiKeyData.lastUsedAt}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleDownloadConfig}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Config</span>
          </button>
          
          <button
            onClick={handleRegenerateKey}
            disabled={regenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <a
            href="https://docs.tamagolabs.com/integration"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white rounded-lg transition-colors"
          >
            <span>Integration Guide</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySection;