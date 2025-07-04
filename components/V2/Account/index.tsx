"use client"

import React, { useState, useReducer, useCallback, useContext, useEffect } from 'react';
import { Save, User, Star, Heart, CreditCard, Settings, Download, ExternalLink, ArrowLeft, Bell, Shield, Key, Trash2, Edit, Plus, BarChart3, Wallet, DollarSign, Code, Database, Zap } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"
import  { UserCard, UserCardSkeleton } from "./UserCard"
import { AccountContext } from "@/contexts/account";
  

const AccountContainer = () => {

    const { profile, updateProfile } = useContext(AccountContext)
    
    const [activeTab, setActiveTab] = useState('overview');

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
    },[profile])

    const handleSave = useCallback(async () => { 
        await updateProfile(profile.id , { 
            displayName
        }) 
    },[profile, displayName])

    const userStats = {
        name: "Alex Chen",
        email: "alex@example.com",
        joinDate: "January 2024",
        credits: 2847,
        creditsUsed: 1153,
        totalCredits: 4000,
        plan: "Pro",
        conversationsCount: 23,
        artifactsGenerated: 47,
        favoriteServers: 8
    };

    const favoriteServers = [
        {
            id: 1,
            name: "DeFi Analytics Pro",
            author: "DeFi Labs",
            category: "Analytics",
            stars: 342,
            lastUsed: "2 hours ago",
            usageCount: 15,
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            name: "Multi-Chain Wallet",
            author: "Wallet Team", 
            category: "Wallet",
            stars: 298,
            lastUsed: "1 day ago",
            usageCount: 8,
            icon: <Wallet className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            name: "AI Trading Assistant",
            author: "Trade AI",
            category: "Trading",
            stars: 486,
            lastUsed: "3 days ago",
            usageCount: 22,
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500"
        },
        {
            id: 4,
            name: "Smart Contract Auditor",
            author: "Security Labs",
            category: "Security",
            stars: 234,
            lastUsed: "1 week ago",
            usageCount: 5,
            icon: <Shield className="w-5 h-5" />,
            color: "from-red-500 to-orange-500"
        }
    ];

    const creditHistory = [
        { date: "2024-07-03", type: "purchase", amount: 1000, description: "Monthly Pro Plan", balance: 2847 },
        { date: "2024-07-02", type: "usage", amount: -45, description: "DeFi Analytics - Pool Analysis", balance: 1847 },
        { date: "2024-07-02", type: "usage", amount: -32, description: "Risk Calculator - Portfolio Report", balance: 1892 },
        { date: "2024-07-01", type: "usage", amount: -28, description: "Yield Scanner - Opportunity Search", balance: 1924 },
        { date: "2024-06-30", type: "bonus", amount: 100, description: "Referral Bonus", balance: 1952 }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
        { id: 'favorites', label: 'Favorite Servers', icon: <Heart className="w-4 h-4" /> },
        { id: 'credits', label: 'Credits & Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
    ];

    return (
        <>
        <Header bgColor="bg-gray-50"/>
<div className="min-h-screen bg-gray-50">
            

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">

                            { profile ? <UserCard name={profile.displayName} plan="Basic" /> : <UserCardSkeleton/>}

                        
                            <div className="space-y-4">
  {profile ? (
    <>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Credits</span>
        <span className="font-semibold text-gray-900">${profile.credits.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Conversations</span>
        <span className="font-semibold text-gray-900">{0}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Artifacts</span>
        <span className="font-semibold text-gray-900">{0}</span>
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
                                        
                                        {/* Credits Progress */}
                                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900">Credit Usage</h3>
                                                <span className="text-blue-600 font-medium">{userStats.credits} remaining</span>
                                            </div>
                                            <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                                                <div 
                                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${(userStats.credits / userStats.totalCredits) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {userStats.creditsUsed.toLocaleString()} used of {userStats.totalCredits.toLocaleString()} total credits
                                            </p>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                <div className="text-green-600 font-medium text-sm">Total Conversations</div>
                                                <div className="text-2xl font-bold text-green-900">{userStats.conversationsCount}</div>
                                                <div className="text-green-600 text-xs">+3 this week</div>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                <div className="text-purple-600 font-medium text-sm">Artifacts Generated</div>
                                                <div className="text-2xl font-bold text-purple-900">{userStats.artifactsGenerated}</div>
                                                <div className="text-purple-600 text-xs">+8 this week</div>
                                            </div>
                                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                                <div className="text-orange-600 font-medium text-sm">Favorite Servers</div>
                                                <div className="text-2xl font-bold text-orange-900">{userStats.favoriteServers}</div>
                                                <div className="text-orange-600 text-xs">Recently updated</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Favorite MCP Servers</h2>
                                        <Link href="/browse" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Browse Servers
                                        </Link>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {favoriteServers.map((server) => (
                                            <div key={server.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${server.color} flex items-center justify-center text-white`}>
                                                        {server.icon}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm text-gray-600">{server.stars}</span>
                                                        <button className="p-1 text-red-400 hover:text-red-600 transition-colors">
                                                            <Heart className="w-4 h-4 fill-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{server.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3">by {server.author}</p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>Used {server.usageCount} times</span>
                                                    <span>Last: {server.lastUsed}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'credits' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Credits & Billing</h2>
                                    
                                    {/* Current Plan */}
                                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                                                <p className="text-gray-600">4,000 credits per month</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-900">$29/mo</div>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">Manage Plan</button>
                                            </div>
                                        </div>
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(userStats.credits / userStats.totalCredits) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {userStats.credits} credits remaining • Renews July 30
                                        </p>
                                    </div>

                                    {/* Credit History */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
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
                                                            {item.type === 'usage' ? '' : '+'}{item.amount.toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">Balance: {item.balance.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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

                                    {/* Preferences */}
                                    {/*<div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                <span className="text-gray-700">Email notifications for new MCP servers</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="text-gray-700">Weekly usage reports</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                <span className="text-gray-700">Save conversation history</span>
                                            </label>
                                        </div>
                                    </div>*/}

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
        </div>
        </>
    );
};

export default AccountContainer;