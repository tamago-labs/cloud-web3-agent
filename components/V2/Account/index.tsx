"use client"

import React, { useState, useReducer, useCallback, useContext, useEffect } from 'react';
import { LineChart, TerminalSquare, Bitcoin, ImagePlus, LogOut, Save, User, Star, Heart, CreditCard, Settings, Download, ExternalLink, ArrowLeft, Bell, Shield, Key, Trash2, Edit, Plus, BarChart3, Wallet, DollarSign, Code, Database, Zap } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"
import { UserCard, UserCardSkeleton } from "./UserCard"
import { AccountContext } from "@/contexts/account";
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { creditAPI, conversationAPI } from "@/lib/api";

// Interfaces for real data
interface CreditInfo {
    current: number;
    used: number;
    total: number;
    remaining: number;
}

interface UsageStats {
    totalExecutions: number;
    totalTokens: number;
    totalCpuMs: number;
    successRate: number;
    byDay: Record<string, { executions: number; tokens: number; cpuMs: number }>;
    timeframe: string;
}

interface ConversationData {
    id: string;
    title: string;
    createdAt: string;
    messageCount?: number;
}

const AccountContainer = () => {

    const { profile, updateProfile, clearProfile } = useContext(AccountContext)

    const [activeTab, setActiveTab] = useState('overview');

    const router = useRouter()

    // Real data states
    const [userCredits, setUserCredits] = useState<CreditInfo | null>(null);
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            displayName: "",
        }
    )

    const { displayName } = values

    useEffect(() => {
        if (profile) {
            dispatch({
                displayName: profile?.displayName
            })
        }
    }, [profile])

    // Load real data when profile is available
    useEffect(() => {
        if (profile?.id) {
            loadRealUserData();
        }
    }, [profile]);

    // Function to load all real user data
    const loadRealUserData = async () => {
        if (!profile?.id) return;
        
        setIsLoadingData(true);
        try {
            // Load real credit data
            const creditsData = await creditAPI.getUserCredits(profile.id);
            setUserCredits(creditsData);

            // Load usage statistics
            const statsData = await creditAPI.getUsageStats(profile.id, 'month');
            setUsageStats(statsData);

            // Load conversations
            const conversationsData = await conversationAPI.getUserConversations(profile.username);
            setConversations(conversationsData.map(conv => ({
                id: conv.id,
                title: conv.title,
                createdAt: conv.createdAt,
                messageCount: 0
            })));

        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSave = useCallback(async () => {
        await updateProfile(profile.id, {
            displayName
        })
    }, [profile, displayName])

    const handleSignOut = async () => {
        try {
            await signOut()
            clearProfile()
            router.push("/")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    // Calculate derived stats from real data
    const derivedStats = {
        conversationsCount: conversations.length,
        artifactsGenerated: usageStats?.totalExecutions || 0,
        creditsRemaining: userCredits?.current || 0,
        creditsUsed: userCredits?.used || 0,
        totalCredits: userCredits?.total || 0,
        creditsPercentage: userCredits ? (userCredits.current / userCredits.total) * 100 : 0
    };



    // Generate real credit history from usage stats
    const generateCreditHistory = () => {
        if (!usageStats?.byDay || !userCredits) return [];
        
        const history = [];
        const days = Object.keys(usageStats.byDay).sort().reverse().slice(0, 5);
        let runningBalance = userCredits.current;
        
        for (const day of days) {
            const dayStats = usageStats.byDay[day];
            const estimatedCost = (dayStats.executions * 0.001) + (dayStats.tokens * 0.00001);
            
            history.push({
                date: day,
                type: 'usage' as const,
                amount: -estimatedCost,
                description: `AI Usage - ${dayStats.executions} operations`,
                balance: runningBalance
            });
            
            runningBalance += estimatedCost;
        }
        
        return history;
    };

    const creditHistory = generateCreditHistory();

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
        { id: 'credits', label: 'Credits & Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
    ];


    return (
        <>
            <Header bgColor="bg-gray-50" />
            <div className="min-h-screen bg-gray-50">


                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Sidebar */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">

                                {profile ? <UserCard name={profile.displayName} plan="Basic" /> : <UserCardSkeleton />}


                                <div className="space-y-4">
                                    {profile && !isLoadingData ? (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Credits</span>
                                                <span className="font-semibold text-gray-900">
                                                    ${userCredits?.current.toFixed(4) || '0.0000'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Conversations</span>
                                                <span className="font-semibold text-gray-900">{derivedStats.conversationsCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">AI Operations</span>
                                                <span className="font-semibold text-gray-900">{derivedStats.artifactsGenerated}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Member since</span>
                                                <span className="font-semibold text-gray-900">{(new Date(profile.createdAt).toLocaleDateString())}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {[1, 2, 3, 4].map((_, i) => (
                                                <div key={i} className="flex justify-between items-center animate-pulse">
                                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                                    <div className="h-4 w-16 bg-gray-300 rounded" />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="mt-6">
                                <div className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleSignOut}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50`}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-8">
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>

                                            {/* Real Credits Progress */}
                                            {userCredits && !isLoadingData ? (
                                                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-6">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-semibold text-gray-900">Credit Usage</h3>
                                                        <span className="text-blue-600 font-medium">${derivedStats.creditsRemaining.toFixed(4)} remaining</span>
                                                    </div>
                                                    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                                                        <div
                                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                                            style={{ width: `${derivedStats.creditsPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        ${derivedStats.creditsUsed.toFixed(4)} used of ${derivedStats.totalCredits.toFixed(4)} total credits
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-gray-100 rounded-xl border border-gray-200 mb-6 animate-pulse">
                                                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                                </div>
                                            )}

                                            {/* Real Quick Stats */}
                                            {!isLoadingData ? (
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="text-green-600 font-medium text-sm">Total Conversations</div>
                                                        <div className="text-2xl font-bold text-green-900">{derivedStats.conversationsCount}</div>
                                                        <div className="text-green-600 text-xs">Real data</div>
                                                    </div>
                                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                        <div className="text-purple-600 font-medium text-sm">AI Operations</div>
                                                        <div className="text-2xl font-bold text-purple-900">{derivedStats.artifactsGenerated}</div>
                                                        <div className="text-purple-600 text-xs">Success rate: {usageStats?.successRate.toFixed(1) || 0}%</div>
                                                    </div>
                                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                                        <div className="text-orange-600 font-medium text-sm">Total Tokens</div>
                                                        <div className="text-2xl font-bold text-orange-900">{usageStats?.totalTokens.toLocaleString() || 0}</div>
                                                        <div className="text-orange-600 text-xs">Processed this month</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    {[1, 2, 3].map((_, i) => (
                                                        <div key={i} className="p-4 bg-gray-100 rounded-lg border border-gray-200 animate-pulse">
                                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                                            <div className="h-8 bg-gray-300 rounded mb-1"></div>
                                                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}



                                {activeTab === 'credits' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Credits & Billing</h2>

                                        {/* Real Current Plan */}
                                        {userCredits && !isLoadingData ? (
                                            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                                                        <p className="text-gray-600">${userCredits.total.toFixed(2)} total credits</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-blue-900">${userCredits.current.toFixed(4)}</div>
                                                        <button 
                                                            onClick={() => setShowAddCreditsModal(true)}
                                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                                        >
                                                            Add Credits
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-blue-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${derivedStats.creditsPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    ${userCredits.current.toFixed(4)} credits remaining • ${userCredits.used.toFixed(4)} used
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-gray-100 rounded-xl border border-gray-200 animate-pulse">
                                                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                                                <div className="h-2 bg-gray-300 rounded mb-2"></div>
                                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            </div>
                                        )}

                                        {/* Real Credit History */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                            {!isLoadingData && creditHistory.length > 0 ? (
                                                <div className="space-y-2">
                                                    {creditHistory.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <div className="font-medium text-gray-900">{item.description}</div>
                                                                <div className="text-sm text-gray-500">{item.date}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className={`font-medium ${
                                                                    item.type === 'usage' ? 'text-red-600' : 'text-green-600'
                                                                    }`}>
                                                                    {item.type === 'usage' ? '-' : '+'}${Math.abs(item.amount).toFixed(4)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">Balance: ${item.balance.toFixed(4)}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : isLoadingData ? (
                                                <div className="space-y-2">
                                                    {[1, 2, 3].map((_, i) => (
                                                        <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
                                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No recent activity found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                                        {/* Profile Settings */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                                    <input
                                                        type="text"
                                                        value={displayName}
                                                        onChange={(e) => dispatch({
                                                            displayName: e.target.value
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={handleSave}
                                                    className="mt-2 cursor-pointer gap-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" />
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Credits Modal */}
                {showAddCreditsModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md mx-4 w-full">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Credits</h3>
                                <p className="text-gray-600 mb-6">
                                    Credit top-up functionality will be available soon! 
                                    For immediate assistance with adding credits, please contact our support team.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setShowAddCreditsModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <a
                                        href="mailto:support@asetta.xyz?subject=Credit%20Top-up%20Request"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AccountContainer;