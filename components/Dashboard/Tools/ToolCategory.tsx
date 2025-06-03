import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabledCount: number;
  tools: any[];
}

interface ToolCategoryProps {
  category: ToolCategory;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

const ToolCategory: React.FC<ToolCategoryProps> = ({ 
  category, 
  isSelected, 
  onSelect,
  className = "" 
}) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-teal-600 text-white'
          : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{category.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{category.name}</div>
            <div className="text-xs opacity-75">
              {category.enabledCount}/{category.tools.length} enabled
            </div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${
          isSelected ? 'rotate-90' : ''
        }`} />
      </div>
    </button>
  );
};

export default ToolCategory;