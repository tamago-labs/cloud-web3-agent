import React from 'react';
import { Settings, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

interface ToolStatusBarProps {
  enabledTools: string[];
  usageQuota: { used: number; limit: number };
  className?: string;
}

const ToolStatusBar: React.FC<ToolStatusBarProps> = ({ 
  enabledTools, 
  usageQuota,
  className = "" 
}) => {
  const toolDisplayNames: Record<string, string> = {
    wallet_operations: 'Wallet',
    price_feeds: 'Prices',
    defi_swaps: 'DeFi',
    nft_operations: 'NFTs',
    governance: 'Governance',
    bridge_operations: 'Bridge'
  };

  const getUsageColor = () => {
    const percentage = (usageQuota.used / usageQuota.limit) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-teal-400';
  };

  return (
    <div className={`bg-teal-800/30 border-b border-teal-700/50 px-4 py-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        {/* Active Tools */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-teal-300">Active Tools:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {enabledTools.length > 0 ? (
              enabledTools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-1 bg-teal-600/50 text-teal-100 text-xs rounded-full border border-teal-500/50"
                >
                  {toolDisplayNames[tool] || tool}
                </span>
              ))
            ) : (
              <span className="text-sm text-teal-500">No tools enabled</span>
            )}
            
            <Link
              href="/dashboard/tools"
              className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Configure</span>
            </Link>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300">Usage:</span>
            <span className={getUsageColor()}>
              {usageQuota.used}/{usageQuota.limit} messages
            </span>
          </div>
          
          <div className="w-16 bg-teal-900/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                (usageQuota.used / usageQuota.limit) * 100 >= 90 
                  ? 'bg-red-500' 
                  : (usageQuota.used / usageQuota.limit) * 100 >= 70
                  ? 'bg-yellow-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min((usageQuota.used / usageQuota.limit) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolStatusBar;