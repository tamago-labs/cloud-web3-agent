import React from 'react';
import { CreditInfo, UsageStats } from './types';

interface CreditsTabProps {
    userCredits: CreditInfo | null;
    isLoadingData: boolean;
    creditHistory: any[];
    onShowAddCreditsModal: () => void;
}

export const CreditsTab: React.FC<CreditsTabProps> = ({
    userCredits,
    isLoadingData,
    creditHistory,
    onShowAddCreditsModal
}) => {
    const creditsPercentage = userCredits ? (userCredits.current / userCredits.total) * 100 : 0;

    return (
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
                            {/* <button 
                                onClick={onShowAddCreditsModal}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Add Credits
                            </button> */}
                        </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${creditsPercentage}%` }}
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
    );
};
