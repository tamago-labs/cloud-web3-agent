import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Zap, Settings } from 'lucide-react';
import UsageIndicator from '../Shared/UsageIndicator';
import { LoadingCard } from '../Shared/LoadingStates';

interface UsageStats {
  messagesUsed: number;
  messagesLimit: number;
  apiCallsToday: number;
  enabledTools: number;
  totalTools: number;
  monthlyGrowth: number;
}

interface UsageStatsGridProps {
  className?: string;
}

const UsageStatsGrid: React.FC<UsageStatsGridProps> = ({ className = "" }) => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats({
          messagesUsed: 47,
          messagesLimit: 1000,
          apiCallsToday: 2341,
          enabledTools: 5,
          totalTools: 12,
          monthlyGrowth: 23.5
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`text-center text-red-400 ${className}`}>
        Failed to load usage statistics
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {/* Messages Usage */}
      <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Messages</h3>
              <p className="text-sm text-teal-200">This month</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-white">
            {stats.messagesUsed.toLocaleString()}
            <span className="text-sm text-teal-300 font-normal ml-1">
              / {stats.messagesLimit.toLocaleString()}
            </span>
          </div>
          
          <UsageIndicator
            used={stats.messagesUsed}
            limit={stats.messagesLimit}
            type="Monthly Quota"
          />
          
          <div className="flex items-center text-sm text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{stats.monthlyGrowth}% vs last month</span>
          </div>
        </div>
      </div>

      {/* API Calls Today */}
      <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">API Calls</h3>
              <p className="text-sm text-teal-200">Today</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-white">
            {stats.apiCallsToday.toLocaleString()}
          </div>
          
          <div className="text-sm text-teal-300">
            Peak hour: 2:00 PM - 3:00 PM
          </div>
          
          <div className="flex items-center text-sm text-teal-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Active Tools */}
      <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Active Tools</h3>
              <p className="text-sm text-teal-200">Enabled</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-white">
            {stats.enabledTools}
            <span className="text-sm text-teal-300 font-normal ml-1">
              of {stats.totalTools}
            </span>
          </div>
          
          <div className="w-full bg-teal-900/30 rounded-full h-2">
            <div 
              className="h-2 bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(stats.enabledTools / stats.totalTools) * 100}%` }}
            />
          </div>
          
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            → Manage Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsGrid;