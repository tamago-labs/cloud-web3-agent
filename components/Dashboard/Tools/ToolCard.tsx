import React from 'react';
import { Toggle } from 'lucide-react';
import type { Tool } from './ToolSelector';

interface ToolCardProps {
  tool: Tool;
  onToggle: () => void;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onToggle, className = "" }) => {
  const getUsageColor = (count: number) => {
    if (count === 0) return 'text-gray-400';
    if (count < 10) return 'text-yellow-400';
    if (count < 100) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
          <p className="text-sm text-teal-200 leading-relaxed">{tool.description}</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="ml-4">
          <button
            onClick={onToggle}
            disabled={tool.isRequired}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              tool.isEnabled
                ? 'bg-teal-600'
                : 'bg-teal-800'
            } ${tool.isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                tool.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tool Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs ${
            tool.isEnabled
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {tool.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          
          {tool.isRequired && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              Required
            </span>
          )}
        </div>

        {/* Usage Stats */}
        <div className={`${getUsageColor(tool.usageCount || 0)}`}>
          {tool.usageCount || 0} uses
        </div>
      </div>

      {/* Documentation Link */}
      {tool.documentation && (
        <div className="mt-3 pt-3 border-t border-teal-800/50">
          <a
            href={tool.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            📖 View Documentation
          </a>
        </div>
      )}
    </div>
  );
};

export default ToolCard;