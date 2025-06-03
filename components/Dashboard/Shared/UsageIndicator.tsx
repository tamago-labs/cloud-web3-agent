import React from 'react';

interface UsageIndicatorProps {
  used: number;
  limit: number;
  type: string;
  className?: string;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ used, limit, type, className = "" }) => {
  const percentage = Math.min((used / limit) * 100, 100);
  
  const getColorClass = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-teal-500';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-teal-400';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-teal-100">{type}</span>
        <span className={getTextColor()}>
          {used.toLocaleString()}/{limit.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-teal-900/30 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage >= 90 && (
        <p className="text-xs text-red-400">⚠️ Approaching limit</p>
      )}
    </div>
  );
};

export default UsageIndicator;