// /components/Dashboard/Shared/LoadingStates.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin text-teal-400 ${sizeClasses[size]} ${className}`} />
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = "" }) => {
  return (
    <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-teal-800/50 rounded w-3/4"></div>
        <div className="h-8 bg-teal-800/50 rounded"></div>
        <div className="h-4 bg-teal-800/50 rounded w-1/2"></div>
      </div>
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-teal-200 text-lg">{message}</p>
    </div>
  );
};