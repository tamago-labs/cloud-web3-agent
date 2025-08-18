"use client"

import React, { useState, useReducer, useCallback, useContext, useEffect } from 'react';
import { LogOut, Save, User, CreditCard, Settings, Wallet } from 'lucide-react';
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth"

import Header from "../Landing/Header"
import { UserCard, UserCardSkeleton } from "./UserCard"
import { AccountContext } from "@/contexts/account";
import { creditAPI, conversationAPI } from "@/lib/api";

// Import tab components
import { OverviewTab } from './OverviewTab';
import { CreditsTab } from './CreditsTab';
import { WalletsTab } from './WalletsTab';
import { SettingsTab } from './SettingsTab';

// Import types
import { CreditInfo, UsageStats, ConversationData, TabType } from './types';


const AddCreditsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
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
                            onClick={onClose}
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
    );
};

const AccountContainer = () => {
    const { profile, updateProfile, clearProfile } = useContext(AccountContext);
    const router = useRouter();

    // State
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedBlockchain, setSelectedBlockchain] = useState('aptos'); // Default to SUI
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
    );

    const { displayName } = values;

    // Effects
    useEffect(() => {
        if (profile) {
            dispatch({
                displayName: profile?.displayName
            });
        }
    }, [profile]);
 
    useEffect(() => {
        if (profile?.id) {
            loadUserData();
        }
    }, [profile]);

    // Data loading
    const loadUserData = async () => {
        if (!profile?.id) return;
        
        setIsLoadingData(true);
        try {
            const creditsData = await creditAPI.getUserCredits(profile.id);
            setUserCredits(creditsData);

            const statsData = await creditAPI.getUsageStats(profile.id, 'month');
            setUsageStats(statsData);

            const conversationsData = await conversationAPI.getUserConversations(profile.username);
            setConversations(conversationsData.map((conv: any) => ({
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

    // Handlers
    const handleSave = useCallback(async () => {
        await updateProfile(profile.id, {
            displayName
        });
    }, [profile, displayName]);

    const handleSignOut = async () => {
        try {
            await signOut();
            clearProfile();
            router.push("/");
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };
 

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You can add a toast notification here
    };

    // Calculate derived stats
    const derivedStats = {
        conversationsCount: conversations.length,
        artifactsGenerated: usageStats?.totalExecutions || 0,
        creditsRemaining: userCredits?.current || 0,
        creditsUsed: userCredits?.used || 0,
        totalCredits: userCredits?.total || 0,
        creditsPercentage: userCredits ? (userCredits.current / userCredits.total) * 100 : 0
    };

    // Generate credit history
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

    // Tab configuration
    const tabs = [
        { id: 'overview' as TabType, label: 'Overview', icon: <User className="w-4 h-4" /> },
        { id: 'credits' as TabType, label: 'Credits & Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'wallets' as TabType, label: 'Wallets', icon: <Wallet className="w-4 h-4" /> },
        { id: 'settings' as TabType, label: 'Settings', icon: <Settings className="w-4 h-4" /> }
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
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                                activeTab === tab.id
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
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                                    <OverviewTab
                                        userCredits={userCredits}
                                        usageStats={usageStats}
                                        isLoadingData={isLoadingData}
                                        derivedStats={derivedStats}
                                    />
                                )}

                                {activeTab === 'credits' && (
                                    <CreditsTab
                                        userCredits={userCredits}
                                        isLoadingData={isLoadingData}
                                        creditHistory={creditHistory}
                                        onShowAddCreditsModal={() => setShowAddCreditsModal(true)}
                                    />
                                )}

                                {activeTab === 'wallets' && (
                                    <WalletsTab
                                        selectedBlockchain={selectedBlockchain}
                                        setSelectedBlockchain={setSelectedBlockchain}
                                        wallets={{}}
                                        isCreatingWallet={false}
                                        onCreateWallet={() => {}}
                                        onCopyToClipboard={copyToClipboard}
                                    />
                                )}

                                {activeTab === 'settings' && (
                                    <SettingsTab
                                        displayName={displayName}
                                        onDisplayNameChange={(name) => dispatch({ displayName: name })}
                                        onSave={handleSave}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <AddCreditsModal 
                    isOpen={showAddCreditsModal} 
                    onClose={() => setShowAddCreditsModal(false)} 
                />
            </div>
        </>
    );
};

export default AccountContainer;
