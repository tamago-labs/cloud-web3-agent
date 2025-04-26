import {
    Cloud,
    Cpu,
    Zap,
    Book,
    Code,
    Shield,
    Settings,
    Terminal,
    ExternalLink,
    ChevronRight,
    Copy,
    Download,
    CheckCircle
} from 'lucide-react';
import { useState } from 'react';

const HowItWorks = () => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`{
            "mcpServers": {
              "mcp-web3": {
                "command": "npx",
                "args": ["-y", "@tamago-labs/mcp-web3"],
                "env": {
                  "API_KEY": "your_operator_id",
                  "PRIVATE_KEY": "your_private_key"
                },
                "disabled": false,
                "autoApprove": []
              }
            }
          }`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative py-20 bg-gradient-to-b from-teal-900 to-teal-950" id="how-it-works">
            <div className="absolute inset-0  opacity-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"></div>
                <div className="absolute top-20 -left-20 w-60 h-60 bg-teal-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-600 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Install MCP */}
                    <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 
                transition-transform hover:transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-lg bg-teal-800/50 flex items-center justify-center mb-5 group-hover:bg-teal-700/50 transition-colors">
                            <Terminal className="h-8 w-8 text-teal-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. Download Client</h3>
                        <p className="text-teal-200 mb-4">Install an MCP-compatible client such as Claude Desktop:</p>
                        <div className="bg-gray-900/80 break-all rounded-lg p-3 font-mono text-sm text-teal-100 h-40 overflow-y-auto">

                            # Clone the repository<br />
                            git clone https://github.com/aaddrick/claude-desktop-debian.git<br />
                            cd claude-desktop-debian<br /><br />

                            # Build the package<br />
                            ./build.sh<br />
                        </div>
                    </div>

                    {/* Card 2: Configure MCP */}
                    <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 
                transition-transform hover:transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-lg bg-teal-800/50 flex items-center justify-center mb-5 group-hover:bg-teal-700/50 transition-colors">
                            <Settings className="h-8 w-8 text-teal-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. Configure MCP</h3>
                        <p className="text-teal-200 mb-4">Add this configuration to your Claude Desktop config.json file:</p>
                        <div className="relative">
                            <div className="bg-gray-900/80 break-all rounded-lg p-3 font-mono text-sm text-teal-100 h-40 overflow-y-auto">
                                {`{
    "mcpServers": {
      "mcp-web3": {
        "command": "npx",
        "args": ["-y", "@tamago-labs/mcp-web3"],
        "env": {
          "API_KEY": "your_operator_id",
          "PRIVATE_KEY": "your_private_key"
        },
        "disabled": false,
        "autoApprove": []
      }
    }
  }`}

                            </div>
                            <button
                                className="absolute top-2 right-2 p-1.5 bg-teal-800/70 hover:bg-teal-700 rounded-md transition-colors"
                                onClick={handleCopy}
                            >
                                {copied ? <CheckCircle className="h-4 w-4 text-teal-300" /> : <Copy className="h-4 w-4 text-teal-300" />}
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Test Connection */}
                    <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 
                transition-transform hover:transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-lg bg-teal-800/50 flex items-center justify-center mb-5 group-hover:bg-teal-700/50 transition-colors">
                            <Code className="h-8 w-8 text-teal-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. Test Connection</h3>
                        <p className="text-teal-200 mb-4">Ask Claude to check the connection with this prompt:</p>
                        <div className="bg-gray-900/80 rounded-lg p-3 font-mono text-sm text-teal-100">
                            "Can you check my wallet balance?"
                        </div>
                    </div> 
                </div>

            </div>


        </section>
    )
}

export default HowItWorks