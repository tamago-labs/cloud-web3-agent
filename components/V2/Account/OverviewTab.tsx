import React from 'react';
import { CreditInfo, UsageStats } from './types';

interface OverviewTabProps {
    userCredits: CreditInfo | null;
    usageStats: UsageStats | null;
    isLoadingData: boolean;
    derivedStats: {
        conversationsCount: number;
        artifactsGenerated: number;
        creditsRemaining: number;
        creditsUsed: number;
        totalCredits: number;
        creditsPercentage: number;
    };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    userCredits,
    usageStats,
    isLoadingData,
    derivedStats
}) => {
    return (
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
    );
};
