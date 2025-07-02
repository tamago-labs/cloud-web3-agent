// /components/Dashboard/Tools/ConfigExporter.tsx - Updated for single chain with user settings
import React, { useState } from 'react';
import { Download, Copy, CheckCircle, Code, Eye, Key, Info } from 'lucide-react';
import type { BlockchainNetwork, ChainTool } from './ToolSelector';

interface ConfigExporterProps {
  selectedNetwork: BlockchainNetwork;
  enabledTools: ChainTool[];
  apiKeyNote?: string;
  userApiKey?: string; // User's actual API key
  className?: string;
}

const ConfigExporter: React.FC<ConfigExporterProps> = ({ 
  selectedNetwork,
  enabledTools,
  apiKeyNote,
  userApiKey,
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [configType, setConfigType] = useState<'claude' | 'custom'>('claude');

  const generateClaudeConfig = () => {
    return {
      mcpServers: {
        "tamago-web3": {
          command: "npx",
          args: ["-y", "@tamago-labs/mcp-web3"],
          env: {
            // User's API key - this is the magic that loads their settings
            API_KEY: userApiKey || "your_api_key_here",
            // Optional: Override default endpoint
            ENDPOINT: "https://api.tamagolabs.com/mcp"
          },
          disabled: false,
          autoApprove: [],
          alwaysAllow: [
            // Safe read-only tools that don't need confirmation
            "get_balance",
            "get_token_info", 
            "get_price_data",
            "get_transaction_history"
          ]
        }
      }
    };
  };

  const generateCustomConfig = () => {
    return {
      mcpServers: {
        "tamago-web3": {
          command: "npx",
          args: ["-y", "@tamago-labs/mcp-web3"],
          env: {
            API_KEY: userApiKey || "your_api_key_here",
            ENDPOINT: "https://api.tamagolabs.com/mcp",
            // Manual override (advanced users only)
            FORCE_CHAIN: selectedNetwork.chainId,
            FORCE_TOOLS: enabledTools.map(tool => tool.id).join(','),
            // Chain-specific settings
            RPC_URL: selectedNetwork.rpcUrl,
            BLOCK_EXPLORER: selectedNetwork.blockExplorer,
            // Advanced preferences
            DEFAULT_SLIPPAGE: "0.5",
            GAS_OPTIMIZATION: "true",
            CONFIRM_TRANSACTIONS: "true",
            DEBUG_MODE: "false"
          },
          disabled: false,
          autoApprove: []
        }
      }
    };
  };

  const getCurrentConfig = () => {
    return configType === 'claude' ? generateClaudeConfig() : generateCustomConfig();
  };

  const handleDownload = () => {
    const config = getCurrentConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude_desktop_config_${selectedNetwork.name.toLowerCase()}_${configType}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const config = getCurrentConfig();
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const configPreview = JSON.stringify(getCurrentConfig(), null, 2);

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">Export Configuration</h4>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1 text-teal-400 hover:text-white transition-colors"
            title="Preview config"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Type Selector */}
        <div className="space-y-2">
          <label className="text-xs text-teal-300">Configuration Type:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setConfigType('claude')}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                configType === 'claude'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-800/50 text-teal-300 hover:bg-teal-700/50'
              }`}
            >
              Smart Config
            </button>
            <button
              onClick={() => setConfigType('custom')}
              className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                configType === 'custom'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-800/50 text-teal-300 hover:bg-teal-700/50'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Configuration Description */}
        <div className="p-3 bg-teal-800/30 rounded-lg text-xs">
          {configType === 'claude' ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-teal-400" />
                <span className="text-white font-medium">Smart Configuration</span>
              </div>
              <p className="text-teal-200">
                Your API key automatically loads your tool settings. No manual configuration needed!
              </p>
              <div className="text-teal-300">
                ✨ Selected Chain: {selectedNetwork.name}<br />
                ✨ Enabled Tools: {enabledTools.length}<br />
                ✨ Auto-configured: Yes
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">Advanced Configuration</span>
              </div>
              <p className="text-teal-200">
                Manual override with explicit chain and tool settings. For advanced users only.
              </p>
              <div className="text-yellow-300">
                ⚠️ Overrides dashboard settings<br />
                ⚠️ Requires manual updates<br />
                ⚠️ Advanced users only
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleDownload}
            disabled={enabledTools.length === 0}
            className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Config</span>
          </button>
          
          <button
            onClick={handleCopy}
            disabled={enabledTools.length === 0}
            className="flex items-center justify-center space-x-2 w-full px-3 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white disabled:border-teal-800 disabled:text-teal-600 disabled:opacity-50 rounded-lg transition-colors text-sm"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Config'}</span>
          </button>
        </div>

        {/* API Key Status */}
        {userApiKey ? (
          <div className="p-2 bg-green-900/30 border border-green-600/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-200 text-xs">Ready to use with your API key</span>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 text-xs">Generate an API key first</span>
            </div>
          </div>
        )}

        {/* Tool Summary */}
        {enabledTools.length > 0 && (
          <div className="border-t border-teal-800/50 pt-3">
            <div className="text-xs text-teal-400 mb-2">Configuration Summary:</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-200 flex items-center">
                  <span className="mr-1">{selectedNetwork.icon}</span>
                  {selectedNetwork.name}
                </span>
                <span className="text-teal-400">{selectedNetwork.type.toUpperCase()}</span>
              </div>
              <div className="text-xs text-teal-300">
                {enabledTools.length} tools: {enabledTools.map(t => t.name).join(', ')}
              </div>
            </div>
          </div>
        )}

        {enabledTools.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-2">
            Enable tools to generate configuration
          </div>
        )}
      </div>

      {/* Config Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-teal-800 rounded-xl border border-teal-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">
                  {selectedNetwork.name} Configuration ({configType === 'claude' ? 'Smart' : 'Advanced'})
                </h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-teal-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Configuration Type Switcher in Modal */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfigType('claude')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    configType === 'claude'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-700 text-teal-300 hover:bg-teal-600'
                  }`}
                >
                  Smart Config (Recommended)
                </button>
                <button
                  onClick={() => setConfigType('custom')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    configType === 'custom'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-700 text-teal-300 hover:bg-teal-600'
                  }`}
                >
                  Advanced Config
                </button>
              </div>
            </div>

            {/* Config Content */}
            <div className="flex-1 overflow-hidden">
              <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
                <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                  <code>{configPreview}</code>
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>

            {/* Setup Instructions */}
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-600/50 rounded-lg">
              <h4 className="text-blue-200 font-medium mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Setup Instructions:
              </h4>
              
              {configType === 'claude' ? (
                <ol className="text-blue-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Copy this configuration to your Claude Desktop config file</li>
                  <li>{userApiKey ? 'Your API key is already included' : 'Replace "your_api_key_here" with your API key from the dashboard'}</li>
                  <li>Restart Claude Desktop to apply changes</li>
                  <li>Your tools will automatically be configured based on your dashboard settings</li>
                  <li>Test by asking: "What Web3 tools do I have available?"</li>
                </ol>
              ) : (
                <ol className="text-blue-300 text-sm space-y-2 list-decimal list-inside">
                  <li>⚠️ This advanced config overrides your dashboard settings</li>
                  <li>Copy this configuration to your Claude Desktop config file</li>
                  <li>Replace API key if needed</li>
                  <li>Manually update tools when you change dashboard settings</li>
                  <li>Restart Claude Desktop and test functionality</li>
                </ol>
              )}

              {/* Claude Desktop Config File Location */}
              <div className="mt-3 p-3 bg-gray-900/50 rounded">
                <div className="text-xs text-gray-400 mb-1">Claude Desktop config file location:</div>
                <div className="font-mono text-xs text-gray-300">
                  <div>• macOS: ~/Library/Application Support/Claude/claude_desktop_config.json</div>
                  <div>• Windows: %APPDATA%\Claude\claude_desktop_config.json</div>
                  <div>• Linux: ~/.config/claude/claude_desktop_config.json</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigExporter;