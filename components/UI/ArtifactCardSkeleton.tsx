import React from 'react';

const ArtifactCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
      {/* Chart Area */}
      <div className="p-4">
        <div className="h-48 w-full bg-gray-200 rounded-lg"></div>
      </div>

      {/* Content */}
      <div className="p-6 pt-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            {/* Description */}
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          {/* Arrow Icon */}
          <div className="w-5 h-5 bg-gray-200 rounded ml-3 flex-shrink-0"></div>
        </div>

        {/* Value & Stats */}
        <div className="flex items-center justify-between">
          <div>
            {/* Current Value */}
            <div className="h-8 bg-gray-200 rounded w-24 mb-1"></div>
            {/* Change */}
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center gap-4 mb-1">
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactCardSkeleton;