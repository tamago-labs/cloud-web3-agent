// /components/Dashboard/Overview/ApiKeySection.tsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Copy,
  Plus,
  Eye,
  EyeOff,
  CheckCircle,
  Trash2,
  MoreHorizontal,
  Calendar,
  Activity,
  StopCircle,
  Key,
  KeyRound
} from 'lucide-react';
import { LoadingSpinner } from '../Shared/LoadingStates';
import { CloudAgentContext } from '@/hooks/useCloudAgent';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string; // Only available when first created
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  usageCount: number;
}

interface ApiKeySectionProps {
  className?: string;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({ className = "" }) => {

  const { profile, generateApiKey, deleteApiKey }: any = useContext(CloudAgentContext)

  const [tick, setTick] = useState<number>(0)
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    profile && fetchApiKeys(profile);
  }, [profile, tick]);

  const fetchApiKeys = async (profile: any) => {
    setLoading(true);
    try {
      const { data } = await profile.apiKeys()

      setApiKeys(data.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA; // Descending order
      }));
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = useCallback(async () => {

    if (!newKeyName.trim()) return;

    setCreating(true);

    try {

      const newKey = await generateApiKey(profile.id, newKeyName)

      setNewKeyName('');
      setShowCreateModal(false);
      setVisibleKeys((prev: any) => new Set([...prev, newKey.apiKey]));

      setTick(tick + 1)

    } catch (error: any) {
      console.error('Error creating API key:', error);
    } finally {
      setCreating(false)
    }

  }, [newKeyName, profile, tick, apiKeys])

  const handleCopyKey = async (key: any) => {
    const keyToCopy = key.id

    try {
      await navigator.clipboard.writeText(keyToCopy);
      setCopiedKey(key.id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleToggleVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this access key? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteApiKey(keyId)
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      setVisibleKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });

    } catch (error) {
      console.error('Error deleting access key:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayKey = (key: any) => {
    if (key.id && visibleKeys.has(key.id)) {
      return key.id;
    }
    if (visibleKeys.has(key.id)) {
      return `••••••••••••••••••••••••••••••••••••`;
    }
    return `••••••••••••••••••••••••••••••••••••`;
  };

  if (loading) {
    return (
      <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <LoadingSpinner size="sm" />
          <h2 className="text-xl font-semibold text-white">Loading Access Keys...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <KeyRound className="w-6 h-6 text-teal-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Access Keys</h2>
              <p className="text-sm text-teal-300">Manage your access keys for your MCP client or the Butler AI code editor</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Key</span>
          </button>
        </div>


        {/* API Keys Table */}
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <KeyRound className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Access Keys</h3>
            <p className="text-teal-300 mb-4">Create your first access key to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
            >
              Create Access Key
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-teal-800/50">
            <table className="w-full">
              <thead className="bg-teal-800/30">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Key</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Last Used</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-teal-200">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-teal-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-800/30">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-teal-800/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{key.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-teal-100 font-mono bg-teal-800/30 px-2 py-1 rounded">
                          {getDisplayKey(key)}
                        </code>
                        <button
                          onClick={() => handleToggleVisibility(key.id)}
                          className="p-1 text-teal-400 hover:text-white transition-colors"
                          title={visibleKeys.has(key.id) ? 'Hide key' : 'Show key'}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(key)}
                          className="p-1 text-teal-400 hover:text-white transition-colors"
                          title="Copy key"
                        >
                          {copiedKey === key.id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${key.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-sm text-teal-300">
                        <Activity className="w-4 h-4" />
                        {/* <span>{key.usageCount.toLocaleString()}</span> */}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-teal-300">
                      {key.lastUsedAt || 'Never'}
                    </td>
                    <td className="py-4 px-4 text-sm text-teal-300">
                      {formatDate(key.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right">

                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Endpoint Information */}
        {/* <div className="mt-6 p-4 bg-teal-800/30 rounded-lg">
          <h3 className="text-sm font-medium text-teal-200 mb-2">MCP Endpoint</h3>
          <code className="text-sm text-teal-100 font-mono">https://api.tamagolabs.com/mcp</code>
        </div> */}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-teal-800 rounded-xl border border-teal-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Access Key</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teal-200 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production Key, Development Key"
                  className="w-full px-3 py-2 bg-teal-700/50 border border-teal-600 rounded-lg text-white placeholder-teal-400 focus:border-teal-500 focus:ring-0"
                  maxLength={50}
                />
                <p className="text-xs text-teal-400 mt-1">
                  Choose a descriptive name to identify this key
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyName('');
                }}
                className="flex-1 px-4 py-2 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white rounded-lg transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim() || creating}
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {creating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Key'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiKeySection;