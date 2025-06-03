// /components/Dashboard/Shared/QuotaProgress.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface QuotaProgressProps {
  current: number;
  limit: number;
  resetDate: Date;
  type: 'daily' | 'monthly';
  className?: string;
}

const QuotaProgress: React.FC<QuotaProgressProps> = ({ 
  current, 
  limit, 
  resetDate, 
  type,
  className = "" 
}) => {
  const percentage = (current / limit) * 100;
  const timeUntilReset = resetDate.getTime() - Date.now();
  const daysUntilReset = Math.ceil(timeUntilReset / (1000 * 60 * 60 * 24));
  const hoursUntilReset = Math.ceil(timeUntilReset / (1000 * 60 * 60));

  const getStatus = () => {
    if (percentage >= 95) return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500' };
    if (percentage >= 80) return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { icon: CheckCircle, color: 'text-teal-400', bg: 'bg-teal-500' };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-5 h-5 ${status.color}`} />
          <span className="text-white font-medium capitalize">{type} Quota</span>
        </div>
        <span className="text-sm text-teal-200">
          Resets in {type === 'daily' ? `${hoursUntilReset}h` : `${daysUntilReset}d`}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-teal-100">Used</span>
          <span className={status.color}>
            {current.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-teal-900/30 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${status.bg}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-teal-300">
          {Math.max(0, limit - current).toLocaleString()} remaining
        </div>
      </div>
    </div>
  );
};

export default QuotaProgress;