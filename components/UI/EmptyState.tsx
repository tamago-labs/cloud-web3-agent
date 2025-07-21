import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  showCreateButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No analytics found",
  description = "Be the first to create and share an analytics chart with the community.",
  actionText = "Start Analyzing",
  actionHref = "/chat",
  showCreateButton = true
}) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        {description}
      </p>

      {showCreateButton && (
        <Link 
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;