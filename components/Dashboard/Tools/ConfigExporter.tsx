import React, { useState } from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';
import type { Tool } from './ToolSelector';

interface ConfigExporterProps {
    enabledTools: Tool[];
    className?: string;
}

const ConfigExporter: React.FC<ConfigExporterProps> = ({ enabledTools, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const generateConfig = () => {
        const toolMap: Record<string, string[]> = {};

        enabledTools.forEach(tool => {
            if (!toolMap[tool.category]) {
                toolMap[tool.category] = [];
            }
            toolMap[tool.category].push(tool.id);
        });

        return {
            mcpServers: {
                "mcp-web3": {
                    command: "npx",
                    args: ["-y", "@tamago-labs/mcp-web3"],
                    env: {
                        API_KEY: "your_api_key_here",
                        ENDPOINT: "https://api.tamagolabs.com/mcp",
                        ENABLED_TOOLS: enabledTools.map(tool => tool.id).join(',')
                    },
                    disabled: false,
                    autoApprove: []
                }
            }
        };
    };

    const handleDownload = () => {
        const config = generateConfig();
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

    const handleCopy = async () => {
        const config = generateConfig();
        try {
            await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <h4 className="text-sm font-medium text-white">Export Configuration</h4>

            <div className="space-y-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors text-sm"
                >
                    <Download className="w-4 h-4" />
                    <span>Download Config</span>
                </button>

                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white rounded-lg transition-colors text-sm"
                >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Config'}</span>
                </button>
            </div>

            <div className="text-xs text-teal-400">
                Config includes {enabledTools.length} enabled tools
            </div>
        </div>
    );
};

export default ConfigExporter;