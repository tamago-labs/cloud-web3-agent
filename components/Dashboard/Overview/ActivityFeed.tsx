import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { LoadingSpinner } from '../Shared/LoadingStates';

interface ActivityItem {
  id: string;
  type: 'success' | 'error' | 'warning';
  action: string;
  details: string;
  timestamp: string;
  tool?: string;
  duration?: number;
}

interface ActivityFeedProps {
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ className = "" }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'success',
            action: 'Wallet balance check',
            details: 'Retrieved balances for 3 tokens',
            timestamp: '2 minutes ago',
            tool: 'wallet_operations',
            duration: 1200
          },
          {
            id: '2',
            type: 'success',
            action: 'Token transfer',
            details: 'Sent 100 USDC to 0x742d...35B2',
            timestamp: '15 minutes ago',
            tool: 'wallet_operations',
            duration: 3400
          },
          {
            id: '3',
            type: 'success',
            action: 'Price query',
            details: 'Fetched ETH/USD price: $3,245.67',
            timestamp: '32 minutes ago',
            tool: 'price_feeds',
            duration: 800
          },
          {
            id: '4',
            type: 'warning',
            action: 'DeFi swap attempt',
            details: 'High gas fees detected, operation paused',
            timestamp: '1 hour ago',
            tool: 'defi_operations',
            duration: 2100
          },
          {
            id: '5',
            type: 'success',
            action: 'NFT collection check',
            details: 'Found 12 NFTs in wallet',
            timestamp: '2 hours ago',
            tool: 'nft_operations',
            duration: 1800
          },
          {
            id: '6',
            type: 'error',
            action: 'Cross-chain bridge',
            details: 'Network congestion, transaction failed',
            timestamp: '3 hours ago',
            tool: 'bridge_operations',
            duration: 15000
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getStatusIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-teal-400" />;
    }
  };

  const getStatusColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-teal-500/30 bg-teal-500/10';
    }
  };

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  if (loading) {
    return (
      <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <LoadingSpinner size="sm" />
          <h2 className="text-xl font-semibold text-white">Loading Recent Activity...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        {activities.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-1 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showAll ? 'Show Less' : 'View All'}</span>
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No activity yet</h3>
          <p className="text-teal-300">Your MCP interactions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:scale-[1.01] ${getStatusColor(activity.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {activity.action}
                    </h4>
                    <span className="text-xs text-teal-300 flex-shrink-0 ml-2">
                      {activity.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm text-teal-200 mb-2">
                    {activity.details}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      {activity.tool && (
                        <span className="text-teal-400">
                          Tool: {activity.tool.replace('_', ' ')}
                        </span>
                      )}
                      {activity.duration && (
                        <span className="text-teal-400">
                          {activity.duration}ms
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;