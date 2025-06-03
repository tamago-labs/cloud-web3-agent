// /components/Dashboard/Layout/DashboardHeader.tsx
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ExternalLink,
  Save,
  Calendar,
  Zap,
  MessageSquare,
  Crown,
  Clock,
  TrendingUp
} from 'lucide-react';
import { signOut } from 'aws-amplify/auth';
import { LoadingSpinner } from '../Shared/LoadingStates';
import QuotaProgress from '../Shared/QuotaProgress';
import { CloudAgentContext } from '@/hooks/useCloudAgent';

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  tierName: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface UsageQuota {
  id: string;
  quotaType: string;
  limitAmount: number;
  currentUsage: number;
  resetDate: string;
  tierName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen
}) => {

  const { profile } = useContext(CloudAgentContext)

  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quotas, setQuotas] = useState<UsageQuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockProfile: UserProfile = {
          id: 'user_123',
          username: 'john.doe@example.com',
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          tierName: 'FREE',
          createdAt: '2024-11-15T10:00:00Z',
          lastLoginAt: '2024-12-15T08:30:00Z'
        };

        const mockQuotas: UsageQuota[] = [
          {
            id: '1',
            quotaType: 'messages_monthly',
            limitAmount: 1000,
            currentUsage: 47,
            resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            tierName: 'FREE'
          },
          {
            id: '2',
            quotaType: 'api_calls_daily',
            limitAmount: 500,
            currentUsage: 234,
            resetDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            tierName: 'FREE'
          }
        ];

        setUserProfile(mockProfile);
        setQuotas(mockQuotas);
        setDisplayName(mockProfile.displayName || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      // Simulate API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserProfile(prev => prev ? {
        ...prev,
        displayName: displayName.trim()
      } : null);

      setSettingsModalOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const getPageTitle = () => {
    if (pathname.includes('/playground')) return 'MCP Playground';
    if (pathname.includes('/tools')) return 'Tool Configuration';
    return 'Dashboard Overview';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      FREE: 'bg-gray-500 text-white',
      PRO: 'bg-blue-500/20 text-blue-400',
      ENTERPRISE: 'bg-purple-500/20 text-purple-400'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[tier as keyof typeof colors] || colors.FREE}`}>
        {tier === 'ENTERPRISE' && <Crown className="w-3 h-3 mr-1" />}
        {tier}
      </span>
    );
  };

  const getUsageStats = () => {
    const monthlyQuota = quotas.find(q => q.quotaType === 'messages_monthly');
    const dailyQuota = quotas.find(q => q.quotaType === 'api_calls_daily');

    return {
      monthly: monthlyQuota,
      daily: dailyQuota
    };
  };

  const usageStats = getUsageStats();

  return (
    <>
      <header className=" backdrop-blur-sm border-b border-teal-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={onMobileMenuToggle}
                className="md:hidden p-2 rounded-lg text-teal-200 hover:bg-teal-800/50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo and title */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="hidden sm:block text-white font-semibold">Tamago Labs</span>
                </Link>
                <span className="hidden sm:block text-teal-300">|</span>
                <h1 className="text-white font-medium">{getPageTitle()}</h1>
              </div>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
                  }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/playground"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/playground'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
                  }`}
              >
                Playground
              </Link>
              <Link
                href="/dashboard/tools"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/tools'
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-200 hover:bg-teal-800/50 hover:text-white'
                  }`}
              >
                Tools
              </Link>
            </nav>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {/* Usage indicator (desktop only) */}
              {/* {usageStats.monthly && (
                <div className="hidden lg:flex items-center space-x-2 text-sm text-teal-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>{usageStats.monthly.currentUsage}/{usageStats.monthly.limitAmount}</span>
                </div>
              )} */}

              {/* Docs link */}
              <Link
                href="https://docs.tamagolabs.com"
                target="_blank"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 text-teal-200 hover:text-white transition-colors"
              >
                <span className="text-sm">Docs</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center cursor-pointer space-x-2 p-2 rounded-lg text-teal-200 hover:bg-teal-800/50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm">Account</span>
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-teal-800 rounded-lg shadow-xl border border-teal-700 py-1 z-50">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-teal-100 hover:bg-teal-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-300 hover:bg-teal-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close user menu */}
        {userMenuOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setUserMenuOpen(false)}
          />
        )}
      </header>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-teal-800 rounded-xl border border-teal-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Account Settings</h3>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-2 text-teal-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-teal-700/30 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Profile Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                      <label className="block text-sm font-medium text-teal-200 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                        className="w-full px-3 py-2 bg-teal-600/50 border border-teal-500 rounded-lg text-white placeholder-teal-300 focus:border-teal-400 focus:ring-0"
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-teal-200 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userProfile?.email || ''}
                        disabled
                        className="w-full px-3 py-2 bg-teal-800/50 border border-teal-600 rounded-lg text-teal-300 cursor-not-allowed"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-teal-200 mb-2">
                        Plan
                      </label>
                      <div className="flex items-center space-x-2">
                        {userProfile && getTierBadge(userProfile.tierName)}
                        {/* {userProfile?.tierName === 'FREE' && (
                          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            Upgrade →
                          </button>
                        )} */}
                        <div className="text-xs  text-teal-100">
                          Only the free plan is supported
                        </div>

                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-teal-200 mb-2">
                        Member Since
                      </label>
                      <div className="text-teal-100">
                        {profile && formatDate(profile.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Quotas Section */}
                <div className="bg-teal-700/30 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Usage Quotas</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usageStats.monthly && (
                      <QuotaProgress
                        current={usageStats.monthly.currentUsage}
                        limit={usageStats.monthly.limitAmount}
                        resetDate={new Date(usageStats.monthly.resetDate)}
                        type="monthly"
                      />
                    )}

                    {usageStats.daily && (
                      <QuotaProgress
                        current={usageStats.daily.currentUsage}
                        limit={usageStats.daily.limitAmount}
                        resetDate={new Date(usageStats.daily.resetDate)}
                        type="daily"
                      />
                    )}
                  </div>

                  {/* Usage Summary */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-teal-600/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {usageStats.monthly ? usageStats.monthly.currentUsage : 0}
                      </div>
                      <div className="text-sm text-teal-300">Messages Used</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {usageStats.daily ? usageStats.daily.currentUsage : 0}
                      </div>
                      <div className="text-sm text-teal-300">API Calls Today</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {usageStats.monthly ? Math.round((usageStats.monthly.currentUsage / usageStats.monthly.limitAmount) * 100) : 0}%
                      </div>
                      <div className="text-sm text-teal-300">Monthly Usage</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {userProfile ? Math.floor((Date.now() - new Date(userProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                      </div>
                      <div className="text-sm text-teal-300">Days Active</div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                {/* <div className="bg-teal-700/30 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Account Actions</h4>
                  
                  <div className="space-y-3">
                    <button className="w-full text-left px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-teal-600/30 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Upgrade Plan</span>
                      </div>
                    </button>
                    
                    <button className="w-full text-left px-3 py-2 text-teal-300 hover:text-white hover:bg-teal-600/30 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>View Billing History</span>
                      </div>
                    </button>
                  </div>
                </div> */}

                {/* Save Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-teal-600/50">
                  <button
                    onClick={() => setSettingsModalOpen(false)}
                    className="px-4 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>

                  {/* <button
                    onClick={handleSaveSettings}
                    disabled={saving || displayName.trim() === userProfile?.displayName}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {saving ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;